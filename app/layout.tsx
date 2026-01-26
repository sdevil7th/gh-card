import type { Metadata } from "next";
import {
  Orbitron,
  Inter,
  Roboto,
  GFS_Didot,
  EB_Garamond,
} from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const didot = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  variable: "--font-didot",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fancy GitHub Cards - Generate Beautiful GitHub Profile Cards",
    template: "%s | Fancy GitHub Cards",
  },
  description:
    "Generate beautiful, interactive, and shareable GitHub profile and repository cards. Create stunning social media cards for your GitHub projects with custom styling and neon effects.",
  keywords: [
    "GitHub",
    "GitHub Cards",
    "Profile Cards",
    "Repository Cards",
    "GitHub Stats",
    "Social Media Cards",
    "Open Graph",
    "Developer Tools",
    "GitHub Profile",
    "README Cards",
  ],
  authors: [{ name: "Sourav Das" }],
  creator: "Sourav Das",
  publisher: "Fancy GitHub Cards",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fancy GitHub Cards",
    title: "Fancy GitHub Cards - Generate Beautiful GitHub Profile Cards",
    description:
      "Generate beautiful, interactive, and shareable GitHub profile and repository cards with stunning neon effects.",
    images: [
      {
        url: "/api/og?username=github",
        width: 1200,
        height: 630,
        alt: "Fancy GitHub Cards Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fancy GitHub Cards - Generate Beautiful GitHub Profile Cards",
    description:
      "Generate beautiful, interactive, and shareable GitHub profile and repository cards with stunning neon effects.",
    images: ["/api/og?username=github"],
    creator: "@sdevil7th",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://fancy-gh-card.vercel.app",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${inter.variable} ${roboto.variable} ${didot.variable} ${garamond.variable} font-sans bg-slate-950 text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
