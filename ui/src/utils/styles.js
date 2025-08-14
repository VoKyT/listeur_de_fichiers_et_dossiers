/**
 * Constantes de style réutilisables pour l'application
 */

export const FONTS = {
  heading: 'Poppins, sans-serif',
  body: 'Inter, sans-serif',
  mono: 'JetBrains Mono, monospace'
};

export const BUTTON_STYLES = {
  primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide disabled:transform-none",
  secondary: "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide"
};

export const CONTAINER_STYLES = {
  main: "bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen",
  card: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8",
  info: "mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200",
  content: "bg-slate-50 rounded-xl p-6 border border-slate-200",
  fileItem: "flex items-center p-3 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
};
