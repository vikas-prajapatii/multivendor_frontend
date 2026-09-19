import React from 'react';

interface PromptMessageProps {
  message: string;
  index: number;
}

const PromptMessage = ({ message }: PromptMessageProps) => {
  return (
    <div className="px-4 py-2.5 bg-amber-600 text-white font-medium rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-sm break-words">
      {message}
    </div>
  );
};

export default PromptMessage;