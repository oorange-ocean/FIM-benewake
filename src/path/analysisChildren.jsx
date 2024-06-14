import { fetchAnalysisData } from "../api/analysis";
import Analysis from "../routes/Analysis";
import analysisSchema from "../constants/schemas/analysisSchema";
const analysisChildren = Object.keys(analysisSchema).map((key, index, array) => {
    const item = analysisSchema[key];
    const isPastAnalysis = index >= array.length - 4; // 判断是否是最后四个
    return {
        name: item.cn,
        path: key,
        element: <Analysis schema={item} />,
        type: isPastAnalysis ? "past-analysis" : "analysis",
        loader: async ({ signal }) => {
            try {
                const res = await fetchAnalysisData(item.select, { signal });
                return res;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching analysis data:", err);
                }
                throw err;
            }
        }
    };
});


export default analysisChildren;
