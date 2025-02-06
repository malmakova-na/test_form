import { Control, Controller } from "react-hook-form";
import Dropdown from "react-dropdown";
import CaretDown from "../assets/caretDown.svg";
import { FormValues } from "../types";

interface OptionT {
  value: string;
  label: string;
}
interface DropdownField {
  name: keyof FormValues;
  type?: string;
  placeholder?: string;
  value?: OptionT;
  onChange?: Function;
  info?: string;
  error?: string;
  required?: boolean;
  options?: OptionT[];
  control: Control<FormValues>;
  controlClassName?: string;
}

const DropdownField: React.FC<DropdownField> = ({
  name,
  control,
  options,
  error,
  placeholder,
  value,
  required = false,
  onChange,
  controlClassName = "h-[48px] placeholder-grey text-dark border border-transparent focus:border-primary text-[14px] w-full flex items-center px-4 rounded-lg justify-between outline-none  bg-background lg:w-[480px]",
}) => (
  <>
    <Controller
      name={name}
      control={control}
      render={({}) => (
        <Dropdown
          value={value}
          arrowOpen={
            <img src={CaretDown} alt="Arrow Icon" className="rotate-180" />
          }
          arrowClosed={<img src={CaretDown} alt="Arrow Icon" />}
          arrowClassName="flex items-center  px-0 "
          menuClassName={`placeholder-grey text-dark border focus:border-primary text-[14px] w-full flex items-center px-4 flex-col outline-none  bg-background lg:w-[480px] `}
          controlClassName={`${controlClassName} ${error ? "bg-red" : ""}`}
          options={options?.map((opt) => opt.label) || []}
          onChange={(selected) => {
            if (selected?.value) onChange && onChange(selected.value);
          }}
          placeholder={`${placeholder} ${required ? "*" : ""}`}
        />
      )}
    />
    {error && <p className="text-red text-sm mt-2">{error}</p>}
  </>
);
export default DropdownField;
