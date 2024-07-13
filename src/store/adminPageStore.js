// store.js
import { create } from 'zustand';

const useStore = create((set) => ({
    pageSizes: {},
    filters: {},
    setPageSize: (page, size) => set((state) => ({
        pageSizes: { ...state.pageSizes, [page]: size }
    })),
    setFilters: (page, filters) => set((state) => ({
        filters: { ...state.filters, [page]: filters }
    }))
}));

export default useStore;
