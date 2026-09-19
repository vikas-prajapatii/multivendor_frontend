import React from "react";

interface ResponseMessageProps {
  message: string;
}

const ResponseMessage = ({ message }: ResponseMessageProps) => {
  return (
    <div className="px-4 py-2.5 bg-slate-100 text-slate-900 border border-slate-200 rounded-2xl rounded-tl-none max-w-[85%] text-sm shadow-sm break-words leading-relaxed font-normal whitespace-pre-line">
      {message}
    </div>
  );
};

export default ResponseMessage;
