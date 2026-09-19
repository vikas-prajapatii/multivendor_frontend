import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';

interface OTPInputProps {
    length: number;
    onChange: (otp: string) => void;
    error?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange, error = false }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));

    useEffect(() => {
        onChange(otp.join(''));
    }, [otp, onChange]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input field if there is a next one
            if (value && index < otp.length - 1) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div className='flex gap-3'>
            {otp.map((item, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={item}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    style={{
                        color: '#000000',
                        caretColor: '#000000',
                        backgroundColor: '#FFFFFF',
                    }}
                    className={`mt-1 block px-3 py-2 border ${
                        error ? 'border-red-500' : 'border-gray-300 focus:border-[#C5A059]'
                    } rounded-md shadow-sm focus:outline-none text-xl font-bold text-black h-11 w-11 flex justify-center items-center text-center`}
                />
            ))}
        </div>
    );
};

export default OTPInput;
