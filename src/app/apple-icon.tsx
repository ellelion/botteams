import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 40,
        }}
      >
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 5 V19 M3 5 H8.4 a2.5 2.5 0 0 1 0 5.6 H3 M3 10.6 H8.8 a2.5 2.5 0 0 1 0 6.4 H3 M13 5 H21 M17 5 V19"
            stroke="#ededed"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="5" r="1.5" fill="#54b9a6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
