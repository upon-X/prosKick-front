"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { LocationSelector } from "@/components/common/LocationSelector";
import FileUploader from "@/components/common/FileUploader";
import CountryPhoneSelector from "@/components/common/CountryPhoneSelector";
import { LocationFormData, OrganizerFormData, PhoneData } from "@/types/georef";
import { maxFileSizeMB, mimeTypes } from "@/config";
import { useAuth } from "@/context/auth.context";

interface BeOrganizerFormProps {
  onSubmit: (data: OrganizerFormData) => void;
  loading?: boolean;
}

export interface BeOrganizerFormRef {
  resetForm: () => void;
}

const BeOrganizerForm = forwardRef<BeOrganizerFormRef, BeOrganizerFormProps>(
  ({ onSubmit, loading = false }, ref) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState<OrganizerFormData>({
      name: "",
      email: user?.email || "", // Email del usuario logueado
      user_id: user?.id || "",
      phone: {
        countryCode: "54", // Default a Argentina (código numérico)
        phoneNumber: "",
      },
      location: {
        provincia: "",
        municipio: "",
        address: "",
      },
      image: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Actualizar formData cuando el usuario se loguee
    useEffect(() => {
      if (user?.id && user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
          user_id: user.id || "",
        }));
      }
    }, [user]);

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      // Validar nombre
      if (!formData.name.trim()) {
        newErrors.name = "El nombre es requerido";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "El nombre debe tener al menos 2 caracteres";
      } else if (formData.name.trim().length > 100) {
        newErrors.name = "El nombre no puede exceder 100 caracteres";
      }

      // Validar teléfono
      if (!formData.phone.phoneNumber.trim()) {
        newErrors["phone.phoneNumber"] = "El número de teléfono es requerido";
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone.phoneNumber)) {
        newErrors["phone.phoneNumber"] =
          "El número de teléfono contiene caracteres inválidos";
      } else if (formData.phone.phoneNumber.replace(/\D/g, "").length < 8) {
        newErrors["phone.phoneNumber"] =
          "El número de teléfono debe tener al menos 8 dígitos";
      } else if (formData.phone.phoneNumber.replace(/\D/g, "").length > 15) {
        newErrors["phone.phoneNumber"] =
          "El número de teléfono no puede exceder 15 dígitos";
      }

      // Validar ubicación
      if (!formData.location.provincia) {
        newErrors["location.provincia"] = "La provincia es requerida";
      }
      if (!formData.location.municipio) {
        newErrors["location.municipio"] = "La ciudad es requerida";
      }
      if (!formData.location.address.trim()) {
        newErrors["location.address"] = "La dirección es requerida";
      }

      // Validar imagen de la cancha (requerida)
      if (!formData.image) {
        newErrors.image = "La imagen de la cancha es requerida";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
      setFormData({
        name: "",
        email: user?.email || "",
        user_id: user?.id || "",
        phone: {
          countryCode: "54", // Default a Argentina (código numérico)
          phoneNumber: "",
        },
        location: {
          provincia: "",
          municipio: "",
          address: "",
        },
        image: "",
      });
      setErrors({});
    };

    // Exponer la función resetForm al componente padre
    useImperativeHandle(ref, () => ({
      resetForm,
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (validateForm()) {
        onSubmit(formData);
      }
    };

    const handleLocationChange = (location: LocationFormData) => {
      setFormData((prev) => ({ ...prev, location }));
    };

    const handleInputChange = (
      field: keyof Omit<OrganizerFormData, "phone" | "location">,
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

    const handlePhoneChange = (phone: PhoneData) => {
      setFormData((prev) => ({ ...prev, phone }));

      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors["phone.phoneNumber"]) {
        setErrors((prev) => ({ ...prev, "phone.phoneNumber": "" }));
      }
    };

    return (
      <div className="mt-20 max-w-3xl mx-0 md:mx-auto p-4 md:p-6 bg-white rounded-lg md:shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Convertite en Organizador
          </h2>
          <p className="text-gray-600">
            Completá el formulario para solicitar ser organizador de eventos
            deportivos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Tu nombre completo"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <CountryPhoneSelector
              value={formData.phone}
              onChange={handlePhoneChange}
              error={errors["phone.phoneNumber"]}
              disabled={loading}
              placeholder="11 1234-5678"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación <span className="text-red-500">*</span>
            </label>
            <LocationSelector
              value={formData.location}
              onChange={handleLocationChange}
              errors={{
                provincia: errors["location.provincia"],
                municipio: errors["location.municipio"],
                address: errors["location.address"],
              }}
              required
            />
          </div>

          {/* Imagen de la cancha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de la cancha <span className="text-red-500">*</span>
            </label>
            <FileUploader
              value={formData.image}
              onChange={(file) => handleInputChange("image", file)}
              error={errors.image}
              maxSize={maxFileSizeMB}
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Subí una foto de la cancha que vas a gestionar (
              {Object.values(mimeTypes.image).join(", ")} - máx. {maxFileSizeMB}
              MB)
            </p>
          </div>
          {/* Información adicional */}
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-md">
            <p className="font-medium mb-2">¿Qué pasa después?</p>
            <ul className="space-y-1 text-sm">
              <li>
                • Revisaremos tu solicitud en las próximas 48 horas habiles
              </li>
              <li>• Te contactaremos por email para confirmar los detalles</li>
              <li>
                • Una vez aprobado, se creará tu cancha y podrás gestionar
                partidos
              </li>
              <li>• La imagen que subas será la foto principal de tu cancha</li>
            </ul>
          </div>

          {/* Botón de envío */}
          <div className="">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                loading
                  ? "bg-gray-400"
                  : "bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
              disabled:cursor-not-allowed
            `}
            >
              {loading
                ? "Enviando solicitud..."
                : user
                ? "Enviar solicitud"
                : "Iniciar sesión y enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

BeOrganizerForm.displayName = "BeOrganizerForm";

export default BeOrganizerForm;
