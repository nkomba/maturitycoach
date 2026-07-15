@echo off
REM ============================================================
REM  Double-click this file to apply the unified navigation
REM  to every page in this folder. No PowerShell needed.
REM ============================================================
setlocal
cd /d "%~dp0"

echo.
echo Applying unified navigation in:
echo   %cd%
echo.

REM Try the py launcher first, then plain python.
where py >nul 2>nul
if %errorlevel%==0 (
    py "apply-unified-nav.py"
    goto done
)

where python >nul 2>nul
if %errorlevel%==0 (
    python "apply-unified-nav.py"
    goto done
)

echo [ERROR] Python was not found on this computer.
echo Install it from https://www.python.org/downloads/
echo (tick "Add python.exe to PATH" during setup), then run this again.

:done
echo.
echo Finished. Review your pages, then delete the *.bak backups once happy.
echo.
pause
endlocal
