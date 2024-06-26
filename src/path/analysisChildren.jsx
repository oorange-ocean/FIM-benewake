import { fetchAnalysisData } from "../api/analysis";
import Analysis from "../routes/Analysis";
import analysisSchema from "../constants/schemas/analysisSchema";

const analysisChildren = Object.keys(analysisSchema).map(
    (key) => {
        const item = analysisSchema[key];
        return {
            name: item.cn,
            path: key,
            element: <Analysis schema={item} />,
            type: "past-analysis",
            loader: async ({ signal }) => {
                try {
                    // 从 localStorage 获取分页参数
                    const savedPagination = {
                        current: 1,
                        pageSize: localStorage.getItem('pagination').pageSize || 100
                    };

                    const res = await fetchAnalysisData(item.select, {
                        pageNum: savedPagination.current || 1,
                        pageSize: savedPagination.pageSize || 100,
                        signal
                    });
                    return res;
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error("Error fetching analysis data:", err);
                    }
                    throw err;
                }
            }
        }
    }
);

export default analysisChildren;
