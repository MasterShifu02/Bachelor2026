import "./ActionButton.css";

type ActionButtonProps = {
  name: string;
  variant: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function ActionButton({
  name,
  variant,
  type = "button",
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`actionButtonStyle ${variant}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}

export { ActionButton };