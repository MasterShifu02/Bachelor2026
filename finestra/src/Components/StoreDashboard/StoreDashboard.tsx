import NavigationButton from "../NavigationButton/NavigationButton";
import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import React, { useState } from "react";
import { dummyCases } from "../FilterBar/dummyCases";

function StoreDashboard() {
  const [selectedStore, setSelectedStore] = useState("");
  const filteredCases = dummyCases.filter((caseItem) => {
    if (selectedStore === "") return true;
    return caseItem.store === selectedStore;
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
        />
      </div>

      <div className="flex justify-center">
        <CaseTable allCases={filteredCases} />
      </div>
    </div>
  );
}
export { StoreDashboard };
