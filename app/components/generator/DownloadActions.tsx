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

  // Wait for client to get window location
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const imageUrl = `${origin}/api/og?username=${username}&format=${format}`;
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
      link.download = `${username}-github-card.${format}`;
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
      {/* Format Selector */}
      <GlassPanel intensity="low" className="flex p-1 gap-1 rounded-xl">
        <button
          onClick={() => setFormat("png")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            format === "png"
              ? "bg-indigo-500 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          PNG
        </button>
        <button
          onClick={() => setFormat("svg")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            format === "svg"
              ? "bg-indigo-500 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          SVG
        </button>
      </GlassPanel>

      {/* Primary Actions */}
      <div className="flex gap-4">
        <Button
          onClick={downloadImage}
          variant="primary"
          size="lg"
          className="shadow-indigo-500/20 shadow-lg"
        >
          Download {format.toUpperCase()}
        </Button>
        <Button
          onClick={() => window.open(imageUrl, "_blank")}
          variant="outline"
          size="lg"
        >
          Open in New Tab
        </Button>
      </div>

      {/* Export Options */}
      <GlassPanel intensity="medium" className="w-full p-8 flex flex-col gap-6">
        <h3 className="text-xl font-semibold text-white/90 text-center mb-2">
          Export Options ({format.toUpperCase()})
        </h3>

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
