import { memo, useMemo, useState, useTransition } from 'react'
import { useLoaderData, Await } from 'react-router-dom'
import SecTabs from '../components/SecTabs'
import Table from '../components/table/Table'
import Views from '../components/Views'
import Toolbar from '../components/Toolbar'
import { useTableDataContext } from '../hooks/useCustomContext'
import { allViews } from '../constants/Views'
import AllDefs from '../constants/defs/AllDefs'
import Loader from '../components/Loader'

const All = () => {
    const { updateData } = useLoaderData()
    const tableData = useTableDataContext()
    const columns = useMemo(() => AllDefs, [])
    const features = [
        'new',
        'delete',
        'import',
        'export',
        'edit',
        'startInquiry',
        'refresh',
        'allowInquiry',
        'visibility'
    ]
    const [views, setViews] = useState(allViews)
    const [loading, setLoading] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [selected, setSelected] = useState([])
    const handleSetLoading = (value) => {
        startTransition(() => {
            setLoading(value)
        })
    }

    return (
        <Await
            resolve={updateData}
            errorElement={<div>加载出错</div>}
            fallback={<Loader />}
        >
            {() => (
                <div className="col full-screen">
                    <div className="tab-contents">
                        <Toolbar
                            features={features}
                            setLoading={handleSetLoading}
                        />
                        <SecTabs />
                        <Views
                            views={views}
                            setViews={setViews}
                            editable
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                    {(loading || isPending) && <Loader />}
                    {tableData && (
                        <div className="content-container col">
                            <Table data={tableData} columns={columns} />
                        </div>
                    )}
                </div>
            )}
        </Await>
    )
}

export default memo(All)
