import { useState } from "react";
import "./assets/tailwind.css";
import "./assets/css2.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormValues } from "./types";
import { message } from "antd";
import {
  Section,
  PhoneInput,
  Button,
  TextArea,
  DropdownField,
  InputField,
} from "./components";
function App() {
  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Заголовок обязателен")
      .matches(
        /[a-zA-Zа-яА-Я]/,
        "Заголовок должен содержать хотя бы одну букву"
      ),
    description: yup.string().required("Описание обязательно"),
    price: yup
      .number()
      .typeError("Цена должна быть числом")
      .positive("Цена должна быть положительной")
      .required("Цена обязательна"),
    category: yup.string().required("Категория обязательна"),
    condition: yup.string().required("Состояние обязательно"),
    phone: yup
      .string()
      .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Введите корректный номер")
      .required("Телефон обязателен"),
    files: yup
      .mixed<FileList>()
      .test("required", "Необходимо загрузить хотя бы один файл", (value) => {
        return value && value.length > 0;
      }),
    video: yup
      .string()
      .required("Ссылка на видео обязательна")
      .matches(/^http.*\..*\//, "Введите корректную ссылку на видео"),
    address: yup.string().required("Место сделки обязательно"),
    connect: yup.string().required("Заголовок обязателен"),
  });
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Форма отправлена", data);
    messageApi.success("Объявление успешно создано и отправлено на модерацию");
  };
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = await trigger();

    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  const handleClick = (condition: string) => {
    setValue("condition", condition);
  };

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile([...selectedFile, ...event.target.files].slice(0, 10));
      setValue("files", event.target.files);
    }
  };
  const handleRemoveFile = (file: File) => {
    const currentFiles = getValues("files");
    if (currentFiles) {
      const dataTransfer = new DataTransfer();
      for (const data of Object.values(currentFiles)) {
        if (data.name !== file.name) {
          dataTransfer.items.add(data);
        }
      }
      setValue("files", dataTransfer.files);
      setSelectedFile(Array.from(dataTransfer.files));
    }
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      {contextHolder}
      <div className="rounded-lg bg-white p-4 lg:p-8">
        <h2 className="m-0 text-inherit text-lg lg:text-2xl font-semibold mb-6">
          Параметры
        </h2>
        <Section
          label="Название объявления"
          inner={
            <InputField
              {...register("title")}
              error={errors["title"]?.message}
              placeholder="Название *"
              name="title"
              info={
                "Например, «iPhone 6S Plus серый космос 32 гб» или «Фотоаппарат Canon 700D Kit 18-55»"
              }
            />
          }
        />
        <Section
          label="Состояние"
          inner={
            <div className="relative w-full flex flex-row gap-4 ">
              <Button
                handleClick={handleClick}
                value="new"
                activeValue={watch("condition")}
                label="Новое"
              />
              <Button
                value="old"
                activeValue={watch("condition")}
                handleClick={handleClick}
                label="Б/У"
              />
            </div>
          }
          info={
            <>
              {errors["condition"] && (
                <p className="text-red text-sm mt-2">
                  {errors["condition"]?.message}
                </p>
              )}
              <a className="underline cursor-pointer " target="_blank" href="">
                Какую вещь можно считать новой
              </a>
            </>
          }
        />

        <Section
          label="Вид обьявления"
          inner={
            <DropdownField
              name="category"
              control={control}
              options={[
                { value: "my", label: "Продаю свое" },
                { value: "outer", label: "Товар приобретен на продажу" },
              ]}
              placeholder={"Выберите вид обьявления"}
              error={errors["category"]?.message}
              required
              onChange={(value: string) => {
                setValue("category", value);
              }}
            />
          }
        />
        <h2 className="m-0 text-inherit text-lg lg:text-2xl font-semibold mb-6">
          Подробности
        </h2>
        <Section
          label="Описание"
          inner={
            <TextArea
              {...register("description")}
              placeholder="Описание"
              name="description"
              required
              error={errors["description"]?.message}
            />
          }
          info={
            <>
              Не указывайте в описании телефон и e-mail — для этого есть
              отдельные поля
            </>
          }
        />
        <Section
          label="Цена"
          inner={
            <InputField
              {...register("price")}
              error={errors["price"]?.message}
              type="number"
              name="price"
              placeholder="₽"
              required
            />
          }
        />

        <div className="mb-8 grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-6">
          <span className="m-0 font-normal text-dark text-[14px]">
            Фотографии
          </span>
          <div className="flex flex-col mb-2 relative w-full">
            <div className="flex flex-row gap-4 flex-wrap mb-2">
              {selectedFile.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-[120px] h-[90px] bg-background rounded-lg grid place-items-center cursor-pointer hover:opacity-80"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white text-black p-1 rounded-full shadow w-6 h-6 flex items-center justify-center"
                    onClick={() => handleRemoveFile(file)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-[120px] h-[90px] bg-background rounded-lg grid place-items-center cursor-pointer hover:opacity-80 mb-1">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.625 3.9375H12.6759L11.7176 2.50031C11.6662 2.42336 11.5967 2.36025 11.5151 2.31659C11.4336 2.27293 11.3425 2.25006 11.25 2.25H6.75C6.65749 2.25006 6.56642 2.27293 6.48486 2.31659C6.4033 2.36025 6.33377 2.42336 6.28242 2.50031L5.32336 3.9375H3.375C2.92745 3.9375 2.49822 4.11529 2.18176 4.43176C1.86529 4.74822 1.6875 5.17745 1.6875 5.625V13.5C1.6875 13.9476 1.86529 14.3768 2.18176 14.6932C2.49822 15.0097 2.92745 15.1875 3.375 15.1875H14.625C15.0726 15.1875 15.5018 15.0097 15.8182 14.6932C16.1347 14.3768 16.3125 13.9476 16.3125 13.5V5.625C16.3125 5.17745 16.1347 4.74822 15.8182 4.43176C15.5018 4.11529 15.0726 3.9375 14.625 3.9375ZM15.1875 13.5C15.1875 13.6492 15.1282 13.7923 15.0227 13.8977C14.9173 14.0032 14.7742 14.0625 14.625 14.0625H3.375C3.22582 14.0625 3.08274 14.0032 2.97725 13.8977C2.87176 13.7923 2.8125 13.6492 2.8125 13.5V5.625C2.8125 5.47582 2.87176 5.33274 2.97725 5.22725C3.08274 5.12176 3.22582 5.0625 3.375 5.0625H5.625C5.71763 5.06256 5.80884 5.03974 5.89053 4.99608C5.97223 4.95241 6.04187 4.88924 6.09328 4.81219L7.05094 3.375H10.9484L11.9067 4.81219C11.9581 4.88924 12.0278 4.95241 12.1095 4.99608C12.1912 5.03974 12.2824 5.06256 12.375 5.0625H14.625C14.7742 5.0625 14.9173 5.12176 15.0227 5.22725C15.1282 5.33274 15.1875 5.47582 15.1875 5.625V13.5ZM9 6.1875C8.38811 6.1875 7.78997 6.36895 7.2812 6.70889C6.77244 7.04884 6.37591 7.53201 6.14175 8.09732C5.90759 8.66263 5.84632 9.28468 5.9657 9.88481C6.08507 10.4849 6.37972 11.0362 6.81239 11.4689C7.24506 11.9015 7.79631 12.1962 8.39644 12.3156C8.99657 12.4349 9.61862 12.3737 10.1839 12.1395C10.7492 11.9053 11.2324 11.5088 11.5724 11C11.9123 10.4913 12.0938 9.89314 12.0938 9.28125C12.0928 8.46102 11.7666 7.67465 11.1866 7.09467C10.6066 6.51468 9.82023 6.18843 9 6.1875ZM9 11.25C8.61062 11.25 8.22998 11.1345 7.90622 10.9182C7.58246 10.7019 7.33012 10.3944 7.18111 10.0347C7.0321 9.67492 6.99311 9.27907 7.06908 8.89717C7.14504 8.51527 7.33255 8.16447 7.60788 7.88913C7.88322 7.6138 8.23402 7.42629 8.61592 7.35033C8.99782 7.27436 9.39367 7.31335 9.75341 7.46236C10.1131 7.61137 10.4206 7.86371 10.637 8.18747C10.8533 8.51123 10.9688 8.89187 10.9688 9.28125C10.9688 9.80339 10.7613 10.3042 10.3921 10.6734C10.0229 11.0426 9.52214 11.25 9 11.25Z"
                    fill="#343330"
                  ></path>
                </svg>
                <input
                  multiple
                  name="file"
                  type="file"
                  className="visually-hidden "
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {selectedFile?.length >= 1 && (
              <span className="font-normal text-grey text-[13px]  ">
                {`${selectedFile?.length} из 10`}
              </span>
            )}
            {errors["files"] && (
              <p className="text-red text-sm">{errors["files"].message}</p>
            )}
          </div>
        </div>
        <Section
          label="Видео"
          inner={
            <InputField
              {...register("video")}
              type="text"
              placeholder="Ссылка на видео"
              error={errors["video"]?.message}
            />
          }
        />

        <h2 className="m-0 text-inherit text-lg lg:text-2xl font-semibold mb-6">
          Место сделки
        </h2>
        <div className="relative w-full">
          <DropdownField
            options={[
              { value: "Москва", label: "Москва" },
              { value: "Санкт-Петербург", label: "Санкт-Петербург" },
              { value: "Екатеринбург", label: "Екатеринбург" },
              { value: "Казань", label: "Казань" },
              { value: "Краснодар", label: "Краснодар" },
            ]}
            onChange={(value: string) => {
              setValue("address", value);
            }}
            control={control}
            type="text"
            controlClassName="h-[48px] placeholder-grey text-dark border border-transparent focus:border-primary text-[14px] w-full flex items-center px-4 rounded-lg justify-between outline-none pt-0 bg-background mb-4 lg:w-[724px]"
            name="address"
            placeholder="Начните вводить адрес, а потом выберите из списка"
            required
            error={errors["address"]?.message}
          />
        </div>

        <h2 className="m-0 text-inherit text-lg lg:text-2xl font-semibold mb-6">
          Контакты
        </h2>
        <div className="relative w-full">
          <Section
            label="Телефон"
            inner={
              <PhoneInput
                className="h-[48px] placeholder-grey text-dark border border-transparent focus:border-primary text-[14px] w-full flex items-center px-4 rounded-lg justify-between outline-none pt-0 bg-background lg:w-[480px] mb-2"
                name="phone"
                register={register}
                error={errors["phone"]?.message}
                required
              />
            }
            info={
              <>
                <span>
                  Чтобы ваши номера не попали в базы мошенников, мы показываем
                  вместо них подменные, а звонки переводим вам. Эту защиту
                  нельзя отключить.
                </span>
                <a
                  className="underline cursor-pointer mt-2"
                  target="_blank"
                  href=""
                >
                  Подробнее
                </a>
              </>
            }
            infoClassName="flex flex-col"
          />

          <Section
            label="Способ связи"
            inner={
              <DropdownField
                placeholder="Выберете способ связи"
                value={{
                  value: "messages and calls",
                  label: "Звонки и Сообщения",
                }}
                name="connect"
                control={control}
                options={[
                  { value: "messages and calls", label: "Звонки и Сообщения" },
                ]}
                onChange={(value: string) => setValue("connect", value)}
              />
            }
          />
        </div>
        <div className="flex flex-row gap-4 mt-[48px]">
          <button
            className="h-[48px] text-[14px] disabled:opacity-50 rounded-lg px-4 flex items-center gap-x-[10px] hover:opacity-[0.9] transition-opacity duration-550 relative font-semibold bg-primary border border-primary text-white flex-1 lg:w-[180px] lg:flex-none"
            type="submit"
          >
            <span className="whitespace-nowrap w-full text-inherit">
              Разместить
            </span>
          </button>
          <button
            className="h-[48px] text-[14px] disabled:opacity-50 rounded-lg px-4 flex items-center gap-x-[10px] hover:opacity-[0.9] transition-opacity duration-550 relative font-semibold bg-transparent border border-dark text-dark flex-1 lg:w-[180px] lg:flex-none"
            type="button"
          >
            <span className="whitespace-nowrap w-full text-inherit">
              Сохранить и выйти
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default App;
