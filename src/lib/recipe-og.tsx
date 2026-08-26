/* eslint-disable @next/next/no-img-element -- Satori ImageResponse requires plain image elements. */
import { ImageResponse } from "next/og";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { resolveConnectors } from "@/lib/connectors";
import type { Team } from "@/lib/teams";

export const recipeOgSize = { width: 1200, height: 630 } as const;

const rawConnectorAssetBase = "https://raw.githubusercontent.com/ellelion/botteams/main/public/";

const palette = {
  background: "#000000",
  surface: "#000000",
  accent: "#ffffff",
  accentSoft: "#ffffff",
  ink: "#ffffff",
  paper: "#ffffff",
} as const;

async function connectorDataUri(src: string, assetOrigin: string): Promise<string | null> {
  const relativeSrc = src.replace(/^\/+/, "");
  const candidates = [
    new URL(relativeSrc, `${assetOrigin.replace(/\/+$/, "")}/`),
    new URL(relativeSrc, rawConnectorAssetBase),
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 86_400 },
        signal: AbortSignal.timeout(4_000),
      });
      if (!response.ok) continue;
      const mediaType = response.headers.get("content-type")?.split(";", 1)[0] || "application/octet-stream";
      const bytes = Buffer.from(await response.arrayBuffer());
      return `data:${mediaType};base64,${bytes.toString("base64")}`;
    } catch {
      /* Try the repository asset when the production origin cannot be fetched. */
    }
  }

  return null;
}

export async function recipeOgImage(recipe: Team, assetOrigin: string): Promise<ImageResponse> {
  const kind = recipe.kind === "bot" ? "GROK BOT" : "GROK BOT TEAM";
  const details = recipe.kind === "bot"
    ? `${recipe.connectors.length} connector${recipe.connectors.length === 1 ? "" : "s"}`
    : `${recipe.bots} bots · ${recipe.rooms.length} group chat${recipe.rooms.length === 1 ? "" : "s"}`;
  const titleSize = recipe.name.length > 38 ? 54 : 66;
  const connectors = resolveConnectors(recipe.connectors);
  const connectorImages = await Promise.all(
    connectors.map((connector) => connector.src ? connectorDataUri(connector.src, assetOrigin) : null),
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
          padding: "64px 72px",
          color: palette.ink,
          background: palette.background,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${palette.accent}`,
                borderRadius: 14,
                color: palette.accent,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              BT
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>botteams.ai</div>
              <div style={{ color: palette.accentSoft, fontSize: 18 }}>Grok Bot teams directory</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                border: `1px solid ${palette.accent}`,
                borderRadius: 999,
                color: palette.accent,
                background: palette.surface,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              {kind}
            </div>
            <GrokBotMark
              size={82}
              frontFacing
              headColor={palette.accent}
              eyeColor={palette.background}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1060 }}>
          <div style={{ color: palette.accent, fontSize: 20, fontWeight: 600, marginBottom: 18 }}>
            {recipe.section}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.035em" }}>
            {recipe.name}
          </div>
          <div style={{ display: "flex", marginTop: 24, color: palette.accentSoft, fontSize: 30, lineHeight: 1.3 }}>
            {recipe.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {connectors.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", color: palette.accentSoft, fontSize: 17, fontWeight: 600 }}>
                CONNECTORS
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {connectors.map((connector, index) => (
                  <div
                    key={connector.slug || connector.name}
                    style={{
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      background: connectorImages[index] ? palette.paper : palette.surface,
                      border: connectorImages[index] ? "none" : `1px solid ${palette.accent}`,
                      color: palette.accent,
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {connectorImages[index] ? (
                      <img
                        src={connectorImages[index]}
                        alt=""
                        width={28}
                        height={28}
                        style={{ objectFit: "contain" }}
                      />
                    ) : connector.name.slice(0, 1).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ display: "flex" }} />}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <div style={{ display: "flex", color: palette.ink, fontSize: 18, fontWeight: 600 }}>{details}</div>
            <div style={{ display: "flex", color: palette.accent, fontSize: 18 }}>Open the recipe →</div>
          </div>
        </div>
      </div>
    ),
    {
      ...recipeOgSize,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
