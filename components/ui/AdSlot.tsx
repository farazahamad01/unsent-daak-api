"use client";
import { useEffect } from "react";

type Placement = "top" | "mid-article" | "sidebar" | "footer" | "banner";

interface Props {
  placement: Placement;
  className?: string;
}

const sizeMap: Record<Placement, string> = {
  top: "h-24 w-full",
  "mid-article": "h-28 w-full",
  sidebar: "h-64 w-full",
  footer: "h-24 w-full",
  banner: "h-20 w-full",
};

export default function AdSlot({ placement, className = "" }: Props) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div
      className={`${sizeMap[placement]} ${className} flex items-center justify-center 
                  bg-beige/40 border border-parchment/50 my-8`}
    >
      {/* 
        Replace this div with your actual AdSense ins tag:
        <ins 
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
      <span className="text-parchment text-xs font-sans uppercase tracking-widest">
        Advertisement
      </span>
    </div>
  );
}
