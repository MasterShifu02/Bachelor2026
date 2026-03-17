import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import { dummyCases, statuses } from "../FilterBar/dummyCases";
import React, { useState } from "react";
import NavigationButton from "../NavigationButton/NavigationButton";
import "./SupplierDashboard.css";

function SupplierDashboard() {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stores = [...new Set(dummyCases.map((c) => c.store))];
  //inkommende saker
  const incomingCases = dummyCases.filter(
    (caseItem) => caseItem.status === "Ny",
  );

  //Filteringslogikk av 'Alle eksisterende saker (nederste tabell)':
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
    <div className="content-layout">
      <div className="buttonSection">
        <NavigationButton placeholder="Statistikk" linken="./stats" />
        <NavigationButton placeholder="Se alle saker" linken="./cases" />
      </div>
      <div>
        <h1 className="dashboardHeader">Inkommende saker:</h1>
      </div>
      <div>
        <CaseTable allCases={incomingCases} />
      </div>
      <h1 className="dashboardHeader">Alle eksisterende saker:</h1>
      <div className="filterBar">
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
      <div>
        <CaseTable allCases={filteredCases} />
      </div>
    </div>
  );
}
export { SupplierDashboard };
