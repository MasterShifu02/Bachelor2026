import { statusLabels, type Status } from "../../constants/statuses";
import "./FilterBar.css";

type FilterBarProps = {
  selectedStatus: string;
  setSelectedStatus: (status: Status | "") => void;
  statuses: readonly Status[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
};

export function FilterBar({
  selectedStatus,
  setSelectedStatus,
  statuses,
  searchTerm,
  setSearchTerm,
}: FilterBarProps) {
  return (
    <>
      <select
        className="options-button"
        value={selectedStatus}
        onChange={(e) =>
          setSelectedStatus(e.target.value as Status | "")
        }
      >
        <option value="">Status</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>

      <input
        className="searchField"
        type="search"
        value={searchTerm}
        placeholder="Søk etter saksnummer, navn, e-post..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </>
  );
}