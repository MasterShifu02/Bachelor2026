import { InformationField } from "../../Components/CaseInformationContainer/InformationField/InformationField";

import "./CaseDetailPage.css";
import { CaseInformationCard } from "../../Components/CaseInformationContainer/CaseInformationCard/CaseInformationCard/CaseInformationCard/CaseInformationCard";
import ActionButton from "../../Components/ActionButton/ActionButton";
import CaseEventCard from "../../Components/CaseEventCard/CaseEventCard";
import { CaseComments } from "../../Components/CaseComments/CaseComments";
import { useParams } from "react-router-dom";
import { getCase } from "@/services/caseService";
import type { CaseListItem } from "../../services/caseService";
import { useState, useEffect } from "react";

export function CaseDetailsPage() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<CaseListItem | null>(null);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCase() {
      if (!caseId) return;
      try {
        const data = await getCase(caseId);
        setCaseData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [caseId]);
  if (Loading) return <p>Laster inn side...</p>;
  if (error) return <p>Det skjedde en feil: {error}</p>;
  if (!caseData) return <p>Fant ingen sak</p>;

  return (
    <main className="page">
      <div className="caseInformationContent">
        <section className="flex border 2px solid">
          <CaseInformationCard
            title="Kundedetaljer"
            className="border border-neutral-400 bg neutral-100 p-4"
          >
            <InformationField
              label="Fornavn:"
              value={caseData.customers.first_name}
            />
            <InformationField
              label="Etternavn:"
              value={caseData.customers.last_name}
            />
            <InformationField
              label="E-Mail:"
              value={caseData.customers.email}
            />
          </CaseInformationCard>

          <CaseInformationCard title="Produktdetaljer">
            <InformationField
              label="Produktnavn / modell:"
              value={`${caseData.products.product_name}`}
            />
            <InformationField
              label="Spacernummer:"
              value={caseData.products.spacer_number}
            />
            <InformationField
              label="Kjøpsdato:"
              value={caseData.products.purchase_date}
            />
            <InformationField
              label="Serienummer:"
              value={caseData.products.serial_number}
            />
            <InformationField
              label="Ordrenummer:"
              value="Her var det ikke noen ordrenummer"
            />
          </CaseInformationCard>
        </section>
        <section>
          <CaseInformationCard title="Saksinformasjon">
            <InformationField label="Sakstype:" value={caseData.damage_type} />
            <InformationField label="Butikk:" value={caseData.stores.name} />
            <InformationField
              label="Når problemet oppsto:"
              value={caseData.problem_date}
            />

            <InformationField
              label="Opprettelsesdato:"
              value={caseData.created_at}
            />
            <InformationField
              label="Beskrivelse:"
              value={caseData?.description || "Ingen beskrivelse tilgjengelig"}
            />
          </CaseInformationCard>
        </section>
      </div>

      <div>
        <h2>Hendelseshistorikk</h2>
        <div className="case-event-list">
          <CaseEventCard />
          <CaseEventCard />
          <CaseEventCard />
          <CaseEventCard />
        </div>

        <CaseComments caseId={caseData.id} />
        
        <div>
          <ActionButton name="Rediger" variant="secondary" />
          <ActionButton name="Avslå sak" variant="secondary" />
          <ActionButton name="Godkjen sak" variant="primary" />
        </div>
      </div>
    </main>
  );
}
