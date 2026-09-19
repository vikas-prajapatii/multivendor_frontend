import React from 'react';

interface OTPFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  helperText?: string;
}

const OTPField: React.FC<OTPFieldProps> = ({ label, error, helperText }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className='flex gap-3'>
      {[1,1,1,1,1,1].map((item, index)=><input
        key={index}
        type="text"
        style={{
          color: '#000000',
          caretColor: '#000000',
          backgroundColor: '#FFFFFF',
        }}
        className={`mt-1 block px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300 focus:border-[#C5A059]'
        } rounded-md shadow-sm focus:outline-none text-xl font-bold text-black h-14 w-14 flex justify-center items-center text-center`}
      />)}
      </div>
      {helperText && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-400'}`}>{helperText}</p>
      )}
    </div>
  );
};

export default OTPField;
