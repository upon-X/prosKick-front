"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Country {
  numericCode: string; // Cambiado de "code" a "numericCode" para usar códigos numéricos
  name: string;
  dialCode: string;
  flag: string;
}

// Lista hardcodeada de países principales (Argentina y países vecinos + principales)
// Ahora usa códigos numéricos en lugar de alfabéticos (54, 55, 56, etc.)
const COUNTRIES: Country[] = [
  {
    numericCode: "54",
    name: "Argentina",
    dialCode: "+54",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e6-1f1f7.png", // 🇦🇷
  },
  {
    numericCode: "55",
    name: "Brasil",
    dialCode: "+55",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e7-1f1f7.png", // 🇧🇷
  },
  {
    numericCode: "56",
    name: "Chile",
    dialCode: "+56",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e8-1f1f1.png", // 🇨🇱
  },
  {
    numericCode: "598",
    name: "Uruguay",
    dialCode: "+598",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1fa-1f1fe.png", // 🇺🇾
  },
  {
    numericCode: "595",
    name: "Paraguay",
    dialCode: "+595",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1f5-1f1fe.png", // 🇵🇾
  },
  {
    numericCode: "591",
    name: "Bolivia",
    dialCode: "+591",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e7-1f1f4.png", // 🇧🇴
  },
  {
    numericCode: "51",
    name: "Perú",
    dialCode: "+51",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1f5-1f1ea.png", // 🇵🇪
  },
  {
    numericCode: "57",
    name: "Colombia",
    dialCode: "+57",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e8-1f1f4.png", // 🇨🇴
  },
  {
    numericCode: "58",
    name: "Venezuela",
    dialCode: "+58",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1fb-1f1ea.png", // 🇻🇪
  },
  {
    numericCode: "593",
    name: "Ecuador",
    dialCode: "+593",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1ea-1f1e8.png", // 🇪🇨
  },
  {
    numericCode: "52",
    name: "México",
    dialCode: "+52",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1f2-1f1fd.png", // 🇲🇽
  },
  {
    numericCode: "1",
    name: "Estados Unidos",
    dialCode: "+1",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1fa-1f1f8.png", // 🇺🇸
  },
  {
    numericCode: "34",
    name: "España",
    dialCode: "+34",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1ea-1f1f8.png", // 🇪🇸
  },
  {
    numericCode: "39",
    name: "Italia",
    dialCode: "+39",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1ee-1f1f9.png", // 🇮🇹
  },
  {
    numericCode: "33",
    name: "Francia",
    dialCode: "+33",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1eb-1f1f7.png", // 🇫🇷
  },
  {
    numericCode: "49",
    name: "Alemania",
    dialCode: "+49",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1e9-1f1ea.png", // 🇩🇪
  },
  {
    numericCode: "44",
    name: "Reino Unido",
    dialCode: "+44",
    flag: "https://unpkg.com/emoji-datasource-apple/img/apple/64/1f1ec-1f1e7.png", // 🇬🇧
  },
];

interface CountryPhoneSelectorProps {
  value: {
    countryCode: string;
    phoneNumber: string;
  };
  onChange: (value: { countryCode: string; phoneNumber: string }) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function CountryPhoneSelector({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = "1234-5678",
}: CountryPhoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCountry =
    COUNTRIES.find((country) => country.numericCode === value.countryCode) ||
    COUNTRIES[0]; // Default a Argentina

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm)
  );

  const handleCountrySelect = (country: Country) => {
    onChange({
      countryCode: country.numericCode,
      phoneNumber: value.phoneNumber,
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handlePhoneChange = (phoneNumber: string) => {
    // Solo permitir números, espacios, guiones y paréntesis
    const cleanedPhone = phoneNumber.replace(/[^\d\s\-\(\)]/g, "");
    onChange({
      countryCode: value.countryCode,
      phoneNumber: cleanedPhone,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Selector de país */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px] h-[40px] ${
              error
                ? "border-red-500 text-red-500"
                : "border-gray-300 text-gray-500"
            } ${
              disabled
                ? "bg-gray-100 cursor-not-allowed text-gray-500"
                : "bg-white"
            }`}
          >
            <Image
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              width={20}
              height={20}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">
              {selectedCountry.dialCode}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden w-[180px]">
              {/* Buscador */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar país..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Lista de países */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.numericCode}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 ${
                      country.numericCode === value.countryCode
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={20}
                      height={20}
                      className="w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.dialCode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campo de número de teléfono */}
        <div className="flex-1">
          <input
            type="tel"
            value={value.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[40px] ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
