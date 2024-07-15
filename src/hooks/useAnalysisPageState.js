// usePageState.js
import useStore from '../store/analysisPageStore';

const useAnalysisPageState = (type) => {
    const pageSize = useStore((state) => state.getPageSize(type));
    const setPageSize = (size) => useStore.getState().setPageSize(type, size);

    const filters = useStore((state) => state.getFilters(type));
    const setFilters = (filters) => useStore.getState().setFilters(type, filters);

    return {
        pageSize,
        setPageSize,
        filters,
        setFilters,
    };
};

export default useAnalysisPageState;
