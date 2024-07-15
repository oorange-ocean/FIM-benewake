// store.js
import { create } from 'zustand';

const useStore = create((set, get) => ({
    pageSizeMap: {},
    filterMap: {},
    setPageSize: (type, size) => set((state) => ({
        pageSizeMap: { ...state.pageSizeMap, [type]: size }
    })),
    setFilters: (type, filters) => set((state) => ({
        filterMap: { ...state.filterMap, [type]: filters }
    })),
    getPageSize: (type) => get().pageSizeMap[type] || 100,
    getFilters: (type) => get().filterMap[type] || [],
}));

export default useStore;
