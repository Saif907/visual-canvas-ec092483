import { AlertTriangle, X } from "lucide-react";
import { Strategy } from "@/types/strategy";

interface DeleteStrategyDialogProps {
  open: boolean;
  strategy: Strategy | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteStrategyDialog({ open, strategy, onClose, onConfirm }: DeleteStrategyDialogProps) {
  if (!open || !strategy) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md card-boundary mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-loss/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-loss" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Delete Strategy</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-1">
          Are you sure you want to delete <span className="font-semibold text-foreground">{strategy.name}</span>?
        </p>
        <p className="text-xs text-muted-foreground mb-6">This action cannot be undone. All linked trade associations will be removed.</p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-xl bg-loss text-white text-sm font-semibold hover:bg-loss/90 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
