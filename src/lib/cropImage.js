export function getCroppedImageBlob(imageSrc, cropPixels) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = Math.max(cropPixels.width, cropPixels.height)
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        size,
        size
      )
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error("Rasmni kesishda xatolik")); return }
        resolve(blob)
      }, 'image/jpeg', 0.92)
    }
    img.onerror = reject
    img.src = imageSrc
  })
}
