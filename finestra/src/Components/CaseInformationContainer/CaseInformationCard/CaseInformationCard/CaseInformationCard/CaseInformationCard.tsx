//import { InformationField } from "./InformationField/InformationField";
import "./CaseInformationCard.css";
type CaseInformationCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};
export function CaseInformationCard({
  title,
  children,
  // className = "",
}: CaseInformationCardProps) {
  return (
    <div className="case-information-card">
      <h2 className="case-information-card_title">{title}</h2>
      <section className="case-information-card_content">{children}</section>
    </div>
  );
}
