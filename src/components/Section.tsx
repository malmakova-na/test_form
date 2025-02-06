import React, { ReactElement } from "react";
interface SectionProps {
  label: string;
  inner: ReactElement;
  info?: ReactElement;
  infoClassName?: string;
}

const Section: React.FC<SectionProps> = ({
  label,
  inner,
  info,
  infoClassName,
}) => {
  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-6">
      <span className="m-0 font-normal text-dark text-[14px]">{label}</span>
      <div className="relative w-full ">
        {inner}
        {info && (
          <div
            className={`font-normal text-grey text-[13px] mt-4 ${infoClassName}`}
          >
            {info}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section;
