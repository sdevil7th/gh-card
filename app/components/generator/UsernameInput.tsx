"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

interface ProfileUrlInputProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
  defaultValue?: string;
}

export function ProfileUrlInput({
  onSubmit,
  isLoading,
  defaultValue = "",
}: ProfileUrlInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const extractGithubPath = (url: string): string | null => {
    // Handle raw input (username or owner/repo)
    if (!url.includes("github.com")) {
      const parts = url.split("/").filter(Boolean);
      if (parts.length === 1) return parts[0];
      if (parts.length === 2) return `${parts[0]}/${parts[1]}`;
    }

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (urlObj.hostname !== "github.com") return null;

      const pathParts = urlObj.pathname.split("/").filter(Boolean);

      // /username
      if (pathParts.length === 1) return pathParts[0];

      // /owner/repo
      if (pathParts.length === 2) return `${pathParts[0]}/${pathParts[1]}`;

      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanInput = value.trim();
    if (!cleanInput) return;

    const username = extractGithubPath(cleanInput);

    if (!username) {
      setError(
        "Please enter a valid GitHub URL (e.g., github.com/username or github.com/owner/repo)",
      );
      return;
    }

    onSubmit(username);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-md mx-auto relative z-10 gap-2"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="https://github.com/username"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          className={`bg-white/5 border-white/10 text-lg py-6 backdrop-blur-md focus:ring-indigo-500/50 ${error ? "border-red-500/50 focus:ring-red-500/50" : ""}`}
          autoFocus
        />
        <Button
          type="submit"
          disabled={isLoading || !value}
          size="lg"
          variant="primary"
          className="min-w-[120px]"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-red-400 text-sm ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </form>
  );
}
