import React from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderItem } from '../../../types/orderTypes';
import { formatDate } from '../../util/fomateDate';

interface OrderItemCardProps {
    item: OrderItem;
    order: Order;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, order }) => {
    const navigate = useNavigate();
    const isCancelled = order?.orderStatus === 'CANCELLED' || order?.orderStatus === 'CANCELED';
    const isDelivered = order?.orderStatus === 'DELIVERED';
    const rawDeliveryDate = (order as any)?.deliveryDate || order?.deliverDate;
    const formattedDate = rawDeliveryDate ? formatDate(rawDeliveryDate) : 'Within 5-7 business days';

    return (
        <div 
            onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)} 
            className='bg-[#121217] border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 p-5 rounded-2xl cursor-pointer shadow-lg space-y-4 group'
        >
            {/* Status Header */}
            <div className='flex items-center justify-between border-b border-white/5 pb-3.5'>
                <div className='flex items-center gap-3'>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCancelled 
                            ? 'bg-red-500/10 text-red-400' 
                            : isDelivered 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-[#C5A059]/10 text-[#C5A059]'
                    }`}>
                        {isCancelled ? (
                            <CancelIcon sx={{ fontSize: 18 }} />
                        ) : isDelivered ? (
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                        ) : (
                            <LocalShippingIcon sx={{ fontSize: 18 }} />
                        )}
                    </div>
                    <div>
                        <div className='flex items-center gap-2'>
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                                isCancelled ? 'text-red-400' : isDelivered ? 'text-emerald-400' : 'text-[#DFBA73]'
                            }`}>
                                {order.orderStatus || 'ORDER PLACED'}
                            </span>
                            <span className='text-zinc-600 text-xs'>•</span>
                            <span className='text-xs text-zinc-400'>
                                {isDelivered ? `Delivered on ${formattedDate}` : isCancelled ? 'Order was cancelled' : `Arriving by ${formattedDate}`}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    size='small'
                    endIcon={<ChevronRightIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        color: '#C5A059',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.08)' }
                    }}
                >
                    Track Order
                </Button>
            </div>

            {/* Product Info */}
            <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4'>
                    <img 
                        className='w-16 h-20 sm:w-18 sm:h-22 object-cover rounded-xl border border-white/10 shadow-sm'
                        src={item.product?.images?.[0] || ""} 
                        alt={item.product?.title || "Product"} 
                    />
                    <div className='space-y-1'>
                        <h4 className='font-bold text-sm text-[#F5F5F7]'>
                            {item.product?.seller?.businessDetails?.businessName || item.product?.seller?.sellerName || "Exclusive Store"}
                        </h4>
                        <p className="text-zinc-300 text-sm line-clamp-1 max-w-sm sm:max-w-md">
                            {item.product?.title}
                        </p>
                        <div className='flex items-center gap-2 text-xs text-zinc-400 pt-0.5'>
                            <span>Qty: {item.quantity || 1}</span>
                            <span>•</span>
                            <span>Size: {item.size || "FREE"}</span>
                        </div>
                    </div>
                </div>

                <div className='text-right'>
                    <p className='font-bold text-base text-[#F5F5F7]'>₹{item.sellingPrice}.00</p>
                    {item.mrpPrice && item.mrpPrice > item.sellingPrice && (
                        <p className='text-xs text-zinc-500 line-through'>₹{item.mrpPrice}.00</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderItemCard;