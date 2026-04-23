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
  getCaseAttachments,
  type Attachment
} from "../../services/caseService";
import type { CaseListItem, CaseEvent } from "../../services/caseService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase/client";
import { statusLabels } from "../../constants/statuses";
import { getProfile } from "../../services/authService";

export function CaseDetailsPage() {
  const { caseId } = useParams();

  const [caseData, setCaseData] = useState<CaseListItem | null>(null);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [isSupplier, setIsSupplier] = useState(false);

  // -----------------------------
  // FETCH CASE + EVENTS + ATTACHMENTS
  // -----------------------------
  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      if (!caseId) return;

      try {
        const [caseResult, eventResult, attachmentResult, profile] =
          await Promise.all([
            getCase(caseId),
            getCaseEvents(caseId),
            getCaseAttachments(caseId),
            getProfile(),
          ]);

        setCaseData(caseResult);
        setEvents(eventResult);
        setAttachments(attachmentResult);

        setIsSupplier(profile?.role === "supplier");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
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
  // ACTIONS
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
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApproveOnly() {
    if (!caseData || actionLoading) return;

    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        "approved_by_store",
        "status_change",
        "Saken ble godkjent av butikk"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success("Saken ble godkjent!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunne ikke godkjenne saken";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!caseData || actionLoading) return;
    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        isSupplier ? "rejected_by_supplier" : "rejected_by_store",
        "status_change",
        isSupplier ? "Saken ble avvist av leverandør" : "Saken ble avslått av butikk"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success(isSupplier ? "Saken ble avvist!" : "Saken ble avslått!");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResolved() {
    if (!caseData || actionLoading) return;
    setActionLoading(true);

    try {
      const updated = await updateCaseStatusWithEvent(
        caseData.id,
        "resolved",
        "status_change",
        "Saken ble markert som løst"
      );

      setCaseData((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success("Saken ble markert som løst!");
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
      {/* LEFT SIDE */}
      <div className="caseInformationContent">
        <section className="case-grid">
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

        {/* ATTACHMENTS */}
        <section>
          <CaseInformationCard title="Vedlegg">
            {attachments.length === 0 ? (
              <p>Ingen vedlegg</p>
            ) : (
              <div className="attachments-grid">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="attachment-card"
                    onClick={() => setSelectedImage(file.signedUrl || "")}
                  >
                    <img
                    src={file.signedUrl || "/placeholder.png"}
                    alt="Vedlegg"
                  />
                  </div>
                ))}
              </div>
            )}
          </CaseInformationCard>
        </section>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <h2 className="timeline-title">Hendelseshistorikk</h2>

        <div className="timeline-current-status">
          <span className="status-label">Status</span>
          <span className={`status-badge status-${caseData.status}`}>
            {caseData.status ? statusLabels[caseData.status] : "Ukjent status"}
          </span>
        </div>

        <div className="case-event-list">
          {events.map((event, index) => (
            <CaseEventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        <CaseComments caseId={caseData.id} />

        <div className="flex gap-3 mt-6 flex-wrap">
          <ActionButton name="Rediger" variant="secondary" />

          {!isSupplier ? (
            <>
              <ActionButton name="Be om mer info" variant="secondary" />

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
            </>
          ) : (
            <>
              <ActionButton
                name="Avvis sak"
                variant="secondary"
                onClick={handleReject}
                disabled={actionLoading}
              />

              <ActionButton
                name="Marker som løst"
                variant="primary"
                onClick={handleResolved}
                disabled={actionLoading}
              />
            </>
          )}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </main>
  );
}