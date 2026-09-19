import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { chatBot } from "../../../Redux Toolkit/Customer/AiChatBotSlice";
import { Box, Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PromptMessage from "./PromptMessage";
import ResponseMessage from "./ResponseMessage";
import CloseIcon from '@mui/icons-material/Close';

interface ChatBotProps{
    handleClose:(e:any)=>void;
    productId?:number
}

const ChatBot = ({handleClose,productId}:ChatBotProps) => {
    const dispatch = useAppDispatch();
    const [prompt, setPrompt] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const {aiChatBot}=useAppSelector(store=>store);

    const handleGivePrompt = (e:any) => {
        e.stopPropagation();
        if (!prompt || !prompt.trim()) return;
        dispatch(chatBot({ prompt: { prompt }, productId, userId: null }));
        setPrompt("");
    };

    const handlePromptChange = (e: any) => {
        setPrompt(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleGivePrompt(e);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [aiChatBot.messages]);

    return (
        <div className="rounded-xl shadow-2xl">
            <div className="w-full lg:w-[40vw] h-[82vh] shadow-2xl bg-white text-slate-900 z-50 rounded-xl flex flex-col justify-between overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="h-[12%] min-h-[60px] flex justify-between items-center px-5 bg-slate-100 border-b border-slate-200 text-slate-900">
                    <div className="flex items-center gap-3">
                        <h1 className="logo text-2xl font-bold text-amber-800">Noir Bazar</h1>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                            AI Assistant
                        </span>
                    </div>
                    <div>
                        <IconButton 
                            onClick={handleClose}
                            sx={{ color: '#475569', '&:hover': { color: '#0f172a' } }}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>

                {/* Messages Body */}
                <div className="h-[78%] p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar bg-white text-slate-800">
                    <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl text-sm leading-relaxed">
                        👋 Welcome to <strong>Noir Bazar AI Assistant</strong>! You can{" "}
                        {productId
                            ? `query about this product (ID: ${productId}).`
                            : "query about products, sarees, deals, your cart, and order status."}
                    </div>
                    {aiChatBot.messages.map((item:any, index:number) =>
                        item.role === "user" ? (
                            <div ref={chatContainerRef} className="self-end" key={index}>
                                <PromptMessage message={item.message} index={index} />
                            </div>
                        ) : (
                            <div
                                ref={chatContainerRef}
                                className="self-start"
                                key={index}
                            >
                                <ResponseMessage message={item.message} />
                            </div>
                        )
                    )}
                    {aiChatBot.loading && (
                        <div className="self-start px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs italic">
                            Noir Bazar is thinking...
                        </div>
                    )}
                    {aiChatBot.error && (
                        <div className="self-center text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                            {aiChatBot.error}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="h-[10%] min-h-[55px] flex items-center bg-slate-100 border-t border-slate-200">
                    <input
                        onChange={handlePromptChange}
                        onKeyDown={handleKeyDown}
                        value={prompt}
                        type="text"
                        placeholder="Type your question (e.g. violet saree is available or not)..."
                        className="rounded-bl-xl pl-5 pr-3 h-full w-full bg-slate-100 text-slate-900 placeholder:text-slate-500 border-none outline-none text-sm font-medium focus:bg-white transition-colors"
                    />
                    <Button
                        sx={{ 
                            borderRadius: "0 0 0.75rem 0",
                            bgcolor: "#d97706",
                            color: "#ffffff",
                            "&:hover": { bgcolor: "#b45309" },
                            minWidth: "60px"
                        }}
                        className="h-full px-5"
                        onClick={handleGivePrompt}
                        variant="contained"
                    >
                        <SendIcon fontSize="small" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
