import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState, useEffect } from "react";
import { dummyCases, statuses } from "../FilterBar/dummyCases";
import { getCases, type CaseListItem } from "@/services/caseService";
import { set } from "zod";

function StoreDashboard() {
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
        <CaseTable allCases={filteredCases} />
      </div>
    </div>
  );
}
export { StoreDashboard };
