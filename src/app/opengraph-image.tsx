import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ledgerOg as ledger } from "@/lib/ledger-theme";

export const alt = "botteams.ai: company teams for Grok Bot. Copy one prompt and paste it into Grok Bot.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const geist = await readFile(
    join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: ledger.paper,
          color: ledger.ink,
          padding: "64px 72px",
          fontFamily: "Geist Sans",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.32em",
            color: ledger.oxblood,
          }}
        >
          COMPANY TEAMS FOR GROK BOT
        </div>
        <div style={{ display: "flex", fontSize: 148, marginTop: 20 }}>
          <span>botteams.ai</span>
          <span style={{ color: ledger.oxblood }}>.</span>
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.5,
            color: ledger.inkSoft,
            maxWidth: 900,
            marginTop: 12,
          }}
        >
          Copy one prompt and paste it into Grok Bot.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist Sans", data: geist, style: "normal", weight: 400 }],
    },
  );
}
