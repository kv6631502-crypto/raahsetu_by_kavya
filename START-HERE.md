# Team ke liye start yahan se karo

Project ka working naam **RaahSetu** hai. Final naam team decide karegi.

## App kholo

PowerShell mein `D:\FORSIH` open karke:

```powershell
.\scripts\start.ps1
```

Dashboard: http://127.0.0.1:5173/

## Pehla demo

1. **North-East logistics sandbox** select rakho. Ismein roads aur hazards synthetic hain.
2. West distribution hub se East medical depot ka fastest aur risk-aware route compare karo.
3. Risk preference slider move karo. Time aur exposure ka tradeoff dekho.
4. **Bypass closure** select karke detour dekho.
5. **Depot isolated** select karke no-feasible-route result dikhao.
6. **Guwahati OSM pilot** select karke actual roads aur downloaded elevation inspect karo.
7. Real OSM risk evidence abhi incomplete hai. Is point ko judges se clearly explain karna.
8. Export comparison se exact input, output aur graph version save karo.

Regional data activate karne ke liye processed OSM extracts ke baad yeh command chalao:

```powershell
.\.venv\Scripts\python.exe scripts\prepare_runtime.py
```

Dashboard ke data-readiness indicator aur `http://127.0.0.1:8000/api/v1/data-status`
endpoint se confirm karo ki snapshots API ke liye ready hain.

## Kya padhna hai

- `README.md`: setup aur code structure
- `docs/TEAM_PLAN.md`: 6 members ka ownership
- `docs/ARCHITECTURE.md`: algorithm aur API decisions
- `datasets/README.md`: actually downloaded data ka summary
- `docs/DATA.md`: sources, licenses aur gaps
- `docs/DEPLOYMENT.md`: Supabase, Docker aur K8s
- `docs/COMPLETION-AUDIT.md`: original brief ka requirement-by-requirement status
- `docs/presentation/`: editable PPT

## Sab kuch verify karo

```powershell
.\scripts\verify.ps1
```

Yeh backend tests, routing evaluation, source-data integrity, code checks aur frontend production build ek saath run karta hai.

## Agla coding milestone

Supabase mein real observations import karna, unke coordinates aur road matches review karna, aur accepted evidence se naya risk snapshot banana. Current real OSM network par unverified hazards automatically apply nahi kiye gaye hain.

Team ko official SIH statement copy, final corridor, deadline aur member strengths confirm karni hain. Supabase project/VM access milne par prepared deployment ko actual infrastructure par verify karna hoga.
