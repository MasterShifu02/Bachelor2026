export const statuses = [
  "draft",
  "waiting_for_customer",
  "submitted_by_customer",
  "approved_by_store",
  "forwarded_to_supplier",
  "resolved",
  "rejected_by_store",
  "rejected_by_supplier",
] as const;

export type Status = typeof statuses[number];

// Labels for UI
export const statusLabels: Record<Status, string> = {
  draft: "Utkast",
  waiting_for_customer: "Venter på kunde",
  submitted_by_customer: "Sendt av kunde",
  approved_by_store: "Godkjent av butikk",
  forwarded_to_supplier: "Sendt til leverandør",
  resolved: "Løst",
  rejected_by_store: "Avslått av butikk",
  rejected_by_supplier: "Avvist av leverandør",
};