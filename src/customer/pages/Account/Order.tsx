import React, { useEffect } from 'react'
import OrderItemCard from './OrderItemCard'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchUserOrderHistory } from '../../../Redux Toolkit/Customer/OrderSlice';
import { Button, CircularProgress } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth, orders } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""));
  }, [auth.jwt]);

  const allItems = orders?.orders?.flatMap(order => 
    (order?.orderItems || []).map(item => ({ item, order }))
  ) || [];

  return (
    <div className='text-sm min-h-screen space-y-6'>
      <div className='flex items-center justify-between pb-4 border-b border-white/10'>
        <div>
          <h1 className='font-serif text-2xl font-bold text-[#F5F5F7]'>
            My Orders & Tracking
          </h1>
          <p className='text-zinc-400 text-xs mt-0.5'>
            Track shipments, review past purchases, and manage returns
          </p>
        </div>
        {allItems.length > 0 && (
          <span className='px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#DFBA73] text-xs font-bold rounded-full'>
            {allItems.length} {allItems.length === 1 ? 'Order' : 'Orders'}
          </span>
        )}
      </div>

      {orders.loading ? (
        <div className='h-[40vh] flex flex-col justify-center items-center gap-3 text-zinc-400'>
          <CircularProgress sx={{ color: "#C5A059" }} />
          <p className="text-sm">Fetching your orders...</p>
        </div>
      ) : allItems.length === 0 ? (
        <div className='p-12 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-4 shadow-xl max-w-lg mx-auto my-8'>
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center">
            <ShoppingBagIcon sx={{ color: "#C5A059", fontSize: 32 }} />
          </div>
          <h2 className='text-xl font-serif font-bold text-[#F5F5F7]'>
            No Orders Found
          </h2>
          <p className='text-zinc-400 text-sm'>
            You haven't placed any orders yet. Explore our curated collections and place your first order.
          </p>
          <Button 
            onClick={() => navigate('/')}
            variant="contained"
            sx={{
              bgcolor: "#C5A059",
              color: "#0B0B0E",
              fontWeight: 700,
              px: 4,
              py: 1.2,
              borderRadius: "0.75rem",
              textTransform: "none",
              '&:hover': { bgcolor: "#D4AF37" }
            }}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {allItems.map(({ item, order }, index) => (
            <OrderItemCard key={item.id || index} item={item} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;