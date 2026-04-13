export async function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const maxWidth = 1024;
    const maxHeight = 1024;
    const quality = 0.7;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
          return;
        }

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas conversion failed"));
            return;
          }
          resolve(blob);
        }, mimeType, quality);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}