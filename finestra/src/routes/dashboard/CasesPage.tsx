import CaseTable from "../../Components/CaseTable/CaseTable";
import { getCases } from "../../services/caseService";
import { useEffect, useState } from "react";
import { type CaseListItem } from "../../services/caseService";
import { FilterBar } from "../../Components/FilterBar/FilterBar";
import { dummyCases, statuses } from "../../Components/FilterBar/dummyCases";

export type Column = {
  heading: string;
  accessor: (caseItem: CaseListItem) => React.ReactNode;
};

export function CasesPage() {
  const columns: Column[] = [
    { heading: "Ordrenummer", accessor: (caseItem) => caseItem.id },
    {
      heading: "Fornavn",
      accessor: (caseItem) => caseItem.customers.first_name,
    },
    {
      heading: "Etternavn",
      accessor: (caseItem) => caseItem.customers.last_name,
    },
    { heading: "E-post", accessor: (caseItem) => caseItem.customers.email },
    { heading: "Type sak", accessor: (caseItem) => caseItem.damage_type },
    { heading: "Status", accessor: (caseItem) => caseItem.status },
    { heading: "Butikk", accessor: (caseItem) => caseItem.stores.name },
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

  const [caseData, setCasesData] = useState<CaseListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Filtering

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stores = [...new Set(dummyCases.map((c) => c.store))];

  useEffect(() => {
    async function fetchCases() {
      console.log("Henter saker...");
      try {
        const data = await getCases();
        setCasesData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);
  if (loading) return <p>Laster inn side...</p>;
  if (error) return <p>Det skjedde en feil: {error}</p>;

  const filteredCases = (caseData ?? []).filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.stores.name === selectedStore; //returnerer true hvis en av de er sanne, enten ingen butikker valgt eller matcher
    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;
    const matchesSearchTerm =
      searchTerm === "" ||
      caseItem.id === searchTerm ||
      caseItem.id.includes(searchTerm);
    return matchesStore && matchesStatus && matchesSearchTerm;
  });

  return (
    <main>
      <h1>Hjem/ Se alle saker</h1>
      <FilterBar
        setSelectedStore={setSelectedStore}
        selectedStore={selectedStore}
        statuses={statuses}
        allStores={stores}
        setSelectedStatus={setSelectedStatus}
        selectedStatus={selectedStatus}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      <CaseTable allCases={filteredCases} columns={columns} />
    </main>
  );
}
