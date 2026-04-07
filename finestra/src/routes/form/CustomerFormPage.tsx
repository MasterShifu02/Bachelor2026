import { useParams } from "react-router-dom";
import { CustomerForm } from "../../Components/customer-form/CustomerForm";

export function CustomerFormPage() {
  const { token } = useParams<{ token: string }>();

  if (!token) return <div>Ugyldig lenke</div>;

  // Sender URL-token direkte til CustomerForm
  return <CustomerForm token={token} />;
}

//kundeskjema som skal åpnes via lenke (token). 
//Dette skal altså bli offentlige siden kunden skal kunne fylle ut skjemaet uten å være innlogget. */}
