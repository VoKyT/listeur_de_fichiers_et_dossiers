/**
 * Service de formatage des fichiers et données
 */

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase() || 'sans extension';
};

export const getFileIcon = (filename, isDirectory) => {
  if (isDirectory) return '📁';
  
  const ext = getFileExtension(filename);
  const iconMap = {
    'js': '📄',
    'jsx': '⚛️',
    'ts': '📘',
    'tsx': '⚛️',
    'css': '🎨',
    'scss': '🎨',
    'html': '🌐',
    'json': '📊',
    'md': '📝',
    'txt': '📄',
    'pdf': '📕',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'zip': '📦',
    'exe': '⚙️'
  };
  
  return iconMap[ext] || '📄';
};
