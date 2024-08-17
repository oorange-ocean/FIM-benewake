import React from 'react'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Navigation = ({ navigationStack, setNavigationStack, renderPages }) => {
    const getCurrentPage = () => navigationStack[navigationStack.length - 1]

    const navigateBack = () => {
        if (navigationStack.length > 1) {
            setNavigationStack(navigationStack.slice(0, -1))
        }
    }

    const navigateTo = (page) => {
        setNavigationStack([...navigationStack, page])
    }

    return (
        <div>
            {getCurrentPage() !== 'main' && (
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={navigateBack}
                    style={{ marginBottom: '10px' }}
                >
                    返回
                </Button>
            )}
            {renderPages[getCurrentPage()](navigateTo)}
        </div>
    )
}

export default Navigation
