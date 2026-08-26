import { ImageResponse } from "next/og";
import type { Team } from "@/lib/teams";

export const recipeOgSize = { width: 1200, height: 630 } as const;

export function recipeOgImage(recipe: Team): ImageResponse {
  const kind = recipe.kind === "bot" ? "BOT" : "BOT TEAM";
  const details = recipe.kind === "bot"
    ? `${recipe.connectors.length} connector${recipe.connectors.length === 1 ? "" : "s"}`
    : `${recipe.bots} bots · ${recipe.rooms.length} group chat${recipe.rooms.length === 1 ? "" : "s"}`;
  const titleSize = recipe.name.length > 38 ? 54 : 66;

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
          color: "#f5f7f7",
          background: "linear-gradient(145deg, #080b0b 0%, #101615 58%, #0a2b26 100%)",
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
                border: "2px solid #7ce7d4",
                borderRadius: 14,
                color: "#7ce7d4",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              BT
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>botteams.ai</div>
              <div style={{ color: "#8a9895", fontSize: 18 }}>Grok Bot teams directory</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 18px",
              border: "1px solid #315e56",
              borderRadius: 999,
              color: "#7ce7d4",
              background: "#102823",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            {kind}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1030 }}>
          <div style={{ color: "#7ce7d4", fontSize: 20, fontWeight: 600, marginBottom: 18 }}>
            {recipe.section}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.045em" }}>
            {recipe.name}
          </div>
          <div style={{ display: "flex", marginTop: 26, color: "#bdc8c6", fontSize: 31, lineHeight: 1.3 }}>
            {recipe.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#82908d", fontSize: 18 }}>
          <div style={{ display: "flex" }}>{details}</div>
          <div style={{ display: "flex", color: "#7ce7d4" }}>Open the recipe →</div>
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
