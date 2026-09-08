$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$PythonPath = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $PythonPath)) {
    Write-Host 'Project environment is missing. Running setup first...'
    & (Join-Path $PSScriptRoot 'setup.ps1')
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $PythonPath)) {
        throw 'Project setup failed. Run scripts/setup.ps1 and retry.'
    }
}
$LogDirectory = Join-Path $ProjectRoot 'work'
New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null
$Processes = @()
try {
    $BackendResponse = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8000/health' -TimeoutSec 2
    Write-Host 'A service is already listening on port 8000. Reusing it; verify the dataset in the app.'
} catch {
    $BackendProcess = Start-Process -FilePath $PythonPath -ArgumentList @('-m','uvicorn','app.main:app','--host','127.0.0.1','--port','8000') -WorkingDirectory $ProjectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $LogDirectory 'api.stdout.log') -RedirectStandardError (Join-Path $LogDirectory 'api.stderr.log')
    $Processes += @{ id = $BackendProcess.Id; start = $BackendProcess.StartTime.ToUniversalTime().ToString('o') }
}
try {
    $FrontendResponse = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 2
    Write-Host 'A service is already listening on port 5173. Reusing it.'
} catch {
    $NodePath = (Get-Command node.exe).Source
    $FrontendProcess = Start-Process -FilePath $NodePath -ArgumentList @('node_modules/vite/bin/vite.js','--host','127.0.0.1') -WorkingDirectory (Join-Path $ProjectRoot 'frontend') -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $LogDirectory 'web.stdout.log') -RedirectStandardError (Join-Path $LogDirectory 'web.stderr.log')
    $Processes += @{ id = $FrontendProcess.Id; start = $FrontendProcess.StartTime.ToUniversalTime().ToString('o') }
}
if ($Processes.Count -gt 0) {
    $PidFile = Join-Path $LogDirectory 'dev-processes.json'
    $Previous = @()
    if (Test-Path -LiteralPath $PidFile) { $Previous = @(Get-Content -Raw -LiteralPath $PidFile | ConvertFrom-Json) }
    @($Previous + $Processes) | ConvertTo-Json | Set-Content -LiteralPath $PidFile
}
Write-Host 'Dashboard: http://127.0.0.1:5173/ | API docs: http://127.0.0.1:8000/docs'
