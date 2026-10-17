@echo off
setlocal

where py >nul 2>nul
if errorlevel 1 goto use_python

py -3 "%~dp0convert_photos.py"
exit /b %errorlevel%

:use_python
where python >nul 2>nul
if errorlevel 1 (
    echo Python 3 is required. Install Python and Pillow, then run this command again.
    exit /b 1
)

python "%~dp0convert_photos.py"
exit /b %errorlevel%
