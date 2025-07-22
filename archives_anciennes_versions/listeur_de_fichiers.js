// listeur_de_fichiers.js
// Un petit script Node.js pour lister les fichiers du dossier courant

// Modules Node.js : 'fs' pour accéder au système de fichiers, 'path' pour gérer les chemins
const fs = require('fs');
const path = require('path');

// 1. Dossier à scanner ('.' = dossier courant)
// __dirname : chemin du dossier contenant ce script
const directory = __dirname;

// 2. Fichier de sortie
// Définit le chemin complet du fichier de sortie 'liste_de_fichiers.txt'
// Si on se contente de passer simplement 'liste_de_fichiers.txt' à fs.writeFileSync, le fichier sera créé dans le dossier courant (process.cwd()), qui n’est pas forcément le même que celui du script.
const outputFile = path.join(directory, 'liste_de_fichiers.txt');

// 3. Nom du script pour l'exclure
// Récupère le nom du script actuel pour l'exclure de la liste
// path.basename(pathString) : extrait le nom de fichier depuis un chemin complet
const scriptName = path.basename(__filename);

// Récupère tous les éléments du dossier
// Lit de manière synchrone tous les noms (fichiers et dossiers) dans 'directory'
// fs.readdirSync(path) : lit synchronement le dossier 'path' et retourne un tableau de noms (string)
const entries = fs.readdirSync(directory);

// Filtre uniquement les fichiers (exclut le script et le fichier de sortie)
const files = entries.filter(name => {
  const fullPath = path.join(directory, name);
  // fs.statSync(path) : récupère les métadonnées du fichier/dossier au chemin donné et retourne un objet Stats
  // On utilise isFile() pour vérifier que l’entrée est bien un fichier (et pas un dossier) avant de l’inclure
  return (
    fs.statSync(fullPath).isFile() &&
    name !== scriptName &&
    name !== path.basename(outputFile)
  );
});

// Ajoute la date de dernière mise à jour
// Formate la date actuelle en français (jj/mm/aaaa hh:mm:ss)
const now = new Date().toLocaleString('fr-FR');
// Ajoute la date de dernière mise à jour à la fin de la liste
files.push(`Date de la dernière mise à jour : ${now}`);

// Écrit chaque nom de fichier un par ligne
// Écrit chaque nom de fichier (et la date) un par ligne dans 'liste_fichiers.txt'
// array.join(separator) : concatène les éléments du tableau en une chaîne, séparés par 'separator'
// fs.writeFileSync(file, data, encoding) : écrit de manière synchrone 'data' (string) dans 'file' avec l'encodage spécifié
fs.writeFileSync(outputFile, files.join('\n'), 'utf-8');
// Affiche un message de confirmation avec le chemin du fichier généré
console.log(`Liste des fichiers enregistrée dans ${outputFile}`);

