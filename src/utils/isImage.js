export default function isImage(file, types = []) {
  return file.type === 'image/png' || 
    file.type === 'image/jpeg' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif' ||
    types.includes(file.type);
}
