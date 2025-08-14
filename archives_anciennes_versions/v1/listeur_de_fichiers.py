# list_files.py
import pathlib

# 1. Le dossier à scanner ('.' = dossier courant)
dossier = pathlib.Path('.')

# 2. Le fichier de sortie
sortie = pathlib.Path('liste_fichiers.txt')

# 3. Ouvrir le fichier en écriture et y écrire chaque nom de fichier, sauf le script lui-même
with sortie.open('w', encoding='utf-8') as f:
    for chemin in dossier.iterdir():
        if (
            chemin.is_file()
            and chemin.name != pathlib.Path(__file__).name
            and chemin.name != sortie.name
            and chemin.name != 'lanceur.bat'
        ):
            f.write(f"{chemin.name}\n")

