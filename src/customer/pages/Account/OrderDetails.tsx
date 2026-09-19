import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PaymentsIcon from '@mui/icons-material/Payments';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../util/fomateDate';

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const { auth, orders } = useAppSelector(store => store);
  const { orderItemId, orderId } = useParams();
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (orderItemId) {
      dispatch(fetchOrderItemById({
        orderItemId: Number(orderItemId),
        jwt: localStorage.getItem("jwt") || ""
      }));
    }
    if (orderId) {
      dispatch(fetchOrderById({
        orderId: Number(orderId),
        jwt: localStorage.getItem("jwt") || ""
      }));
    }
  }, [orderId, orderItemId, auth.jwt]);

  if (orders.loading && !orders.orderItem) {
    return (
      <div className='h-[60vh] flex flex-col justify-center items-center gap-3 text-zinc-400'>
        <CircularProgress sx={{ color: "#C5A059" }} />
        <p className="text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!orders.orderItem && !orders.loading) {
    return (
      <div className='h-[60vh] flex flex-col justify-center items-center gap-4 text-center px-4'>
        <p className="text-lg text-zinc-300 font-serif">Order or item not found</p>
        <Button 
          onClick={() => navigate("/account/orders")}
          variant="contained"
          sx={{ bgcolor: "#C5A059", color: "#0B0B0E", fontWeight: 700, textTransform: "none", '&:hover': { bgcolor: "#D4AF37" } }}
        >
          View All Orders
        </Button>
      </div>
    );
  }

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    if (orderId) {
      dispatch(cancelOrder(orderId));
    }
  };

  const isCancelled = orders.currentOrder?.orderStatus === "CANCELLED" || orders.currentOrder?.orderStatus === "CANCELED";
  const isDelivered = orders.currentOrder?.orderStatus === "DELIVERED";
  const item = orders.orderItem;
  const order = orders.currentOrder;

  return (
    <Box className='space-y-6 pb-12'>
      {/* Header bar with Back button & Order ID */}
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10'>
        <Button
          onClick={() => navigate('/account/orders')}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: '#C5A059',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.08)' }
          }}
        >
          Back to Orders
        </Button>
        <div className='text-right'>
          <p className='text-xs text-zinc-400'>Order Reference</p>
          <p className='text-sm font-bold text-[#F5F5F7] tracking-wider'>#ORD-{orderId}</p>
        </div>
      </div>

      {/* Live Flipkart-style Order Tracking Stepper */}
      <div className='bg-[#121217] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4'>
        <div className='flex items-center justify-between border-b border-white/5 pb-3'>
          <h2 className='font-serif text-lg font-bold text-[#F5F5F7] flex items-center gap-2'>
            <LocalShippingIcon sx={{ color: "#C5A059", fontSize: 22 }} />
            Order Tracking Status
          </h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            isCancelled 
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : isDelivered 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-[#C5A059]/10 text-[#DFBA73] border border-[#C5A059]/20'
          }`}>
            {order?.orderStatus || 'PROCESSING'}
          </span>
        </div>

        <OrderStepper 
          orderStatus={order?.orderStatus} 
          orderDate={order?.orderDate}
          deliveryDate={order?.deliveryDate}
        />
      </div>

      {/* Product Details Card */}
      <div className='bg-[#121217] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5'>
        <div className='flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <img 
              className='w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-white/10 shadow-md' 
              src={item?.product?.images?.[0] || ""} 
              alt={item?.product?.title || "Product"} 
            />
            <div className='space-y-1 text-sm'>
              <h3 className='font-bold text-base text-[#F5F5F7]'>
                {item?.product?.seller?.businessDetails?.businessName || item?.product?.seller?.sellerName || "Exclusive Store"}
              </h3>
              <p className="text-zinc-300 line-clamp-2 max-w-md">{item?.product?.title}</p>
              <div className='flex items-center gap-3 text-xs text-zinc-400 pt-1'>
                <span><strong>Size: </strong>{item?.size || "FREE"}</span>
                <span>•</span>
                <span><strong>Quantity: </strong>{item?.quantity || 1}</span>
              </div>
            </div>
          </div>

          <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3'>
            <div className='text-right'>
              <p className='text-lg font-bold text-[#F5F5F7]'>₹{item?.sellingPrice}.00</p>
              {item?.mrpPrice && item.mrpPrice > item.sellingPrice && (
                <p className='text-xs text-zinc-500 line-through'>₹{item.mrpPrice}.00</p>
              )}
            </div>
            <Button 
              onClick={() => navigate(`/reviews/${item?.product?.id}/create`)}
              variant="outlined"
              size="small"
              startIcon={<RateReviewIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#F5F5F7",
                borderRadius: "0.5rem",
                textTransform: "none",
                fontSize: "0.8rem",
                '&:hover': { borderColor: "#C5A059", color: "#C5A059" }
              }}
            >
              Write Review
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Delivery Address & Price Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* Delivery Address */}
        <div className='bg-[#121217] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3'>
          <h3 className='font-serif font-bold text-base text-[#F5F5F7] flex items-center gap-2 pb-2 border-b border-white/5'>
            <LocationOnIcon sx={{ color: "#C5A059", fontSize: 20 }} />
            Delivery Address
          </h3>
          <div className='text-sm space-y-1.5 text-zinc-300'>
            <p className='font-bold text-[#F5F5F7]'>{order?.shippingAddress?.name || auth.user?.fullName}</p>
            <p className='text-zinc-400 text-xs'>{order?.shippingAddress?.mobile || auth.user?.mobile}</p>
            <p className='text-zinc-300 text-xs leading-relaxed'>
              {order?.shippingAddress?.address}, {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pinCode}
            </p>
          </div>
        </div>

        {/* Price Details */}
        <div className='bg-[#121217] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3'>
          <h3 className='font-serif font-bold text-base text-[#F5F5F7] flex items-center gap-2 pb-2 border-b border-white/5'>
            <PaymentsIcon sx={{ color: "#C5A059", fontSize: 20 }} />
            Price & Payment Summary
          </h3>
          <div className='text-xs space-y-2 text-zinc-300'>
            <div className='flex justify-between'>
              <span className='text-zinc-400'>Item Selling Price</span>
              <span>₹{item?.sellingPrice || 0}.00</span>
            </div>
            {item?.mrpPrice && item.mrpPrice > item.sellingPrice && (
              <div className='flex justify-between text-emerald-400'>
                <span>Discount Savings</span>
                <span>- ₹{item.mrpPrice - item.sellingPrice}.00</span>
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-zinc-400'>Delivery Fee</span>
              <span className='text-emerald-400 font-semibold'>FREE</span>
            </div>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <div className='flex justify-between text-sm font-bold text-[#F5F5F7] pt-1'>
              <span>Total Paid / Payable</span>
              <span className='text-[#C5A059]'>₹{item?.sellingPrice || 0}.00</span>
            </div>
            <div className='pt-2'>
              <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-zinc-300 font-medium'>
                <CheckCircleIcon sx={{ fontSize: 14, color: "#C5A059" }} />
                {order?.paymentStatus === "COMPLETED" ? "Paid Online (Razorpay / Card)" : "Pay on Delivery (Cash / UPI)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Action */}
      {!isCancelled && !isDelivered && (
        <div className='pt-2 flex justify-end'>
          <Button
            onClick={() => setCancelDialogOpen(true)}
            variant="outlined"
            color="error"
            sx={{
              borderColor: "rgba(239, 68, 68, 0.4)",
              color: "#F87171",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "0.75rem",
              '&:hover': {
                borderColor: "#EF4444",
                bgcolor: "rgba(239, 68, 68, 0.08)"
              }
            }}
          >
            Cancel Order
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#121217',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '1.25rem',
            color: '#F5F5F7',
            p: 1
          }
        }}
      >
        <DialogTitle className="font-serif font-bold text-lg">Confirm Order Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            Are you sure you want to cancel this order? Once cancelled, the shipment will be recalled and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setCancelDialogOpen(false)} 
            sx={{ color: '#F5F5F7', textTransform: 'none' }}
          >
            Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: '0.5rem', textTransform: 'none', fontWeight: 600 }}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails;