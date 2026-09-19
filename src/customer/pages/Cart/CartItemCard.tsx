import { Button, Divider, IconButton } from '@mui/material'
import React from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { CartItem } from '../../../types/cartTypes';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { deleteCartItem, updateCartItem } from '../../../Redux Toolkit/Customer/CartSlice';

interface CartItemProps {
    item:CartItem
}

const CartItemCard : React.FC<CartItemProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    
    const handleUpdateQuantity=(value:number)=>{
        dispatch(updateCartItem({jwt:localStorage.getItem("jwt"),
            cartItemId:item.id, cartItem:{quantity:item.quantity + value}}))
    }
    const handleRemoveCartItem=()=>{
        dispatch(deleteCartItem({
            jwt:localStorage.getItem("jwt") || "", 
            cartItemId:item.id}))
    }
    return (
        <div className='border border-white/10 bg-[#121217] rounded-xl relative shadow-md'>
            <div className='p-5 flex gap-4'>

                <div>
                    <img 
                        className='w-[90px] h-[110px] object-cover rounded-lg border border-white/10' 
                        src={item.product?.images?.[0] || ""}
                        alt={item.product?.title || "cart item"} 
                    />
                </div>
                <div className='space-y-1.5'>
                    <h1 className='font-semibold text-base text-[#F5F5F7]'>
                        {item.product?.seller?.businessDetails?.businessName || item.product?.seller?.sellerName || "Exclusive Store"}
                    </h1>
                    <p className='text-zinc-300 font-medium text-sm'>{item.product?.title}</p>
                    <p className='text-zinc-400 text-xs'>
                        <strong className="text-zinc-300">Sold by:</strong> {item.product?.seller?.businessDetails?.businessName || item.product?.seller?.sellerName || "Verified Seller"}
                    </p>
                    <p className='text-xs text-[#C5A059]'><strong>7 days replacement</strong> available</p>
                    <p className='text-xs text-zinc-400'><strong className="text-zinc-300">Quantity:</strong> {item.quantity}</p>
                </div>

            </div>
            <Divider />
            <div className='px-5 py-2 flex justify-between items-center'>

                <div className=' flex items-center gap-2  w-[140px] justify-between'>

                    <Button size='small' disabled={item.quantity == 1} onClick={() => handleUpdateQuantity(-1)} >
                        <RemoveIcon />
                    </Button>
                    <span className='px-3  font-semibold'>
                        {item.quantity}
                    </span>
                    <Button size='small' onClick={() => handleUpdateQuantity(1)} >
                        <AddIcon />
                    </Button>

                </div>
                <div>
                    <p className='text-gray-700 font-medium'>₹{item.sellingPrice}</p>
                </div>


            </div>
            <div className='absolute top-1 right-1'>
                <IconButton onClick={handleRemoveCartItem} color='primary' >
                    <CloseIcon />
                </IconButton>
            </div>

        </div>
    )
}

export default CartItemCard