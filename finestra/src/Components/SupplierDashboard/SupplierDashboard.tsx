import CaseTable from "../CaseTable/CaseTable";
import { FilterBar } from "../FilterBar/FilterBar";
import { dummyCases, statuses } from "../FilterBar/dummyCases";
import React, { useState, useEffect } from "react";
import NavigationButton from "../NavigationButton/NavigationButton";
import "./SupplierDashboard.css";
import { getCases, type CaseListItem } from "@/services/caseService";

export type Column = {
  heading: string;
  accessor: (caseItem: CaseListItem) => React.ReactNode;
};

function SupplierDashboard() {
  const columns: Column[] = [
    { heading: "Ordrenummer", accessor: (caseItem) => caseItem.id },
    { heading: "Type sak", accessor: (caseItem) => caseItem.damage_type },
    { heading: "Status", accessor: (caseItem) => caseItem.status },
    { heading: "navn", accessor: (caseItem) => caseItem.stores.name },
    { heading: "Sist oppdatert", accessor: (caseItem) => caseItem.updated_at },
  ];

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stores = [...new Set(dummyCases.map((c) => c.store))]; //hardkodet definerte butikker
  const [casesData, setCasesData] = useState<CaseListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  //inkommende saker
  const incomingCases =
    casesData?.filter(
      (caseItem) => caseItem.status === "submitted_by_customer",
    ) || [];

  //Filteringslogikk av 'Alle eksisterende saker (nederste tabell)':
  const filteredCases = (casesData ?? []).filter((caseItem) => {
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
    <div className="content-layout">
      <div className="navigationButtonSection">
        <NavigationButton placeholder="Statistikk" linken="./stats" />
        <NavigationButton placeholder="Se alle saker" linken="./cases" />
      </div>
      <div>
        <h1 className="dashboardHeader">Inkommende saker:</h1>
      </div>
      <div className="incomingCasesTable">
        <CaseTable allCases={incomingCases} columns={columns} />
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
        <CaseTable allCases={filteredCases} columns={columns} />
      </div>
    </div>
  );
}
export { SupplierDashboard };
