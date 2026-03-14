import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import { dummyCases, statuses } from "../FilterBar/dummyCases";
import React, { useState } from "react";
import NavigationButton from "../NavigationButton/NavigationButton";

function SupplierDashboard() {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stores = [...new Set(dummyCases.map((c) => c.store))];

  //Filteringslogikk:
  const filteredCases = dummyCases.filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.store === selectedStore;
    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;
    const matchesSearchTerm =
      searchTerm === "" ||
      caseItem.id === searchTerm ||
      caseItem.id.includes(searchTerm);
    return matchesStore && matchesStatus && matchesSearchTerm;
  });

  return (
    <div>
      <NavigationButton placeholder="Statistikk" linken="./stats" />
      <NavigationButton placeholder="Se alle saker" linken="./cases" />

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
      <CaseTable allCases={filteredCases} />
    </div>
  );
}
export { SupplierDashboard };
