export type Area = { x: number; y: number; width: number; height: number };

// Recorta la región seleccionada y la exporta como JPEG comprimido con
// relación 4:5 (la misma de las tarjetas de producto). Reduce el peso a
// unos ~200-400KB sin importar el tamaño original de la foto.
export async function recortarYComprimir(
  imageSrc: string,
  area: Area,
  opciones: { anchoSalida?: number; calidad?: number } = {}
): Promise<Blob> {
  const anchoSalida = opciones.anchoSalida ?? 1080;
  const altoSalida = Math.round((anchoSalida * 5) / 4); // 4:5
  const calidad = opciones.calidad ?? 0.85;

  const img = await cargarImagen(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = anchoSalida;
  canvas.height = altoSalida;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el lienzo.");

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    anchoSalida,
    altoSalida
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", calidad)
  );
  if (!blob) throw new Error("No se pudo procesar la imagen.");
  return blob;
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}
