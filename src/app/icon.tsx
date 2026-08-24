import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 112,
        }}
      >
        <span
          style={{
            color: "#f7f7f5",
            fontSize: 248,
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
