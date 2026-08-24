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
          background: "#1a1a18",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            color: "#f7f7f5",
            fontSize: 88,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          BT
        </span>
      </div>
    ),
    { ...size },
  );
}
