import "./InformationField.css";
type InformationFieldProps = {
  label: string;
  value?: string | null;
};

export function InformationField({ label, value }: InformationFieldProps) {
  return (
    <div className="information-field">
      <p className="informationField_label">{label}</p>
      <p className="informationField_value">{value}</p>
    </div>
  );
}
