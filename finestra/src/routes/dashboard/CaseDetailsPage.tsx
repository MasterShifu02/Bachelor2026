import { InformationField } from "../../Components/CaseInformationContainer/InformationField/InformationField";
import "./CaseDetailPage.css";
import { CaseInformationCard } from "../../Components/CaseInformationContainer/CaseInformationCard/CaseInformationCard/CaseInformationCard/CaseInformationCard";
import ActionButton from "../../Components/ActionButton/ActionButton";
import CaseEventCard from "../../Components/CaseEventCard/CaseEventCard";
import { CaseComments } from "../../Components/CaseComments/CaseComments";
import { useParams } from "react-router-dom";
import {
  getCase,
  getCaseEvents,
  updateCaseStatusWithEvent,
} from "../../services/caseService";
import type { CaseListItem, CaseEvent } from "../../services/caseService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase/client";
import { statusLabels } from "../../constants/statuses";

export function CaseDetailsPage() {
  const { caseId } = useParams();

  const [caseData, setCaseData] = useState<CaseListItem | null>(null);
  const [events, setEvents] = useState<CaseEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  // -----------------------------
  // FETCH CASE + EVENTS
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      if (!caseId) return;

      try {
        const [caseResult, eventResult] = await Promise.all([
          getCase(caseId),
          getCaseEvents(caseId),
        ]);

        setCaseData(caseResult);
        setEvents(eventResult);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [caseId]);

  // -----------------------------
  // REALTIME EVENTS
  // -----------------------------
  useEffect(() => {
    if (!caseId) return;

    const channel = supabase
      .channel(`case-events-${caseId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "case_events",
          filter: `case_id=eq.${caseId}`,
        },
        (payload) => {
          const newEvent = payload.new as CaseEvent;
          setEvents((prev) => [...prev, newEvent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId]);

  // -----------------------------
  // REALTIME STATUS UPDATE
  // -----------------------------
  useEffect(() => {
    if (!caseId) return;

    const channel = supabase
      .channel(`case-${caseId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cases",
          filter: `id=eq.${caseId}`,
        },
        (payload) => {
          const updated = payload.new as CaseListItem;
          setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId]);

  // -----------------------------
  // APPROVE + SEND TO SUPPLIER
  // -----------------------------
  async function handleApprove() {
    if (!caseData || actionLoading) return;

    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        "forwarded_to_supplier",
        "status_change",
        "Saken ble godkjent av butikk og sendt videre til leverandør"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));

      toast.success("Saken sendt til leverandør!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunne ikke sende saken";
      toast.error(message || "Kunne ikke sende saken");
    } finally {
      setActionLoading(false);
    }
  }

  // -----------------------------
  // APPROVE ONLY (NEW)
  // -----------------------------
  async function handleApproveOnly() {
    if (!caseData || actionLoading) return;

    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        "approved_by_store",
        "status_change",
        "Saken ble godkjent"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));

      toast.success("Saken ble godkjent!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunne ikke godkjenne saken";
      toast.error(message || "Kunne ikke godkjenne saken");
    } finally {
      setActionLoading(false);
    }
  }

  // -----------------------------
  // REJECT
  // -----------------------------
  async function handleReject() {
    if (!caseData || actionLoading) return;

    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        "rejected",
        "status_change",
        "Saken ble avslått av butikk"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));

      toast.success("Saken ble avslått!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunne ikke avslå saken";
      toast.error(message || "Kunne ikke avslå saken");
    } finally {
      setActionLoading(false);
    }
  }

  // -----------------------------
  // STATES
  // -----------------------------
  if (loading) return <p>Laster inn side...</p>;
  if (error) return <p>Det skjedde en feil: {error}</p>;
  if (!caseData) return <p>Fant ingen sak</p>;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="page">
      <div className="caseInformationContent">
        <section className="flex border 2px solid">
          <CaseInformationCard title="Kundedetaljer">
            <InformationField label="Fornavn:" value={caseData.customers.first_name ?? ""} />
            <InformationField label="Etternavn:" value={caseData.customers.last_name ?? ""} />
            <InformationField label="E-Mail:" value={caseData.customers.email ?? ""} />
          </CaseInformationCard>

          <CaseInformationCard title="Produktdetaljer">
            <InformationField label="Produktnavn / modell:" value={caseData.products?.product_name ?? ""} />
            <InformationField label="Spacernummer:" value={caseData.products?.spacer_number ?? ""} />
            <InformationField label="Kjøpsdato:" value={caseData.products?.purchase_date ?? ""} />
            <InformationField label="Serienummer:" value={caseData.products?.serial_number ?? ""} />
            <InformationField label="Ordrenummer:" value={caseData.products?.order_number ?? ""} />
          </CaseInformationCard>
        </section>

        <section>
          <CaseInformationCard title="Saksinformasjon">
            <InformationField label="Sakstype:" value={caseData.damage_type ?? ""} />
            <InformationField label="Butikk:" value={caseData.stores.name ?? ""} />
            <InformationField label="Når problemet oppsto:" value={caseData.problem_date ?? ""} />
            <InformationField label="Opprettelsesdato:" value={caseData.created_at ?? ""} />
            <InformationField label="Beskrivelse:" value={caseData?.description || "Ingen beskrivelse tilgjengelig"} />
          </CaseInformationCard>
        </section>
      </div>

      <div>
        <h2 className="timeline-title">Hendelseshistorikk</h2>

        <div className="timeline-current-status">
          <span className="status-label">Nåværende status:</span>
          <span className={`status-badge status-${caseData.status}`}>
            {caseData.status ? statusLabels[caseData.status] : "Ukjent status"}
          </span>
        </div>

        <div className="case-event-list">
          {events.length === 0 ? (
            <p>Ingen hendelser registrert</p>
          ) : (
            events.map((event) => (
              <CaseEventCard key={event.id} event={event} />
            ))
          )}
        </div>

        <CaseComments caseId={caseData.id} />

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6 flex-wrap">
          <ActionButton name="Rediger" variant="secondary" />

          <ActionButton
            name="Godkjenn sak"
            variant="secondary"
            onClick={handleApproveOnly}
            disabled={actionLoading}
          />

          <ActionButton
            name="Avslå sak"
            variant="secondary"
            onClick={handleReject}
            disabled={actionLoading}
          />

          <ActionButton
            name="Godkjenn og send til leverandør"
            variant="primary"
            onClick={handleApprove}
            disabled={actionLoading}
          />
        </div>
      </div>
    </main>
  );
}