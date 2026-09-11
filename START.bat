@echo off
cd /d "%~dp0"
echo Buka http://127.0.0.1:4174 di browser setelah server siap.
echo Biarkan jendela ini terbuka selama belajar. Tekan Ctrl+C untuk berhenti.
node server.cjs
pause
