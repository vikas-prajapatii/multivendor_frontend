import { Button, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = ({ showBuyButton, SubmitButton }: any) => {
  const navigate = useNavigate();
  const { cart, auth } = useAppSelector((store) => store);
  return (
    <div className="text-[#F5F5F7]">
      <div className="space-y-3 p-5 text-sm">
        <div className="flex justify-between items-center text-zinc-300">
          <span>Subtotal</span>
          <span className="font-semibold text-[#F5F5F7]">₹ {cart.cart?.totalMrpPrice || 0}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-300">
          <span>Discount</span>
          <span className="font-semibold text-emerald-400">
            - ₹{" "}
            {(sumCartItemMrpPrice(cart.cart?.cartItems || []) -
              sumCartItemSellingPrice(cart.cart?.cartItems || [])) || 0}
          </span>
        </div>
        <div className="flex justify-between items-center text-zinc-300">
          <span>Shipping</span>
          <span className="font-semibold text-[#F5F5F7]">₹ 79</span>
        </div>
        <div className="flex justify-between items-center text-zinc-300">
          <span>Platform Fee</span>
          <span className="text-[#C5A059] font-semibold">Free</span>
        </div>
      </div>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

      <div className="font-bold text-base px-5 py-3 flex justify-between items-center text-[#F5F5F7]">
        <span>Total Payable</span>
        <span className="text-lg text-[#C5A059]">₹ {(cart.cart?.totalSellingPrice || 0) + 79}</span>
      </div>
    </div>
  );
 };
//  sumCartItemSellingPrice(cart.cart?.cartItems || [])
// sumCartItemMrpPrice(cart.cart?.cartItems || [])

export default PricingCard;
