"use client";

import { mimeTypes } from "@/config";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface FileUploaderProps {
  value: string;
  onChange: (image: string) => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // en MB
  acceptedTypes?: string[];
}

export default function FileUploader({
  value,
  onChange,
  error,
  disabled = false,
  maxSize = 5,
  acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isGlobalDragOver, setIsGlobalDragOver] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar el preview con el prop value cuando cambie externamente
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      // Validar tipo de archivo
      if (!acceptedTypes.includes(file.type)) {
        toast.error("Tipo de archivo no válido", {
          description: `Formatos permitidos: ${acceptedTypes
            .map((type) => type.replace("image/", "."))
            .join(", ")}`,
          duration: 5000,
        });
        return;
      }

      // Validar tamaño
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        toast.error("Archivo muy grande", {
          description: `Tamaño máximo permitido: ${maxSize}MB`,
          duration: 4000,
        });
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result); // Por ahora guardamos el base64, después será la URL del servidor

        // Toast de éxito
        toast.success("Imagen cargada correctamente", {
          description: `Archivo: ${file.name}`,
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
    },
    [acceptedTypes, maxSize, onChange]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      onChange("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onChange]
  );

  // Event listeners globales para drag & drop en toda la página
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!disabled && e.dataTransfer?.types.includes("Files")) {
        setIsGlobalDragOver(true);
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Solo ocultar si el drag sale completamente de la página
      if (!e.relatedTarget || e.relatedTarget === document.body) {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setIsGlobalDragOver(false);
          setIsAnimatingOut(false);
        }, 150);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsGlobalDragOver(false);
        setIsAnimatingOut(false);
      }, 150);

      if (disabled) return;

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    };

    // Agregar event listeners al document
    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("dragleave", handleGlobalDragLeave);
    document.addEventListener("drop", handleGlobalDrop);

    // Cleanup
    return () => {
      document.removeEventListener("dragover", handleGlobalDragOver);
      document.removeEventListener("dragleave", handleGlobalDragLeave);
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, [disabled, handleFile]);

  return (
    <div className="w-full">
      {/* Overlay global para drag & drop */}
      {isGlobalDragOver && !disabled && (
        <div
          className={`fixed inset-0 bg-blue-500/20 z-50 flex items-center justify-center transition-all duration-150 ${
            isAnimatingOut ? "animate-out fade-out" : "animate-in fade-in"
          }`}
        >
          <div
            className={`bg-white rounded-lg p-8 shadow-xl border-2 border-blue-400 transition-all duration-150 ${
              isAnimatingOut
                ? "animate-out zoom-out-95"
                : "animate-in zoom-in-95"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto w-16 h-16 text-blue-500 mb-4">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Soltá la imagen aquí
              </h3>
              <p className="text-sm text-gray-600">
                La imagen se subirá automáticamente
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              className="mx-auto rounded-lg shadow-sm object-contain"
              width={300}
              height={300}
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 h-32">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Hacé clic para subir
              </span>{" "}
              o arrastrá y soltá
            </div>
            <div className="text-xs text-gray-500">
              {Object.values(mimeTypes.image).join(", ")} hasta {maxSize}MB
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
