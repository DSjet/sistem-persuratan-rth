const Button = ({
  text,
  onClick = () => {},
  className,
  variation = "primary",
  disabled = false,
  type = "button",
}) => {
  const buttonType = {
    primary: "bg-green-500 hover:bg-green-400 text-white",
    secondary:
      "outline outline-1 outline-primary-0 hover:outline-primary-10 text-primary-0",
    danger: "bg-red-500 hover:bg-red-400 text-white",
  };
  return (
    <button
      className={`${buttonType[variation]} font-reguler py-2 px-4 rounded-full w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
