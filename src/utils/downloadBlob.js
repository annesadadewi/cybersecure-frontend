/**
 * Unduh blob via anchor in-memory — tidak memakai window.open() atau href ke URL API
 * (menghindari IDM / tab baru / kehilangan header Authorization).
 */
export function triggerBlobDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  anchor.setAttribute('rel', 'noopener');
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

export async function assertPdfBlob(blob) {
  const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
  const isPdf =
    header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
  if (isPdf) return;

  const text = await blob.text();
  try {
    const err = JSON.parse(text);
    throw new Error(err.message || 'Export PDF gagal');
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Server tidak mengembalikan file PDF valid.');
    }
    throw e;
  }
}
