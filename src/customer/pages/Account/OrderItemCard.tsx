import React from 'react'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Avatar, Button } from '@mui/material';
import { teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderItem } from '../../../types/orderTypes';
import { formatDate } from '../../util/fomateDate';

interface OrderItemCardProps{
    item:OrderItem,
    order:Order
}
const OrderItemCard:React.FC<OrderItemCardProps> = ({item,order}) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)} className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer'>

            <div className='flex items-center gap-3'>
                <div>
                    <Avatar sizes='small' sx={{ bgcolor: teal[500] }}>
                        <ElectricBoltIcon />
                    </Avatar>

                </div>
                <div>
                    <h1 className='font-bold text-teal-600'>{order.orderStatus}
                    </h1>
                    <p>Arriving by {formatDate(order.deliverDate)}</p>
                </div>
            </div>
            <div className='p-4 bg-[#121217] flex gap-3 border border-white/5 rounded-b-xl'>
                <div className=''>
                    <img className='w-[70px] h-[85px] object-cover rounded-md border border-white/10'
                     src={item.product?.images?.[0] || ""} alt="" />
                </div>
                <div className='w-full space-y-1'>
                    <h1 className='font-bold text-sm text-[#F5F5F7]'>
                        {item.product?.seller?.businessDetails?.businessName || item.product?.seller?.sellerName || "Exclusive Store"}
                    </h1>
                    <p className="text-zinc-300 text-sm">
                        {item.product?.title}
                    </p>
                    <p className="text-zinc-400 text-xs"><strong>Size: </strong>FREE</p>
                </div>
            </div>

        </div>
    )
}

export default OrderItemCard