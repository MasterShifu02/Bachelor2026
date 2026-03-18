import { Link } from "react-router-dom";

type NavigationButtonProps = {
  placeholder: string;
  linken: string;
  variant?: "primary" | "secondary";
};

function navigationButton({
  placeholder,
  linken,
  variant = "primary",
}: NavigationButtonProps) {
  const baseStyles =
    "text-white font-bold text-2xl px-15 py-15 rounded-lg inline-flex items-center justify-center ";

  const variantStyles = {
    primary: "bg-[#30275E] hover:bg-[#241d49]",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
  };

  return (
    <Link to={linken} className={`${baseStyles} ${variantStyles[variant]}`}>
      {placeholder}
    </Link>
  );
}
export default navigationButton;
