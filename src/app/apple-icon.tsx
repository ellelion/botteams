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
            d="M3 5 V19 M3 5 H6.5 a3.5 3.5 0 0 1 0 7 H3 M6.5 12 a3.5 3.5 0 0 1 0 7 H3 M13.6 5 H21.4 M17.5 5 V19"
            stroke="#ededed"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21.4" cy="5" r="1.5" fill="#54b9a6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
