import { memo, useMemo, useState, useEffect } from 'react';
import SecTabs from '../components/SecTabs'
import Table from '../components/table/Table';
import Views from '../components/Views';
import Toolbar from '../components/Toolbar';
import { useTableDataContext } from '../hooks/useCustomContext';
import { allViews } from '../constants/Views';
import AllDefs from '../constants/defs/AllDefs';
import { useLoaderData } from 'react-router-dom';
import Loader from '../components/Loader';
const All = () => {
    useLoaderData();
    const tableData = useTableDataContext()
    const columns = useMemo(() => AllDefs, [])
    const features = ["new", "delete", "import", "export", "edit", "startInquiry", "refresh", 'allowInquiry', 'visibility']
    const [views, setViews] = useState(allViews)
    const [loading, setLoading] = useState(false)
    return (
       <>
        {
            loading ? <Loader /> : (
                <div className='col full-screen'>
                    <div className="tab-contents">
                        <Toolbar features={features} 
                        setLoading={setLoading}
                        />
                        <SecTabs />
                        <Views
                            views={views}
                            setViews={setViews}
                            editable
                        />
                    </div>
                    {tableData &&
                        <div className='content-container col'>
                            <Table
                                data={tableData}
                                columns={columns}
                            />
                        </div>
                    }
                </div>
            )
        }
       </>
    )
}

export default memo(All);