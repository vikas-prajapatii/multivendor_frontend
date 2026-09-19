import { Box, LinearProgress, Rating } from '@mui/material';
import React from 'react';

const RatingCard = ({ totalReview }: any) => {
    const ratingBreakdown = [
        { label: "Excellent", value: 65, count: "12,450", color: "#10B981" },
        { label: "Very Good", value: 20, count: "4,210", color: "#C5A059" },
        { label: "Good", value: 10, count: "1,890", color: "#F59E0B" },
        { label: "Average", value: 3, count: "520", color: "#EAB308" },
        { label: "Poor", value: 2, count: "189", color: "#EF4444" },
    ];

    return (
        <div className="border border-white/10 p-6 rounded-2xl bg-[#121217] text-[#F5F5F7] shadow-xl">
            <div className="flex items-center space-x-4 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-[#F5F5F7]">4.6</span>
                    <Rating
                        name="read-only"
                        value={4.6}
                        precision={0.1}
                        readOnly
                        sx={{ color: "#C5A059" }}
                    />
                </div>
                <p className="text-sm text-zinc-400">Based on {totalReview || 358} reviews</p>
            </div>

            <div className="space-y-3 pt-6">
                {ratingBreakdown.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm">
                        <span className="w-20 font-medium text-zinc-300 text-xs">{row.label}</span>
                        <div className="flex-1">
                            <LinearProgress
                                variant="determinate"
                                value={row.value}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.08)",
                                    borderRadius: 4,
                                    height: 8,
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: row.color,
                                        borderRadius: 4,
                                    },
                                }}
                            />
                        </div>
                        <span className="w-16 text-right text-xs text-zinc-500">{row.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingCard;