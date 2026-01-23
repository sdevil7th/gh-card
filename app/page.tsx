"use client";

import { useState } from "react";
import { ProfileUrlInput } from "./components/generator/UsernameInput";
import { CardPreview } from "./components/card/CardPreview";
import { DownloadActions } from "./components/generator/DownloadActions";
import { GradientBlob } from "./components/effects/GradientBlob";
import { CardData } from "@/lib/github/types";
import { GlassPanel } from "./components/ui/GlassPanel";

const DEMO_USER_URL = "https://github.com/sdevil7th";

export default function Home() {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (username: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/github?username=${username}`);
      if (!res.ok)
        throw new Error(
          "Failed to fetch user data. Check the username or API limits.",
        );
      const userData = await res.json();
      if (userData.error) throw new Error(userData.error);
      setData(userData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center p-6 md:p-24 overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <GradientBlob />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Fancy GitHub Cards
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Generate beautiful, interactive, and shareable profile cards from
            your GitHub Profile or Repository URL.
          </p>
        </div>

        <ProfileUrlInput
          onSubmit={handleSubmit}
          isLoading={loading}
          defaultValue={DEMO_USER_URL}
        />

        {error && (
          <GlassPanel className="p-4 text-red-300 border-red-500/20 bg-red-500/10">
            Error: {error}
          </GlassPanel>
        )}

        {data && (
          <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-500">
            <CardPreview data={data} />
            <DownloadActions
              username={
                data.type === "repo"
                  ? `${data.owner}/${data.name}`
                  : data.username
              }
            />
          </div>
        )}
      </div>

      <footer className="mt-auto pt-20 text-slate-600 text-sm">
        Built by Sourav Das
      </footer>
    </main>
  );
}
