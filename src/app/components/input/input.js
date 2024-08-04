"use client";

const Input = ({  
  onChange = () => {},
  placeholder = "",
  className = "",
  name,
  type = "text",
  required = false,
  value = "",
  disabled = false,
}) => {
  return (
    <input
      disabled={disabled}
      required={required}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      className={`border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full ${className}`}
      defaultValue={value}
    />
  );
};

export default Input;
