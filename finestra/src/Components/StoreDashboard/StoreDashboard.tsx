import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState } from "react";
import { dummyCases, statuses } from "../FilterBar/dummyCases";

function StoreDashboard() {
  const [selectedStore, setSelectedStore] = useState("");

  //Kodesnutter for filtering av status på saker
  const [selectedStatus, setSelectedStatus] = useState("");

  //Kodesnutter for å søke etter saker
  const [searchTerm, setSearchTerm] = useState("");

  //Filteringslogikk
  const filteredCases = dummyCases.filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.store === selectedStore;

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
