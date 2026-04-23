// import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState, useEffect } from "react";
import { statuses, statusLabels, type Status } from "../../constants/statuses";
import { getCases, type CaseListItem } from "../../services/caseService";
import { supabase } from "../../lib/supabase/client";

//Definerer type av kolonner
export type Column = {
  heading: string;
  accessor: (caseItem: CaseListItem) => React.ReactNode;
};

// Status farger
const statusColors: Record<Status, string> = {
  draft: "bg-gray-200 text-gray-700",
  waiting_for_customer: "bg-yellow-100 text-yellow-800",
  submitted_by_customer: "bg-purple-100 text-purple-800",
  approved_by_store: "bg-green-100 text-darkgreen-800",
  forwarded_to_supplier: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function StoreDashboard() {
  const columns: Column[] = [
    { heading: "Saksnummer", accessor: (caseItem) => caseItem.case_number },

    {
      heading: "Fornavn",
      accessor: (caseItem) => caseItem.customers.first_name,
    },
    {
      heading: "Etternavn",
      accessor: (caseItem) => caseItem.customers.last_name,
    },
    {
      heading: "E-post",
      accessor: (caseItem) => caseItem.customers.email,
    },
    {
      heading: "Type sak",
      accessor: (caseItem) => caseItem.damage_type,
    },

    // Visuell status
    {
      heading: "Status",
      accessor: (caseItem) => {
        const status = caseItem.status as Status;

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
      accessor: (caseItem) =>
        caseItem.updated_at
          ? new Intl.DateTimeFormat("nb-NO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(caseItem.updated_at))
          : "-",
    },
    {
      heading: "Opprettet",
      accessor: (caseItem) =>
        caseItem.created_at
          ? new Intl.DateTimeFormat("nb-NO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(caseItem.created_at))
          : "-",
    },
  ];

  const [casesData, setCasesData] = useState<CaseListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await getCases();
        setCasesData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ukjent feil");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

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
      .channel("store-cases-realtime")
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

  // filtering
  const filteredCases = (casesData ?? []).filter((caseItem) => {
    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;

    const matchesSearch = (() => {
      if (searchTerm.trim() === "") return true;

      const term = searchTerm.trim().toLowerCase();

      const email = caseItem.customers.email?.toLowerCase() || "";
      const firstName = caseItem.customers.first_name?.toLowerCase() || "";
      const lastName = caseItem.customers.last_name?.toLowerCase() || "";
      const fullName = `${firstName} ${lastName}`;

      const caseNumber = String(caseItem.case_number ?? "").toLowerCase();

      // email match
      if (email.includes(term)) return true;

      // case number match
      if (caseNumber.includes(term)) return true;

      // exact full name match
      if (fullName === term) return true;

      // partial name match
      if (firstName.includes(term)) return true;
      if (lastName.includes(term)) return true;

      return false;
    })();

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col mt-40 gap-10">

      <div>
        <FilterBar
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statuses={statuses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="flex justify-center">
        <CaseTable allCases={filteredCases} columns={columns} />
      </div>
      {filteredCases.length === 0 && (
        <div className="mb-16 text-center">
          <p className="text-gray-500 text-4xl mt-6">
            Ops! Ingen treff funnet basert på oppgitte søke kriteriene eller/og filtreringsvalg...
          </p>
        </div>
      )}
    </div>
  );
}

export { StoreDashboard };