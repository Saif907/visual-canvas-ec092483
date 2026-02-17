import { X, RotateCcw, Maximize2, Sun, Moon, Monitor } from "lucide-react";
import { useTheme, COLOR_PRESETS, ThemeMode } from "@/contexts/ThemeContext";
import { Slider } from "@/components/ui/slider";

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
}

const modes: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function ThemeSettings({ open, onClose }: ThemeSettingsProps) {
  const { mode, setMode, preset, setPreset, fontSize, setFontSize } = useTheme();

  const handleReset = () => {
    setMode("dark");
    setPreset("Cyan");
    setFontSize(16);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] z-[70] bg-card shadow-sidebar transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-divider">
          <h2 className="text-lg font-semibold text-foreground">Themes</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {}}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Mode */}
          <div className="flex gap-2 border-b border-divider pb-5">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === m.value
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-foreground hover:bg-secondary"
                }`}
              >
                <m.icon size={16} />
                {m.label}
              </button>
            ))}
          </div>

          {/* Presets */}
          <div>
            <span className="inline-block px-2.5 py-1 rounded-md bg-secondary text-xs font-semibold text-foreground mb-4">
              Presets
            </span>
            <div className="grid grid-cols-3 gap-3">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPreset(p.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    preset === p.name
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-divider hover:border-text-secondary"
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    <div
                      className="w-5 h-10 rounded-l-md"
                      style={{ backgroundColor: p.preview }}
                    />
                    <div
                      className="w-5 h-10 rounded-r-md opacity-60"
                      style={{ backgroundColor: p.preview }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <span className="inline-block px-2.5 py-1 rounded-md bg-secondary text-xs font-semibold text-foreground mb-4">
              Font
            </span>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Font Size</span>
                <span className="px-2.5 py-1 rounded-lg bg-foreground text-background text-xs font-bold">
                  {fontSize}px
                </span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={([v]) => setFontSize(v)}
                min={12}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-text-secondary">
                <span>12px</span>
                <span>14px</span>
                <span>16px</span>
                <span>18px</span>
                <span>20px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
