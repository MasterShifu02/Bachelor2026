type FilterBarProps = {
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  allStores: string[];
};

export function FilterBar({
  setSelectedStore,
  selectedStore,
  allStores,
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
    </>
  );
}
