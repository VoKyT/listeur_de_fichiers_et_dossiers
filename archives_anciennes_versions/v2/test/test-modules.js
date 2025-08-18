/**
 * Tests pour l'architecture modulaire avancée - v2.0.1
 * Valide que tous les 20 modules se chargent et fonctionnent correctement
 * Inclut des tests spécifiques pour ReportSectionBuilder et WorkflowOrchestrator
 */

const path = require('path');

console.log('🧪 Tests de l\'architecture modulaire - Listeur v2.0.1');
console.log('='.repeat(60));

const tests = [];
let passedTests = 0;
let failedTests = 0;

/**
 * Fonction utilitaire pour tester le chargement d'un module
 */
function testModuleLoad(moduleName, modulePath) {
  try {
    const module = require(modulePath);
    if (module && typeof module === 'function') {
      tests.push({ name: moduleName, status: 'PASS', message: 'Module chargé avec succès' });
      passedTests++;
      return true;
    } else {
      tests.push({ name: moduleName, status: 'FAIL', message: 'Module chargé mais structure invalide' });
      failedTests++;
      return false;
    }
  } catch (error) {
    tests.push({ name: moduleName, status: 'FAIL', message: error.message });
    failedTests++;
    return false;
  }
}

/**
 * Fonction pour tester l'instanciation d'un module
 */
function testModuleInstantiation(moduleName, modulePath) {
  try {
    const ModuleClass = require(modulePath);
    const instance = new ModuleClass();
    
    if (instance && typeof instance === 'object') {
      tests.push({ name: `${moduleName} (instance)`, status: 'PASS', message: 'Instanciation réussie' });
      passedTests++;
      return true;
    } else {
      tests.push({ name: `${moduleName} (instance)`, status: 'FAIL', message: 'Instanciation échouée' });
      failedTests++;
      return false;
    }
  } catch (error) {
    tests.push({ name: `${moduleName} (instance)`, status: 'FAIL', message: error.message });
    failedTests++;
    return false;
  }
}

// === TESTS DES MODULES CORE ===
console.log('📁 Test des modules Core/Exploration...');
testModuleLoad('ExclusionFilter', '../src/core/exploration/exclusion-filter.js');
testModuleLoad('PathResolver', '../src/core/exploration/path-resolver.js');
testModuleLoad('DirectoryExplorer', '../src/core/exploration/directory-explorer.js');

console.log('📝 Test des modules Core/Formatting...');
testModuleLoad('CounterCalculator', '../src/core/formatting/counter-calculator.js');
testModuleLoad('NumberingFormatter', '../src/core/formatting/numbering-formatter.js');
testModuleLoad('TreeBuilder', '../src/core/formatting/tree-builder.js');

console.log('📊 Test des modules Core/Statistics...');
testModuleLoad('PerformanceTracker', '../src/core/statistics/performance-tracker.js');
testModuleLoad('ElementCounter', '../src/core/statistics/element-counter.js');
testModuleLoad('ProgressTracker', '../src/core/statistics/progress-tracker.js');

console.log('📄 Test des modules Core/Output...');
testModuleLoad('TextFormatter', '../src/core/output/text-formatter.js');
testModuleLoad('ReportGenerator', '../src/core/output/report-generator.js');
testModuleLoad('ReportSectionBuilder', '../src/core/output/report-section-builder.js');
testModuleLoad('FileWriter', '../src/core/output/file-writer.js');

console.log('🔀 Test des modules Core/Workflow...');
testModuleLoad('WorkflowOrchestrator', '../src/core/workflow-orchestrator.js');

// === TESTS DES MODULES INFRASTRUCTURE ===
console.log('🔧 Test des modules Infrastructure...');
testModuleLoad('NotificationService', '../src/infrastructure/notification-service.js');
testModuleLoad('FileSystemManager', '../src/infrastructure/filesystem-manager.js');

// === TESTS DES MODULES CONFIGURATION ===
console.log('⚙️ Test des modules Configuration...');
testModuleLoad('DefaultConfig', '../src/config/default-config.js');
testModuleLoad('ConfigManager', '../src/config/config-manager.js');

// === TESTS DES MODULES UTILITAIRES ===
console.log('🛠️ Test des modules Utilitaires...');
testModuleLoad('ValidationUtils', '../src/utils/validation-utils.js');
testModuleLoad('ErrorHandler', '../src/utils/error-handler.js');

// === TEST DU FICHIER PRINCIPAL ===
console.log('🎯 Test du fichier principal d\'orchestration...');
testModuleLoad('FileSystemExplorerOrchestrator', '../listeur_de_fichiers_et_dossiers.js');

// === TESTS D'INSTANCIATION ===
console.log('\n🏗️ Tests d\'instanciation des modules...');
testModuleInstantiation('ExclusionFilter', '../src/core/exploration/exclusion-filter.js');
testModuleInstantiation('DirectoryExplorer', '../src/core/exploration/directory-explorer.js');
testModuleInstantiation('PerformanceTracker', '../src/core/statistics/performance-tracker.js');
testModuleInstantiation('ProgressTracker', '../src/core/statistics/progress-tracker.js');
testModuleInstantiation('ReportGenerator', '../src/core/output/report-generator.js');
testModuleInstantiation('FileWriter', '../src/core/output/file-writer.js');
testModuleInstantiation('NotificationService', '../src/infrastructure/notification-service.js');
testModuleInstantiation('FileSystemManager', '../src/infrastructure/filesystem-manager.js');
testModuleInstantiation('ConfigManager', '../src/config/config-manager.js');
testModuleInstantiation('ErrorHandler', '../src/utils/error-handler.js');

// === TESTS D'INSTANCIATION POUR LES NOUVEAUX MODULES ===
console.log('\n🆕 Tests d\'instanciation des nouveaux modules...');
// Note: ReportSectionBuilder a des méthodes statiques, pas besoin d'instanciation
try {
  const ReportSectionBuilder = require('../src/core/output/report-section-builder.js');
  if (ReportSectionBuilder && typeof ReportSectionBuilder.buildAllSections === 'function') {
    tests.push({ name: 'ReportSectionBuilder (static methods)', status: 'PASS', message: 'Méthodes statiques accessibles' });
    passedTests++;
  } else {
    tests.push({ name: 'ReportSectionBuilder (static methods)', status: 'FAIL', message: 'Méthodes statiques non accessibles' });
    failedTests++;
  }
} catch (error) {
  tests.push({ name: 'ReportSectionBuilder (static methods)', status: 'FAIL', message: error.message });
  failedTests++;
}

// WorkflowOrchestrator nécessite un contexte pour l'instanciation
try {
  const WorkflowOrchestrator = require('../src/core/workflow-orchestrator.js');
  const mockContext = {
    workingDirectory: __dirname,
    outputFile: 'test.txt',
    performanceTracker: { start: () => {}, milestone: () => {} },
    progressTracker: { startOperation: () => {}, incrementProgress: () => {}, completeOperation: () => {} },
    notificationService: { notify: () => Promise.resolve(), notifySuccess: () => Promise.resolve() },
    fileSystemManager: { checkAccess: () => Promise.resolve({ success: true, accessible: true }) },
    explorationResults: { directories: [], files: [] },
    reportGenerator: { setMetadata: () => {}, addSection: () => {}, generate: () => '' },
    fileWriter: { writeFile: () => ({ success: true }) }
  };
  const workflowOrchestrator = new WorkflowOrchestrator(mockContext);
  
  if (workflowOrchestrator && typeof workflowOrchestrator.initializeAndValidate === 'function') {
    tests.push({ name: 'WorkflowOrchestrator (instance)', status: 'PASS', message: 'Instanciation réussie avec contexte' });
    passedTests++;
  } else {
    tests.push({ name: 'WorkflowOrchestrator (instance)', status: 'FAIL', message: 'Instanciation échouée' });
    failedTests++;
  }
} catch (error) {
  tests.push({ name: 'WorkflowOrchestrator (instance)', status: 'FAIL', message: error.message });
  failedTests++;
}

// === TEST FONCTIONNEL BASIQUE ===
console.log('\n🔬 Test fonctionnel basique...');

// Test ExclusionFilter
try {
  const ExclusionFilter = require('../src/core/exploration/exclusion-filter.js');
  const filter = new ExclusionFilter();
  filter.addExcludedDirectory('node_modules');
  
  const shouldExclude = filter.shouldExcludeDirectory('node_modules');
  if (shouldExclude) {
    tests.push({ name: 'Test fonctionnel ExclusionFilter', status: 'PASS', message: 'Filtrage fonctionnel' });
    passedTests++;
  } else {
    tests.push({ name: 'Test fonctionnel ExclusionFilter', status: 'FAIL', message: 'Filtrage non fonctionnel' });
    failedTests++;
  }
} catch (error) {
  tests.push({ name: 'Test fonctionnel ExclusionFilter', status: 'FAIL', message: error.message });
  failedTests++;
}

// Test ReportSectionBuilder
try {
  const ReportSectionBuilder = require('../src/core/output/report-section-builder.js');
  const PerformanceTracker = require('../src/core/statistics/performance-tracker.js');
  
  const mockStats = { total: 10, dossiers: { total: 5, rootCount: 2 }, fichiers: { total: 5, rootCount: 3 } };
  const mockTime = 1000;
  const mockWorkingDirectory = __dirname;
  const mockDirectories = [{ name: 'test' }, { name: 'src' }];
  
  const headerSection = ReportSectionBuilder.buildHeaderSection(mockStats, mockTime, mockWorkingDirectory, mockDirectories);
  if (headerSection && headerSection.includes('STATISTIQUES')) {
    tests.push({ name: 'Test fonctionnel ReportSectionBuilder', status: 'PASS', message: 'Construction de sections fonctionnelle' });
    passedTests++;
  } else {
    tests.push({ name: 'Test fonctionnel ReportSectionBuilder', status: 'FAIL', message: 'Construction de sections non fonctionnelle' });
    failedTests++;
  }
} catch (error) {
  tests.push({ name: 'Test fonctionnel ReportSectionBuilder', status: 'FAIL', message: error.message });
  failedTests++;
}

// === AFFICHAGE DES RÉSULTATS ===
console.log('\n' + '='.repeat(60));
console.log('📋 RÉSULTATS DES TESTS');
console.log('='.repeat(60));

tests.forEach(test => {
  const status = test.status === 'PASS' ? '✅' : '❌';
  const statusColor = test.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`${status} ${statusColor}${test.status}${reset} - ${test.name}`);
  if (test.status === 'FAIL') {
    console.log(`   └─ ${test.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 STATISTIQUES FINALES:`);
console.log(`   ✅ Tests réussis: ${passedTests}`);
console.log(`   ❌ Tests échoués: ${failedTests}`);
console.log(`   📈 Taux de réussite: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);

if (failedTests === 0) {
  console.log('\n🎉 TOUS LES TESTS SONT PASSÉS ! Architecture modulaire opérationnelle.');
  process.exit(0);
} else {
  console.log('\n⚠️ Certains tests ont échoué. Vérifiez l\'architecture modulaire.');
  process.exit(1);
}

/*
=== GUIDE DES TESTS ===

Ce fichier teste:
1. 📦 Chargement de tous les modules (20 modules)
2. 🏗️ Instanciation des classes principales  
3. 🆕 Tests spécifiques pour les nouveaux modules (ReportSectionBuilder, WorkflowOrchestrator)
4. 🔬 Test fonctionnel basique d'un module
5. 🎯 Chargement du fichier d'orchestration principal

MODULES TESTÉS (20 total):
- Core Business Logic (11 modules) : exploration, formatting, statistics, output, workflow
- Infrastructure (2 modules) : notifications, filesystem
- Configuration (2 modules) : config par défaut et dynamique  
- Utilitaires (2 modules) : validation, gestion d'erreurs
- Orchestration (1 module) : fichier principal

NOUVEAUTÉS v2.0.1:
- ReportSectionBuilder : Construction spécialisée des sections de rapport
- WorkflowOrchestrator : Orchestration fine des étapes de workflow

UTILISATION:
  npm test
  # ou
  node test/test-modules.js

Les tests valident que l'architecture modulaire est correctement mise en place
et que tous les modules peuvent être importés et utilisés.
*/
