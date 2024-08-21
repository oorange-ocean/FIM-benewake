import React from 'react'
import { Card, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'transparent', // 改为透明背景
    color: '#ffffff',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: 'none', // 移除阴影
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing(2) // 添加间距
}))
const ItemCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#033E85',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)'
    },
    color: '#ffffff' // 将卡片内除数字外的所有文字颜色设置为白色
}))

const ValueTypography = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: '#0CF2F2' // 保持数字的颜色为原来的青色
}))

const NumberDisplay = ({ items, onItemClick }) => {
    return (
        <StyledCard>
            {items.map((item, index) => (
                <ItemCard key={index} onClick={() => onItemClick(item)}>
                    <Typography variant="subtitle2" gutterBottom>
                        {item.itemCode} - {item.itemName}
                    </Typography>
                    <ValueTypography variant="h4">{item.value}</ValueTypography>
                    <Typography variant="body2">{item.type}</Typography>
                </ItemCard>
            ))}
        </StyledCard>
    )
}
export default NumberDisplay
