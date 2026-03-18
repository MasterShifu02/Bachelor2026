import { statuses } from "./dummyCases";
import "./FilterBar.css";
type FilterBarProps = {
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  allStores: string[];
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  statuses: readonly string[];
  searchTerm: string;
  setSearchTerm: (seardchTerm: string) => void;
};

export function FilterBar({
  setSelectedStore,
  selectedStore,
  allStores,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
}: FilterBarProps) {
  return (
    <>
      <select
        value={selectedStore}
        onChange={(e) => setSelectedStore(e.target.value)}
      >
        <option value="">Butikk</option>
        {allStores.map((store) => (
          <option key={store} value={store}>
            {store}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Status</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        className="searchField"
        type="search"
        value={searchTerm}
        placeholder="Søk etter ordernummer..."
        onChange={(e) => setSearchTerm(e.target.value)}
      ></input>
    </>
  );
}
