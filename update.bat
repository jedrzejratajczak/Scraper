@echo off
echo Updating...
echo.

git stash
git pull
bun install
del logs.txt

echo.
echo App updated.
pause
