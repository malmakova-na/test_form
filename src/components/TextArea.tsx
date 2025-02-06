import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={`placeholder-grey text-dark text-[14px] w-full flex items-center p-4 rounded-lg outline-none resize-none min-h-[96px] bg-background lg:w-[480px] mb-4 ${
            error ? "bg-red" : ""
          }`}
          {...props}
        />
        {error && <p className="text-red text-[13px] mt-2">{error}</p>}
      </div>
    );
  }
);

export default TextArea;
