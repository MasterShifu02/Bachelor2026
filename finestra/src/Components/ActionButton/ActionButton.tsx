import "./ActionButton.css";
type ActionButtonProps = {
  name: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
};
export default function ActionButton({
  name,
  variant,
  onClick,
}: ActionButtonProps) {
  return (
    <>
      <button className={variant} onClick={onClick}>
        {name}
      </button>
    </>
  );
}
export { ActionButton };
