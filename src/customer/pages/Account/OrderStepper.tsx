import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { formatDate } from "../../util/fomateDate";

interface OrderStepperProps {
    orderStatus?: string;
    orderDate?: string;
    deliveryDate?: string;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ orderStatus, orderDate, deliveryDate }) => {
    const isCancelled = orderStatus?.toUpperCase() === "CANCELLED" || orderStatus?.toUpperCase() === "CANCELED";

    const formattedOrderDate = orderDate ? formatDate(orderDate) : "Recently";
    const formattedDeliveryDate = deliveryDate ? formatDate(deliveryDate) : "Within 5-7 days";

    const normalSteps = [
        {
            name: "Order Confirmed",
            desc: formattedOrderDate,
            subDesc: "Order placed & confirmed",
            icon: CheckCircleOutlineIcon,
            key: "PLACED",
        },
        {
            name: "Item Packed",
            desc: "Ready for Dispatch",
            subDesc: "Seller packed your item",
            icon: InventoryIcon,
            key: "CONFIRMED",
        },
        {
            name: "Shipped",
            desc: "In Transit",
            subDesc: "Package dispatched to your city",
            icon: LocalShippingIcon,
            key: "SHIPPED",
        },
        {
            name: "Delivered",
            desc: formattedDeliveryDate,
            subDesc: "Delivered to address",
            icon: DoneAllIcon,
            key: "DELIVERED",
        },
    ];

    const cancelledSteps = [
        {
            name: "Order Placed",
            desc: formattedOrderDate,
            subDesc: "Order placed initially",
            icon: CheckCircleOutlineIcon,
            key: "PLACED",
        },
        {
            name: "Order Cancelled",
            desc: "Cancelled",
            subDesc: "Your order was cancelled",
            icon: CancelIcon,
            key: "CANCELLED",
        },
    ];

    const getStepIndex = (status?: string): number => {
        switch (status?.toUpperCase()) {
            case "PENDING":
            case "PLACED":
                return 0;
            case "CONFIRMED":
                return 1;
            case "SHIPPED":
                return 2;
            case "DELIVERED":
                return 3;
            default:
                return 0;
        }
    };

    const currentStepIndex = isCancelled ? 1 : getStepIndex(orderStatus);
    const activeSteps = isCancelled ? cancelledSteps : normalSteps;

    return (
        <div className="w-full py-4 px-2 sm:px-4">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden md:flex items-start justify-between relative w-full mb-6">
                {/* Connecting Track Background */}
                <div className="absolute top-5 left-10 right-10 h-[3px] bg-white/10 z-0" />
                
                {/* Filled Connecting Track */}
                <div 
                    className={`absolute top-5 left-10 h-[3px] z-0 transition-all duration-500 ${
                        isCancelled ? "bg-red-500" : "bg-[#C5A059]"
                    }`}
                    style={{
                        width: isCancelled 
                            ? "80%" 
                            : `${(currentStepIndex / (activeSteps.length - 1)) * 80}%`
                    }}
                />

                {activeSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                        <div key={index} className="flex flex-col items-center relative z-10 text-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                                    isCancelled && step.key === "CANCELLED"
                                        ? "bg-red-500/20 text-red-400 border-2 border-red-500 shadow-red-500/30"
                                        : isCompleted || (isCurrent && step.key === "DELIVERED")
                                        ? "bg-[#10B981] text-black border-2 border-[#10B981]"
                                        : isCurrent
                                        ? "bg-[#C5A059] text-black border-2 border-[#D4AF37] ring-4 ring-[#C5A059]/20"
                                        : "bg-[#1E1E26] text-zinc-500 border-2 border-white/10"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                                ) : (
                                    <StepIcon sx={{ fontSize: 20 }} />
                                )}
                            </div>

                            <div className="mt-3 space-y-0.5 max-w-[140px]">
                                <p className={`text-sm font-semibold leading-tight ${
                                    isCurrent ? (isCancelled ? "text-red-400" : "text-[#C5A059]") : isCompleted ? "text-[#F5F5F7]" : "text-zinc-500"
                                }`}>
                                    {step.name}
                                </p>
                                <p className="text-xs text-zinc-400 font-medium">
                                    {step.desc}
                                </p>
                                <p className="text-[11px] text-zinc-500 leading-tight">
                                    {step.subDesc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-5">
                {activeSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isLast = index === activeSteps.length - 1;
                    const StepIcon = step.icon;

                    return (
                        <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCancelled && step.key === "CANCELLED"
                                            ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                                            : isCompleted || (isCurrent && step.key === "DELIVERED")
                                            ? "bg-[#10B981] text-black border-2 border-[#10B981]"
                                            : isCurrent
                                            ? "bg-[#C5A059] text-black border-2 border-[#D4AF37] ring-4 ring-[#C5A059]/20"
                                            : "bg-[#1E1E26] text-zinc-500 border-2 border-white/10"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                                    ) : (
                                        <StepIcon sx={{ fontSize: 18 }} />
                                    )}
                                </div>
                                {!isLast && (
                                    <div
                                        className={`w-[2px] h-10 my-1 transition-all ${
                                            isCancelled 
                                                ? "bg-red-500" 
                                                : isCompleted 
                                                ? "bg-[#C5A059]" 
                                                : "bg-white/10"
                                        }`}
                                    />
                                )}
                            </div>

                            <div className="pt-0.5 space-y-0.5 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm font-semibold ${
                                        isCurrent ? (isCancelled ? "text-red-400" : "text-[#C5A059]") : isCompleted ? "text-[#F5F5F7]" : "text-zinc-500"
                                    }`}>
                                        {step.name}
                                    </p>
                                    <span className="text-xs text-zinc-400">{step.desc}</span>
                                </div>
                                <p className="text-xs text-zinc-400">{step.subDesc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStepper;
