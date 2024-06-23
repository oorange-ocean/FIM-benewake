import create from 'zustand';

const useSortStore = create((set) => ({
  sortColumn: null,
  sortDirection: null,
  setSortState: (column, direction) => set({ sortColumn: column, sortDirection: direction }),
  resetSortState: () => set({ sortColumn: null, sortDirection: null }),
}));

export default useSortStore;