import React from "react";
import InputMask from "react-input-mask";
import { UseFormRegister } from "react-hook-form";

interface PhoneInputProps {
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  className?: string;
  required?: boolean;
}
const PhoneInput: React.FC<PhoneInputProps> = ({
  name,
  register,
  error,
  className,
  required = false,
}) => (
  <>
    <InputMask
      mask="+7 (999) 999-99-99"
      maskChar="_"
      {...register(name)}
      className={`${className} ${error ? "bg-red" : ""}`}
      placeholder={`+7 (___) ___-__-__ ${required ? "*" : ""}`}
    />
    {error && <p className="text-red text-sm">{error}</p>}
  </>
);

export default PhoneInput;
