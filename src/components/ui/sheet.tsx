import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./index";

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Sheet = ({ isOpen, onClose, title, children }: SheetProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    return (
        <div 
            className={cn(
                "fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-end transition-opacity duration-300 mt-0",
                isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            )}
            style={{marginTop:'0px'}}
        >
            {/* Backdrop */}
            <div 
                className="absolute top-0 right-0 bottom-0 left-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Panel */}
            <div 
                className={cn(
                    "relative w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform",
                    "h-full overflow-hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-500 hover:text-slate-900">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
