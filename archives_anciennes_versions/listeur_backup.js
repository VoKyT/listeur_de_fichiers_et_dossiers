#!/usr/bin/env node
// listeur_de_fichiers_et_dossiers.js
// Script Node.js pour lister fichiers// 🎯 Fonction principale avec interface ultra stylée
async function main() {
  console.clear(); // Efface la console pour un affichage propre
  
  // 🎨 Bannière de démarrage ultra stylée
  console.log(style.accent('\n╔══════════════════════════════════════════════════════════╗'));
  console.log(style.accent('║') + style.highlight('              🗂️  LISTEUR DE FICHIERS ET DOSSIERS              ') + style.accent('║'));
  console.log(style.accent('║') + style.dim('                      Version 3.0 Interactive                    ') + style.accent('║'));
  console.log(style.accent('╚══════════════════════════════════════════════════════════╝\n'));

  // 🎛️ Menu interactif
  const options = await showInteractiveMenu();
  
  // Chemin du dossier à scanner
  const directory = options.directory; du répertoire courant

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { spawn } = require('child_process');
const pc = require('picocolors');
const { input, select, confirm } = require('@inquirer/prompts');

// 🎨 Fonctions de coloration ultra-stylées avec picocolors
const style = {
  title: (text) => pc.bold(pc.cyan(text)),
  success: (text) => pc.bold(pc.green(text)),
  info: (text) => pc.bold(pc.blue(text)),
  warning: (text) => pc.bold(pc.yellow(text)),
  error: (text) => pc.bold(pc.red(text)),
  accent: (text) => pc.bold(pc.magenta(text)),
  highlight: (text) => pc.bold(pc.white(text)),
  dim: (text) => pc.dim(text),
  rainbow: (text) => pc.bgMagenta(pc.yellow(pc.bold(text)))
};

// 🎉 Fonction ultra stylée pour afficher des popups Windows natives + console stylée
function showStyledPopup(title, message, type = 'info') {
  // 🎨 Affichage console ultra stylé avec picocolors
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '🎯';
  const colorFunc = style[type] || style.info;
  
  console.log('\n' + style.rainbow('═'.repeat(60)));
  console.log(colorFunc(`${icon} ${title}`));
  console.log(style.rainbow('═'.repeat(60)));
  console.log(style.highlight(message));
  console.log(style.rainbow('═'.repeat(60)) + '\n');

  // 🪟 Popup Windows native - VERSION NON-BLOQUANTE avec spawn
  try {
    const child = spawn('msg', ['*', `${title}\n\n${message}`], {
      stdio: 'ignore',
      detached: true
    });
    child.unref(); // Permet au processus parent de continuer sans attendre
  } catch (error) {
    // Silencieux - l'affichage console suffit
  }
}

// �️ Interface interactive avec @inquirer/prompts
async function showInteractiveMenu() {
  console.log(style.rainbow('\n🎛️  Interface Interactive Stylée\n'));
  
  const mode = await select({
    message: style.info('Que voulez-vous faire ?'),
    choices: [
      { name: '📂 Analyser le dossier courant (par défaut)', value: 'default' },
      { name: '🎯 Choisir un dossier spécifique', value: 'custom' },
      { name: '⚙️ Options avancées', value: 'advanced' },
      { name: '❌ Quitter', value: 'quit' }
    ]
  });

  if (mode === 'quit') {
    console.log(style.warning('👋 Au revoir !'));
    process.exit(0);
  }

  let targetDirectory = process.cwd();
  
  if (mode === 'custom') {
    targetDirectory = await input({
      message: style.info('Entrez le chemin du dossier à analyser:'),
      default: process.cwd()
    });
    
    if (!fs.existsSync(targetDirectory)) {
      console.log(style.error('❌ Ce dossier n\'existe pas !'));
      return showInteractiveMenu();
    }
  }

  if (mode === 'advanced') {
    const showPopups = await confirm({
      message: style.info('Afficher les popups Windows ?'),
      default: true
    });
    
    const includeHidden = await confirm({
      message: style.info('Inclure les fichiers cachés ?'),
      default: false
    });
    
    return { directory: targetDirectory, showPopups, includeHidden };
  }

  return { directory: targetDirectory, showPopups: true, includeHidden: false };
}

// �🎯 Fonction principale avec interface ultra stylée
async function main() {
  console.clear(); // Efface la console pour un affichage propre
  
  // 🎨 Bannière de démarrage ultra stylée
  console.log(style.accent('\n╔══════════════════════════════════════════════════════════╗'));
  console.log(style.accent('║') + style.highlight('              🗂️  LISTEUR DE FICHIERS ET DOSSIERS              ') + style.accent('║'));
  console.log(style.accent('║') + style.dim('                      Version 2.0 Ultra Stylée                   ') + style.accent('║'));
  console.log(style.accent('╚══════════════════════════════════════════════════════════╝\n'));

  // Chemin du dossier à scanner (répertoire courant pour l'exe SEA, répertoire du script sinon)
  const directory = process.env.NODE_SEA || process.pkg ? process.cwd() : __dirname;

  // Fichier de sortie
  const outputFile = path.join(directory, 'liste_de_fichiers_et_dossiers.txt');
  const outputFileName = path.basename(outputFile);

  console.log(style.info('📁 Dossier analysé: ') + style.highlight(directory));
  console.log(style.info('💾 Fichier de sortie: ') + style.highlight(outputFileName));

  // 🎯 Popup d'information stylée au début
  showStyledPopup(
    '🗂️ Listeur de fichiers et dossiers',
    `Ce programme va analyser le dossier courant et créer un fichier "${outputFileName}" avec la liste complète des fichiers et dossiers.`,
    'info'
  );

  // Nom de ce script pour l'exclure de la liste
  const scriptName = path.basename(__filename);

  console.log(style.info('🔍 Analyse en cours...'));

  // Récupère tous les éléments (fichiers et dossiers)
  const entries = fs.readdirSync(directory);

  // Sépare dossiers et fichiers, exclut le script et le fichier de sortie
  const dirs = entries.filter(name => {
    const fullPath = path.join(directory, name);
    return (
      fs.statSync(fullPath).isDirectory() &&
      name !== scriptName &&
      name !== path.basename(outputFile)
    );
  });
  const files = entries.filter(name => {
    const fullPath = path.join(directory, name);
    return (
      fs.statSync(fullPath).isFile() &&
      name !== scriptName &&
      name !== path.basename(outputFile)
    );
  });

  // 📊 Affichage des statistiques stylées
  console.log('\n' + style.success('📊 RÉSULTATS DE L\'ANALYSE:'));
  console.log('┌─────────────────────────────────────┐');
  console.log(`│ 📁 Dossiers trouvés: ${style.accent(String(dirs.length).padStart(13))} │`);
  console.log(`│ 📄 Fichiers trouvés: ${style.accent(String(files.length).padStart(13))} │`);
  console.log('└─────────────────────────────────────┘\n');

  // Formate la date actuelle en français (jj/mm/aaaa hh:mm:ss)
  const now = new Date().toLocaleString('fr-FR');

  // Prépare les zones : dossiers, fichiers et date
  const outputLines = [];
  outputLines.push('═══════════════════════════════════════════════════════════');
  outputLines.push('                LISTEUR DE FICHIERS ET DOSSIERS');
  outputLines.push('                        Version 2.0 Ultra');
  outputLines.push('═══════════════════════════════════════════════════════════');
  outputLines.push('');
  outputLines.push('📁 DOSSIERS :');
  outputLines.push('─'.repeat(50));
  if (dirs.length === 0) {
    outputLines.push('(vide)');
  } else {
    dirs.forEach(dir => outputLines.push(`  └─ ${dir}`));
  }
  outputLines.push('');
  outputLines.push('📄 FICHIERS :');
  outputLines.push('─'.repeat(50));
  if (files.length === 0) {
    outputLines.push('(vide)');
  } else {
    files.forEach(file => outputLines.push(`  └─ ${file}`));
  }
  outputLines.push('');
  outputLines.push('═══════════════════════════════════════════════════════════');
  outputLines.push(`📅 Date de génération : ${now}`);
  outputLines.push(`📊 Statistiques : ${dirs.length} dossier(s), ${files.length} fichier(s)`);
  outputLines.push('═══════════════════════════════════════════════════════════');

  console.log(style.info('💾 Écriture du fichier...'));

  // Écrit chaque élément un par ligne dans le fichier de sortie
  fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

  console.log(style.success('✅ Fichier créé avec succès !'));

  // ✅ Popup de succès ultra stylée
  showStyledPopup(
    '✅ Mission accomplie !',
    `🎯 Analyse terminée avec succès !\n\n📁 ${dirs.length} dossier(s) trouvé(s)\n📄 ${files.length} fichier(s) trouvé(s)\n\n💾 Résultats sauvegardés dans "${outputFileName}"`,
    'success'
  );

  console.log(style.accent('\n🎉 Programme terminé ! Merci d\'avoir utilisé le Listeur Ultra Stylé ! 🎉\n'));
}

// Lancement du programme
main().catch(error => {
  console.error(style.error('❌ Erreur lors de l\'exécution:'), error.message);
  process.exit(1);
});

/*
🚀 Pour créer l'exécutable avec yao-pkg :
npm run build
.\listeur_de_fichiers_et_dossiers.exe

🎨 Fonctionnalités Version 3.0 :
- Interface console ultra stylée avec picocolors
- Menu interactif avec @inquirer/prompts  
- Popups Windows natives avec msg.exe
- Support complet des modules externes
- Compatible yao-pkg pour exécutables standalone
- Bannière et statistiques visuelles
- Fichier de sortie formaté avec style
*/