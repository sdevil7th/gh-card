"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { Input } from "@/app/components/ui/Input";

interface DownloadActionsProps {
  username: string;
}

export function DownloadActions({ username }: DownloadActionsProps) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [size, setSize] = useState<"large" | "small">("large");

  // Wait for client to get window location
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const imageUrl = `${origin}/api/og?username=${username}&format=${format}&size=${size}`;
  const repoUrl = `https://github.com/${username}`; // Link to profile for now

  const formats = {
    imageUrl: imageUrl,
    html: `<a href="${repoUrl}"><img src="${imageUrl}" alt="${username}'s GitHub Card"></a>`,
    markdown: `[![${username}'s GitHub Card](${imageUrl})](${repoUrl})`,
    scrapbox: `[${imageUrl} ${repoUrl}]`,
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}-github-card-${size}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      {/* Controls Container */}
      <GlassPanel
        intensity="low"
        className="flex flex-col gap-4 p-4 rounded-2xl w-full items-center"
      >
        {/* Size Selector */}
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Card Size
          </span>
          <div className="flex bg-black/20 p-1 rounded-lg w-full max-w-md">
            <button
              onClick={() => setSize("large")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                size === "large"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Social Media{" "}
              <span className="text-xs opacity-60 ml-1 hidden sm:inline">
                (1200x630)
              </span>
            </button>
            <button
              onClick={() => setSize("small")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                size === "small"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              README{" "}
              <span className="text-xs opacity-60 ml-1 hidden sm:inline">
                (500x280)
              </span>
            </button>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Format
          </span>
          <div className="flex bg-black/20 p-1 rounded-lg w-full max-w-xs">
            <button
              onClick={() => setFormat("png")}
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-all ${
                format === "png"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setFormat("svg")}
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-all ${
                format === "svg"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              SVG
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Primary Actions */}
      <div className="flex gap-4">
        <Button
          onClick={downloadImage}
          variant="primary"
          size="lg"
          className="shadow-indigo-500/20 shadow-lg min-w-[200px]"
        >
          Download {format.toUpperCase()}
        </Button>
        <Button
          onClick={() => window.open(imageUrl, "_blank")}
          variant="outline"
          size="lg"
        >
          Open Preview
        </Button>
      </div>

      {/* Export Options */}
      <GlassPanel intensity="medium" className="w-full p-8 flex flex-col gap-6">
        <div className="text-center mb-2">
          <h3 className="text-xl font-semibold text-white/90">
            Export Options
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Copy code for {size === "large" ? "Social Media" : "GitHub README"}
          </p>
        </div>

        <ExportField
          label="Image URL"
          value={formats.imageUrl}
          onCopy={() => copyToClipboard(formats.imageUrl, "url")}
          copied={copied === "url"}
        />

        <ExportField
          label="HTML"
          value={formats.html}
          onCopy={() => copyToClipboard(formats.html, "html")}
          copied={copied === "html"}
        />

        <ExportField
          label="Markdown"
          value={formats.markdown}
          onCopy={() => copyToClipboard(formats.markdown, "markdown")}
          copied={copied === "markdown"}
        />

        <ExportField
          label="Scrapbox"
          value={formats.scrapbox}
          onCopy={() => copyToClipboard(formats.scrapbox, "scrapbox")}
          copied={copied === "scrapbox"}
        />
      </GlassPanel>
    </div>
  );
}

function ExportField({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400 ml-1">{label}</label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={value}
          className="font-mono text-sm bg-black/40 border-white/5 text-slate-300 selection:bg-indigo-500/40"
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          onClick={onCopy}
          variant={copied ? "primary" : "secondary"}
          className="min-w-[100px]"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
