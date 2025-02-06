import React from "react";
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  info?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ error, info, className = "", name, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`h-[48px] placeholder-grey text-dark border border-transparent focus:border-primary text-[14px] w-full flex items-center px-4 rounded-lg justify-between outline-none pt-0 bg-background lg:w-[480px]  mb-4 ${className} ${
            error ? "bg-red" : ""
          } `}
          name={name}
          {...props}
        />
        {error && <p className="text-red text-[13px] ">{error}</p>}
        {info && <p className="font-normal text-grey text-[13px]">{info}</p>}
      </div>
    );
  }
);

export default InputField;
