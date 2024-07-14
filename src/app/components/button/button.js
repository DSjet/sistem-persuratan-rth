const Button = ({
  text,
  onClick = () => {},
  className,
  variation = "primary",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      className={`${
        variation == "primary"
          ? "bg-green-500 hover:bg-green-400 text-white"
          : "outline outline-1 outline-primary-0 hover:outline-primary-10 text-primary-0"
      } font-reguler py-2 px-4 rounded-full w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
