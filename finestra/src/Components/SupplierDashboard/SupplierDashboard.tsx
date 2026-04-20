import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState, useEffect } from "react";
import "./SupplierDashboard.css";
import { getCases, type CaseListItem } from "../../services/caseService";
import { supabase } from "../../lib/supabase/client";
import { statuses, statusLabels, type Status } from "../../constants/statuses";

export type Column = {
  heading: string;
  accessor: (caseItem: CaseListItem) => React.ReactNode;
};

// Status farger
const statusColors: Record<Status, string> = {
  draft: "bg-gray-200 text-gray-700",
  waiting_for_customer: "bg-yellow-100 text-yellow-800",
  submitted_by_customer: "bg-purple-100 text-purple-800",
  approved_by_store: "bg-blue-100 text-blue-800",
  forwarded_to_supplier: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function SupplierDashboard() {
  const columns: Column[] = [
    { heading: "Saksnummer", accessor: (c) => c.case_number },
    { heading: "Butikk", accessor: (c) => c.stores.name },
    { heading: "Fornavn", accessor: (c) => c.customers.first_name },
    { heading: "Etternavn", accessor: (c) => c.customers.last_name },
    { heading: "E-post", accessor: (c) => c.customers.email },
    { heading: "Type sak", accessor: (c) => c.damage_type },
    {
      heading: "Status",
      accessor: (c) => {
        const status = c.status as Status;
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
    {
      heading: "Sist oppdatert",
      accessor: (c) =>
        c.updated_at
          ? new Intl.DateTimeFormat("nb-NO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(c.updated_at))
          : "-",
    },
  ];

  const [casesData, setCasesData] = useState<CaseListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  // -----------------------------
  // FETCH
  // -----------------------------
  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCasesData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // -----------------------------
  // REALTIME (SUPABASE)
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel("supplier-cases-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cases",
        },
        () => {
          fetchCases(); // auto refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <p>Laster inn side...</p>;
  if (error) return <p>Det skjedde en feil: {error}</p>;

  // -----------------------------
  // FILTER
  // -----------------------------
  const stores = [
    ...new Set((casesData ?? []).map((c) => c.stores.name)),
  ];

  const incomingCases =
    casesData?.filter(
      (c) => c.status === "forwarded_to_supplier"
    ) || [];

  const filteredIncomingCases = incomingCases.filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.stores.name === selectedStore;

    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;

    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesStore && matchesStatus;

    const email = caseItem.customers.email?.toLowerCase() || "";
    const firstName = caseItem.customers.first_name?.toLowerCase() || "";
    const lastName = caseItem.customers.last_name?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`;
    const caseNumber = String(caseItem.case_number ?? "").toLowerCase();

    const matchesSearch =
      email.includes(term) ||
      caseNumber.includes(term) ||
      fullName.includes(term) ||
      firstName.includes(term) ||
      lastName.includes(term);

    return matchesStore && matchesStatus && matchesSearch;
  });

  return (
    <div className="content-layout">
      <h1 className="dashboardHeader text-xl font-semibold">
        Inkommende saker
      </h1>

      {/* FILTER */}
      <div className="filterBar flex gap-4 items-center flex-wrap">
        <FilterBar
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statuses={statuses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <select
          className="options-button"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="">Alle butikker</option>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="flex flex-col items-center">
        <CaseTable allCases={filteredIncomingCases} columns={columns} />

        {filteredIncomingCases.length === 0 && (
          <p className="text-gray-500 text-4xl mt-6">
            Ops! Ingen treff funnet basert på filtrering
          </p>
        )}
      </div>
    </div>
  );
}

export { SupplierDashboard };