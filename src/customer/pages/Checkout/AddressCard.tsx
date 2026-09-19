import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import type { Address } from '../../../types/userTypes';

interface AddressCardProps {
    value: number;
    selectedValue: number;
    handleChange: (e: any) => void;
    item: Address
}
const AddressCard: React.FC<AddressCardProps> = ({ value, selectedValue, handleChange, item }) => {


    const isSelected = value === selectedValue;

    return (
        <div 
            onClick={() => handleChange({ target: { value } })}
            className={`p-5 rounded-2xl flex gap-3 cursor-pointer transition-all duration-300 border ${
                isSelected 
                    ? "bg-[#16161D] border-[#C5A059] shadow-lg shadow-[#C5A059]/10" 
                    : "bg-[#121217] border-white/10 hover:border-white/20"
            }`}
        >
            <div className="pt-1">
                <Radio
                    checked={isSelected}
                    onChange={handleChange}
                    value={value}
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'Select Address' }}
                    sx={{
                        color: "rgba(255,255,255,0.4)",
                        '&.Mui-checked': {
                            color: '#C5A059',
                        },
                    }}
                />
            </div>

            <div className='space-y-2 pt-1 text-[#F5F5F7]'>
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-base text-[#F5F5F7]">{item.name}</h1>
                    {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059]">
                            Selected
                        </span>
                    )}
                </div>
                <p className='text-zinc-300 text-sm leading-relaxed max-w-[340px]'>
                    {item.address}, {item.locality}, {item.city}, {item.state} - {item.pinCode}
                </p>
                <p className='text-xs text-zinc-400'>
                    <strong className="text-zinc-300">Mobile: </strong> {item.mobile}
                </p>
            </div>
        </div>
    )
}

export default AddressCard