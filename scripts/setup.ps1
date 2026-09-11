$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Push-Location $ProjectRoot
try {
    if (-not (Test-Path -LiteralPath '.venv\Scripts\python.exe')) { py -3.12 -m venv .venv }
    & '.\.venv\Scripts\python.exe' -m pip install -e 'backend[dev,data]'
    if ($LASTEXITCODE -ne 0) { throw 'Python setup failed.' }
    & '.\.venv\Scripts\python.exe' 'scripts\generate_northeast_dataset.py'
    Push-Location frontend
    try { npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'Frontend setup failed.' } } finally { Pop-Location }
    Write-Host 'Setup complete. Run scripts/start.ps1.'
} finally { Pop-Location }
