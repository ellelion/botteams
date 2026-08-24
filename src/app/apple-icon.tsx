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
        <div
          style={{
            display: "flex",
            fontSize: 118,
            fontWeight: 650,
            color: "#ededed",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          B
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: 18,
            height: 18,
            borderRadius: 18,
            background: "#54b9a6",
            top: 48,
            right: 46,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
