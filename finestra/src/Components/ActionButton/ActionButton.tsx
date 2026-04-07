import "./ActionButton.css";

type ActionButtonProps = {
  name: string;
  variant: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function ActionButton({
  name,
  variant,
  type = "button",
  onClick,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`actionButtonStyle ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
}

export { ActionButton };