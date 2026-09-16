export async function prepareImage(file: File): Promise<Blob> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Format accepté : JPG, PNG ou WEBP.");
  }
  if (file.size > 30_000_000) throw new Error("Choisissez une image de moins de 30 Mo.");

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Impossible de préparer l’image dans ce navigateur.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) => value ? resolve(value) : reject(new Error("Compression impossible.")),
        "image/webp",
        0.82,
      ),
    );
    if (blob.size > 4_000_000) {
      throw new Error("Image trop volumineuse après compression. Choisissez une image plus petite.");
    }
    return blob;
  } finally {
    bitmap.close();
  }
}
