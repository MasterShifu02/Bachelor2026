import { useParams } from "react-router-dom";
import { CustomerForm } from "@/components/customer-form/CustomerForm";


export function CustomerFormPage() {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <main className="p-4">Ugyldig lenke: mangler token.</main>;
  }

  return <CustomerForm token={token} />;
}

//kundeskjema som skal åpnes via lenke (token). 
//Dette skal altså bli offentlige siden kunden skal kunne fylle ut skjemaet uten å være innlogget. */}
