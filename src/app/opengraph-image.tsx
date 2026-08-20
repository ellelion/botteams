import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ledgerOg as ledger } from "@/lib/ledger-theme";
import { site } from "@/lib/site";

export const alt = `${site.name}: you build, our AI agents do the rest, from idea validation to distribution on autopilot`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fraunces = await readFile(
    join(process.cwd(), "src/assets/fraunces-latin-400.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ledger.paper,
          color: ledger.ink,
          padding: "56px 72px",
          fontFamily: "Fraunces",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${ledger.hairline}`,
            paddingBottom: 24,
            fontSize: 22,
            letterSpacing: "0.3em",
            color: ledger.inkMuted,
          }}
        >
          <span>ELLELION LLC</span>
          <span>EST. 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.32em",
              color: ledger.oxblood,
            }}
          >
            COMPANY PACKS FOR GROK BOT
          </div>
          <div style={{ display: "flex", fontSize: 148, marginTop: 12 }}>
            <span>Grok Bot Teams</span>
            <span style={{ color: ledger.oxblood }}>.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.5,
              color: ledger.inkSoft,
              maxWidth: 900,
              marginTop: 8,
            }}
          >
            Install a Grok Bot team, not a bot. Copy one prompt
            and paste it into Grok Bot.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${ledger.hairline}`,
            paddingTop: 24,
            fontSize: 22,
            letterSpacing: "0.24em",
            color: ledger.inkFaint,
          }}
        >
          <span>GROKBOTTEAMS.AI</span>
          <span>WYOMING, USA</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, style: "normal", weight: 400 }],
    },
  );
}
