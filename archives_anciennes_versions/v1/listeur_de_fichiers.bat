:: Désactive l'affichage des commandes dans la console
@echo off

:: Met la console en encodage UTF-8 pour bien gérer les caractères spéciaux
chcp 65001 >nul

echo Ce programme liste les fichiers du dossier courant et les enregistre dans un fichier texte intitulé "liste_fichiers.txt".
echo ...

:: Définit le nom du fichier de sortie et le nom du script batch lui-même
set "sortie=liste_fichiers.txt"
set "script=%~nx0"
:: %~nx0 :
:: %0 : représente le chemin du script batch lui-même.
:: ~n : extrait le nom du fichier (sans le chemin).
:: ~x : extrait l’extension du fichier.
:: Donc %~nx0 : nom + extension du script batch (exemple : listeur_de_fichiers.bat).

:: Supprime le fichier de sortie s'il existe déjà
if exist %sortie% del %sortie%

:: Parcourt tous les fichiers du dossier courant
:: "*" = n'importe quel nom de fichier ou dossier, avec ou sans extension
for %%f in (*) do (
    echo %%f>>%sortie%
)

:: Affiche un message de confirmation et attend une touche
echo Liste des fichiers générée dans %sortie%.
echo Appuyez pour continuer.
pause >nul
