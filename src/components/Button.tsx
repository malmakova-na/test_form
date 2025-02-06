import React from "react";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  handleClick?: Function;
  activeValue: string;
  value?: string;
}
const Button: React.FC<ButtonProps> = ({
  type = "button",
  label,
  handleClick,
  activeValue,
  value,
}) => (
  <>
    <button
      className={
        value === activeValue
          ? "h-[48px] text-[14px] disabled:opacity-50 rounded-lg px-4 flex items-center gap-x-[10px] hover:opacity-[0.9] transition-opacity duration-550 relative font-semibold bg-black border border-black text-white flex-1 lg:w-[88px] lg:flex-none"
          : "h-[48px] text-[14px] disabled:opacity-50 rounded-lg px-4 flex items-center gap-x-[10px] hover:opacity-[0.9] transition-opacity duration-550 relative font-semibold bg-transparent border border-dark text-dark flex-1 lg:w-[88px] lg:flex-none"
      }
      type={type}
      onClick={() => handleClick && handleClick(value)}
    >
      <span className="whitespace-nowrap w-full text-inherit">{label}</span>
    </button>
  </>
);

export default Button;
