import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState, useEffect } from "react";
import { dummyCases, statuses } from "../FilterBar/dummyCases";
import { getCases, type CaseListItem } from "../../services/caseService";
// import { set } from "zod";

//Definerer type av kolonner
export type Column = {
  heading: string;
  accessor: (caseItem: CaseListItem) => React.ReactNode;
};

function StoreDashboard() {
  //Kolonner for tabellinnhold:
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

  //Kodesnutter for filtering og søk
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  //Filteringslogikk
  const filteredCases = (casesData ?? []).filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.stores.name === selectedStore;

    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;

    const matchedSearchTerm =
      searchTerm === "" ||
      caseItem.id === searchTerm ||
      caseItem.id.includes(searchTerm);
    return matchesStore && matchesStatus && matchedSearchTerm;
  });
  const stores = [...new Set(dummyCases.map((c) => c.store))];

  return (
    <div className="flex flex-col mt-40 gap-10">
      <div className="flex justify-center gap-6">
        <NavigationButton placeholder="Opprett ny sak" linken="./create-case" />
        <NavigationButton placeholder="Se alle saker" linken="./cases" />
      </div>
      <div>
        <FilterBar
          setSelectedStore={setSelectedStore}
          selectedStore={selectedStore}
          allStores={stores}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          statuses={statuses} //statiske statusverdier
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="flex justify-center mb-16">
        <CaseTable allCases={filteredCases} columns={columns} />
      </div>
    </div>
  );
}
export { StoreDashboard };
