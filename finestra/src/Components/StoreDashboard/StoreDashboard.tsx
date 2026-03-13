import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState } from "react";
import { dummyCases, statuses } from "../FilterBar/dummyCases";

function StoreDashboard() {
  const [selectedStore, setSelectedStore] = useState("");

  //Kodesnutter for filtering av status på saker
  const [selectedStatus, setSelectedStatus] = useState("");

  //Filteringslogikk
  const filteredCases = dummyCases.filter((caseItem) => {
    const matchesStore =
      selectedStore === "" || caseItem.store === selectedStore;

    const matchesStatus =
      selectedStatus === "" || caseItem.status === selectedStatus;
    return matchesStore && matchesStatus;
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
          statuses={statuses}
        />
      </div>

      <div className="flex justify-center">
        <CaseTable allCases={filteredCases} />
      </div>
    </div>
  );
}
export { StoreDashboard };
