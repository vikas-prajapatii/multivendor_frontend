import { Box, Button, Divider } from '@mui/material'
import React, { useEffect } from 'react'
import PaymentsIcon from '@mui/icons-material/Payments';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
  const dispatch = useAppDispatch()
  const { cart, auth, orders } = useAppSelector(store => store);
  const { orderItemId, orderId } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrderItemById({
      orderItemId: Number(orderItemId),
      jwt: localStorage.getItem("jwt") || ""
    }))
    dispatch(fetchOrderById({
      orderId: Number(orderId),
      jwt: localStorage.getItem("jwt") || ""
    }))
  }, [auth.jwt])

  if (!orders.orders || !orders.orderItem) {
    return <div className='h-[80vh] flex justify-center items-center'>
      No order found
    </div>;
  }

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId))
  }

  return (
    <Box className='space-y-5 '>

      <section className='flex flex-col gap-5 justify-center items-center'>
        <img className='w-[100px] rounded-lg' src={orders.orderItem?.product.images?.[0] || ""} alt="" />
        <div className='text-sm space-y-1 text-center'>
          <h1 className='font-bold text-base text-[#F5F5F7]'>
            {orders.orderItem?.product.seller?.businessDetails?.businessName || orders.orderItem?.product.seller?.sellerName || "Exclusive Store"}
          </h1>
          <p className="text-zinc-300">{orders.orderItem?.product.title}</p>
          <p className="text-zinc-400"><strong>Size: </strong>M</p>
        </div>
        <div>
          <Button onClick={() => navigate(`/reviews/${orders.orderItem?.product.id}/create`)}>Write Review</Button>
        </div>
      </section>

      <section className='border p-5'>
        <OrderStepper orderStatus={orders.currentOrder?.orderStatus} />

      </section>
      <div className='border p-5'>
        <h1 className='font-bold pb-3'>Delivery Address</h1>
        <div className='text-sm space-y-2'>
          <div className='flex gap-5 font-medium'>
            <p> {orders.currentOrder?.shippingAddress.name}</p>
            <Divider flexItem orientation='vertical' />
            <p>{orders.currentOrder?.shippingAddress.mobile}</p>
          </div>

          <p>
            {orders.currentOrder?.shippingAddress.address}, {orders.currentOrder?.shippingAddress.city}, {orders.currentOrder?.shippingAddress.state} - {orders.currentOrder?.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      <div className='border  space-y-4'>

        <div className='flex justify-between text-sm pt-5 px-5'>
          <div className='space-y-1'>
            <p className='font-bold'>Total Item Price</p>
            <p>You saved <span className='text-green-500 font-medium text-xs'>₹
              {orders.orderItem?.mrpPrice - orders.orderItem?.sellingPrice}.00</span> on this item</p>
          </div>

          <p className='font-medium'>₹ {orders.orderItem?.sellingPrice}.00</p>
        </div>

        <div className='px-5 '>
          <div className='bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3 '>
            <PaymentsIcon />
            <p >Pay On Delivery</p>


          </div>
        </div>


        <Divider />
        <div className='px-5 pb-5'>
          <p className='text-xs text-zinc-400'>
            <strong className="text-zinc-300">Sold by : </strong>
            {orders.orderItem?.product?.seller?.businessDetails?.businessName || orders.orderItem?.product?.seller?.sellerName || "Verified Seller"}
          </p>
        </div>

        <div className='p-10'>
          <Button
          disabled={orders.currentOrder?.orderStatus==="CANCELLED"}
            onClick={handleCancelOrder}
            color='error' sx={{ py: "0.7rem" }} className='' variant='outlined' fullWidth>
            {orders.currentOrder?.orderStatus==="CANCELLED"?"order canceled":"Cancel Order"}
          </Button>
        </div>
      </div>
    </Box>
  )
}

export default OrderDetails