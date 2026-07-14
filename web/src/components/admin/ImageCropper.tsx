"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { recortarYComprimir, type Area } from "@/lib/cropImage";

export default function ImageCropper({
  imagenSrc,
  onListo,
  onCancelar,
}: {
  imagenSrc: string;
  onListo: (blob: Blob, previewUrl: string) => void;
  onCancelar: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixeles, setAreaPixeles] = useState<Area | null>(null);
  const [procesando, setProcesando] = useState(false);

  const onCropComplete = useCallback((_: Area, area: Area) => {
    setAreaPixeles(area);
  }, []);

  const confirmar = async () => {
    if (!areaPixeles) return;
    setProcesando(true);
    try {
      const blob = await recortarYComprimir(imagenSrc, areaPixeles);
      const url = URL.createObjectURL(blob);
      onListo(blob, url);
    } catch {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-tinta/95 flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between text-marfil border-b border-marfil/10">
        <span className="text-[11px] tracking-[0.25em] uppercase">Ajustar imagen</span>
        <button
          onClick={onCancelar}
          className="text-[11px] tracking-[0.2em] uppercase text-marfil/60 hover:text-marfil transition-colors"
        >
          Cancelar
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imagenSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 5}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="contain"
          showGrid
        />
      </div>

      <div className="px-6 py-5 bg-tinta space-y-5">
        <div className="flex items-center gap-4">
          <span className="text-[9px] tracking-[0.2em] uppercase text-marfil/50 shrink-0">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-arena"
          />
        </div>
        <p className="text-center text-[10px] text-marfil/50 leading-relaxed">
          Arrastra la foto y usa el zoom para elegir qué parte se verá.
          La imagen se guarda liviana y en el formato correcto.
        </p>
        <button
          onClick={confirmar}
          disabled={procesando || !areaPixeles}
          className="w-full bg-marfil text-tinta py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-crema transition-colors disabled:opacity-50"
        >
          {procesando ? "Procesando…" : "Usar esta imagen"}
        </button>
      </div>
    </div>
  );
}
