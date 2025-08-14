@echo off
chcp 65001 >nul
set "sortie=liste_dossiers.txt"
if exist %sortie% del %sortie%

:: Parcourt tous les dossiers du répertoire courant
for /d %%d in (*) do (
    echo %%d>>%sortie%
    echo.>>%sortie%
)

echo Liste des dossiers générée dans %sortie%.
pause >nul
