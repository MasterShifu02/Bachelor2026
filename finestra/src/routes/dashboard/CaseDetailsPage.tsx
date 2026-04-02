import { InformationField } from "@/Components/CaseInformationContainer/InformationField/InformationField";

import "./CaseDetailPage.css";
import { CaseInformationCard } from "@/Components/CaseInformationContainer/CaseInformationCard/CaseInformationCard/CaseInformationCard/CaseInformationCard";
import ActionButton from "@/Components/ActionButton/ActionButton";
import CaseEventCard from "@/Components/CaseEventCard/CaseEventCard";

/* 
import { useParams } from "react-router-dom";
import { getCase } from "@/services/caseService";
import type { CaseListItem } from "@/services/caseService";
import { useState, useEffect } from "react";

const { caseId } = useParams();

  const [caseData, setCaseData] = useState<CaseListItem | null>(null);
  const [loading, setLoading] = useState(true);
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
  if (loading) return <p>Laster...</p>;
  if (error) return <p>error</p>;
  if (!caseData) return <p>Fant ingen sak</p>;
*/

export function CaseDetailsPage() {
  return (
    <main className="page">
      <div className="caseInformationContent">
        <section className="flex border 2px solid">
          <CaseInformationCard
            title="Kundedetaljer"
            className="border border-neutral-400 bg neutral-100 p-4"
          >
            <InformationField label="Test-id:" value="Reodor" />
            <InformationField label="Etternavn:" value="Benjisen" />
            <InformationField label="E-Mail:" value="benji123@gmail.com" />
          </CaseInformationCard>

          <CaseInformationCard title="Kundedetaljer">
            <InformationField
              label="Produktnavn / modell:"
              value="Schweizervindu 8403.a"
            />
            <InformationField label="Spacernummer:" value="NO-3989.1A92" />
            <InformationField label="Kjøpsdato:" value="2025-05.19" />
            <InformationField label="Serienummer:" value="45-AR-859.3 " />
            <InformationField label="Ordre:" value="9" />
          </CaseInformationCard>
        </section>
        <section>
          <CaseInformationCard title="Saksinformasjon">
            <InformationField label="Sakstype:" value="Reklamasjon" />
            <InformationField label="Butikk:" value="Zwolle" />
            <InformationField
              label="Når problemet oppsto:"
              value="ikke oppgitt"
            />
            <InformationField label="Serienummer:" value="45-AR-859.3 " />
            <InformationField label="Opprettelsesdato:" value="18-04-2024" />
            <InformationField
              label="Beskrivelse:"
              value="Knust i høyre hjørnet.På vinduen mot hagen"
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
        <input placeholder="Legg til kommentar..."></input>
        <ActionButton name="Send" variant="primary"></ActionButton>
        <div>
          <ActionButton name="Rediger" variant="secondary" />
          <ActionButton name="Avslå sak" variant="secondary" />
          <ActionButton name="Godkjen sak" variant="primary" />
        </div>
      </div>
    </main>
  );
}
