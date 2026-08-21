/*
 * Grok Bot connector catalog.
 *
 * xAI publishes no machine-readable connector list, so this is a dated
 * snapshot and not a live feed. Treat it the way the rest of this shelf
 * treats a claim: sourced, dated, and re-checkable.
 *
 * Two tiers, because xAI documents two.
 *
 * docs.x.ai/grok/connectors names seven built-in connectors and nothing
 * else. For the rest it says only that there is "a catalog of
 * pre-configured OAuth connectors" and sends you to the in-app picker at
 * grok.com/connectors. No count, no list. So BUILT_IN below is the part
 * xAI publishes, and everything else is a community snapshot of that
 * picker. Never present the second tier as though xAI published it.
 *
 * Snapshot source: https://github.com/rdmgator12/awesome-grok-connectors
 *   community directory, read 2026-08-21, stating 31 connectors as of
 *   2026-08-12.
 * Cross-check: https://x.ai/news/grok-connectors (xAI, 2026-05-06), which
 *   names Google Workspace, Outlook, OneDrive, SharePoint, Notion, GitHub,
 *   Linear and Bring Your Own MCP.
 *
 * Slack is deliberately absent. It shipped early and was pulled from the
 * catalog before 2026-08-12. It stays in RETIRED so an old team file keeps
 * resolving, but nothing should present it as available.
 *
 * Re-check CATALOG_CHECKED_ON before repeating "every connector" anywhere.
 *
 * Brand marks under /public/connectors are the vendor's own artwork:
 * simple-icons (CC0 1.0), gilbarbara/logos (CC0), svgl (MIT), Google's
 * gstatic product logos, Wikimedia, and the marketplace's own icons.
 * Google marks are the full-colour product logos rather than the
 * monochrome simple-icons versions, because that is what the products
 * actually use. See ATTRIBUTION.md for the source of each.
 *
 * Nothing here is drawn by us. A connector with no official mark omits
 * `file` and renders a letter chip instead, which is honest in a way an
 * invented logo is not.
 */

export const CATALOG_SOURCE = "https://github.com/rdmgator12/awesome-grok-connectors";
export const XAI_CONNECTOR_DOCS = "https://docs.x.ai/grok/connectors";
export const CATALOG_CHECKED_ON = "2026-08-21";
export const CATALOG_AS_OF = "2026-08-12";

export type ConnectorCategory =
  | "Featured"
  | "Advertising"
  | "Analytics"
  | "Developer"
  | "Finance"
  | "Productivity"
  | "Sales"
  | "Business and enterprise"
  | "Cursor Marketplace"
  | "Community tools";

export type CatalogEntry = {
  name: string;
  slug: string;
  category: ConnectorCategory;
  /* Filename under /public/connectors. Omitted when the vendor has no
     official mark to use, and the row falls back to a letter chip. We do
     not draw one ourselves to fill the gap. */
  file?: string;
};

export const CONNECTOR_CATALOG: CatalogEntry[] = [
  { name: "Box", slug: "box", category: "Featured", file: "box.svg" },
  { name: "Canva", slug: "canva", category: "Featured", file: "canva.svg" },
  { name: "GitHub", slug: "github", category: "Featured", file: "github.svg" },
  { name: "Gmail", slug: "gmail", category: "Featured", file: "gmail.svg" },
  { name: "Google Calendar", slug: "google-calendar", category: "Featured", file: "google-calendar.svg" },
  { name: "Google Drive", slug: "google-drive", category: "Featured", file: "google-drive.svg" },
  { name: "Notion", slug: "notion", category: "Featured", file: "notion.svg" },
  { name: "Stripe", slug: "stripe", category: "Featured", file: "stripe.svg" },
  { name: "Vercel", slug: "vercel", category: "Featured", file: "vercel.svg" },
  { name: "Wix", slug: "wix", category: "Featured", file: "wix.svg" },
  { name: "X Ads", slug: "x-ads", category: "Advertising", file: "x-ads.svg" },
  { name: "Google Cloud BigQuery", slug: "google-cloud-bigquery", category: "Analytics", file: "google-cloud-bigquery.svg" },
  { name: "Excalidraw", slug: "excalidraw", category: "Developer", file: "excalidraw.svg" },
  { name: "Mixpanel", slug: "mixpanel", category: "Developer", file: "mixpanel.svg" },
  { name: "eToro", slug: "etoro", category: "Finance", file: "etoro.png" },
  { name: "Interactive Brokers", slug: "interactive-brokers", category: "Finance", file: "interactive-brokers.png" },
  { name: "S&P Global", slug: "s-and-p-global", category: "Finance", file: "s-and-p-global.png" },
  { name: "Webull", slug: "webull", category: "Finance", file: "webull.png" },
  { name: "Calendly", slug: "calendly", category: "Productivity", file: "calendly.svg" },
  { name: "Figma", slug: "figma", category: "Productivity", file: "figma.svg" },
  { name: "Gamma", slug: "gamma", category: "Productivity", file: "gamma.png" },
  { name: "HyperFrames by HeyGen", slug: "hyperframes", category: "Productivity", file: "hyperframes.png" },
  { name: "Linear", slug: "linear", category: "Productivity", file: "linear.svg" },
  { name: "Microsoft Teams", slug: "microsoft-teams", category: "Productivity", file: "microsoft-teams.svg" },
  { name: "Outlook", slug: "outlook", category: "Productivity", file: "outlook.svg" },
  { name: "Outlook Calendar", slug: "outlook-calendar", category: "Productivity", file: "outlook-calendar.png" },
  { name: "Slack", slug: "slack", category: "Productivity", file: "slack.svg" },
  { name: "HubSpot", slug: "hubspot", category: "Sales", file: "hubspot.svg" },
  { name: "Meltwater", slug: "meltwater", category: "Sales", file: "meltwater.png" },
  { name: "OneDrive", slug: "onedrive", category: "Business and enterprise", file: "onedrive.svg" },
  { name: "Salesforce", slug: "salesforce", category: "Business and enterprise", file: "salesforce.svg" },
  { name: "SharePoint", slug: "sharepoint", category: "Business and enterprise", file: "sharepoint.svg" },
  { name: "1inch", slug: "1inch", category: "Cursor Marketplace", file: "1inch.png" },
  { name: "1Password", slug: "1password", category: "Cursor Marketplace", file: "1password.svg" },
  { name: "Adobe Developer App Builder", slug: "adobe-developer-app-builder", category: "Cursor Marketplace", file: "adobe-developer-app-builder.png" },
  { name: "Agent Compatibility", slug: "agent-compatibility", category: "Cursor Marketplace", file: "agent-compatibility.png" },
  { name: "AgentMail", slug: "agentmail", category: "Cursor Marketplace", file: "agentmail.png" },
  { name: "Aikido", slug: "aikido", category: "Cursor Marketplace", file: "aikido.png" },
  { name: "Airtable", slug: "airtable", category: "Cursor Marketplace", file: "airtable.svg" },
  { name: "Airwallex", slug: "airwallex", category: "Cursor Marketplace", file: "airwallex.png" },
  { name: "Airwallex AgentOS", slug: "airwallex-agentos", category: "Cursor Marketplace", file: "airwallex-agentos.png" },
  { name: "Airwallex Developer", slug: "airwallex-developer", category: "Cursor Marketplace", file: "airwallex-developer.png" },
  { name: "Aleph", slug: "aleph", category: "Cursor Marketplace", file: "aleph.png" },
  { name: "Amazon Location Service", slug: "amazon-location-service", category: "Cursor Marketplace", file: "amazon-location-service.svg" },
  { name: "AMD", slug: "amd", category: "Cursor Marketplace", file: "amd.svg" },
  { name: "Amplemarket", slug: "amplemarket", category: "Cursor Marketplace", file: "amplemarket.png" },
  { name: "Amplitude", slug: "amplitude", category: "Cursor Marketplace", file: "amplitude.png" },
  { name: "Antimetal", slug: "antimetal", category: "Cursor Marketplace", file: "antimetal.png" },
  { name: "Apify", slug: "apify", category: "Cursor Marketplace", file: "apify.png" },
  { name: "Apollo.io", slug: "apollo-io", category: "Cursor Marketplace", file: "apollo-io.png" },
  { name: "Appwrite", slug: "appwrite", category: "Cursor Marketplace", file: "appwrite.svg" },
  { name: "Arize", slug: "arize", category: "Cursor Marketplace", file: "arize.png" },
  { name: "Asana", slug: "asana", category: "Cursor Marketplace", file: "asana.svg" },
  { name: "Ashby", slug: "ashby", category: "Cursor Marketplace", file: "ashby.png" },
  { name: "Astronomer", slug: "astronomer", category: "Cursor Marketplace", file: "astronomer.png" },
  { name: "Atlan", slug: "atlan", category: "Cursor Marketplace", file: "atlan.png" },
  { name: "Atlassian", slug: "atlassian", category: "Cursor Marketplace", file: "atlassian.svg" },
  { name: "Atlassian Forge", slug: "atlassian-forge", category: "Cursor Marketplace", file: "atlassian-forge.svg" },
  { name: "Atlassian Teamwork Graph", slug: "atlassian-teamwork-graph", category: "Cursor Marketplace", file: "atlassian-teamwork-graph.svg" },
  { name: "AtScale", slug: "atscale", category: "Cursor Marketplace", file: "atscale.png" },
  { name: "Auth0", slug: "auth0", category: "Cursor Marketplace", file: "auth0.svg" },
  { name: "AWS Agents", slug: "aws-agents", category: "Cursor Marketplace", file: "aws-agents.svg" },
  { name: "AWS Amplify", slug: "aws-amplify", category: "Cursor Marketplace", file: "aws-amplify.svg" },
  { name: "AWS Core", slug: "aws-core", category: "Cursor Marketplace", file: "aws-core.svg" },
  { name: "AWS Data Analytics", slug: "aws-data-analytics", category: "Cursor Marketplace", file: "aws-data-analytics.svg" },
  { name: "AWS Databases", slug: "aws-databases", category: "Cursor Marketplace", file: "aws-databases.svg" },
  { name: "AWS Deployments", slug: "aws-deployments", category: "Cursor Marketplace", file: "aws-deployments.svg" },
  { name: "AWS SageMaker", slug: "aws-sagemaker", category: "Cursor Marketplace", file: "aws-sagemaker.svg" },
  { name: "AWS Serverless", slug: "aws-serverless", category: "Cursor Marketplace", file: "aws-serverless.svg" },
  { name: "Azure", slug: "azure", category: "Cursor Marketplace", file: "azure.png" },
  { name: "Azure Cosmos DB", slug: "azure-cosmos-db", category: "Cursor Marketplace", file: "azure-cosmos-db.png" },
  { name: "Braintrust", slug: "braintrust", category: "Cursor Marketplace", file: "braintrust.svg" },
  { name: "Bright Data", slug: "bright-data", category: "Cursor Marketplace", file: "bright-data.png" },
  { name: "Browser Use", slug: "browser-use", category: "Cursor Marketplace", file: "browser-use.png" },
  { name: "Browserbase", slug: "browserbase", category: "Cursor Marketplace", file: "browserbase.svg" },
  { name: "Browserstack", slug: "browserstack", category: "Cursor Marketplace", file: "browserstack.png" },
  { name: "Buildkite", slug: "buildkite", category: "Cursor Marketplace", file: "buildkite.svg" },
  { name: "Chainguard", slug: "chainguard", category: "Cursor Marketplace", file: "chainguard.svg" },
  { name: "Chargebee", slug: "chargebee", category: "Cursor Marketplace", file: "chargebee.png" },
  { name: "ChatPRD", slug: "chatprd", category: "Cursor Marketplace", file: "chatprd.png" },
  { name: "Checkmarx", slug: "checkmarx", category: "Cursor Marketplace", file: "checkmarx.svg" },
  { name: "Circle", slug: "circle", category: "Cursor Marketplace", file: "circle.svg" },
  { name: "Circleback", slug: "circleback", category: "Cursor Marketplace", file: "circleback.png" },
  { name: "Cisco ThousandEyes", slug: "cisco-thousandeyes", category: "Cursor Marketplace", file: "cisco-thousandeyes.svg" },
  { name: "Clay", slug: "clay", category: "Cursor Marketplace", file: "clay.png" },
  { name: "Clerk", slug: "clerk", category: "Cursor Marketplace", file: "clerk.svg" },
  { name: "ClickHouse", slug: "clickhouse", category: "Cursor Marketplace", file: "clickhouse.svg" },
  { name: "ClickUp", slug: "clickup", category: "Cursor Marketplace", file: "clickup.svg" },
  { name: "Cloudflare", slug: "cloudflare", category: "Cursor Marketplace", file: "cloudflare.svg" },
  { name: "Cloudinary", slug: "cloudinary", category: "Cursor Marketplace", file: "cloudinary.svg" },
  { name: "CockroachDB", slug: "cockroachdb", category: "Cursor Marketplace", file: "cockroachdb.svg" },
  { name: "CodeRabbit", slug: "coderabbit", category: "Cursor Marketplace", file: "coderabbit.svg" },
  { name: "Composio", slug: "composio", category: "Cursor Marketplace", file: "composio.png" },
  { name: "Compound Engineering", slug: "compound-engineering", category: "Cursor Marketplace", file: "compound-engineering.png" },
  { name: "Confidence by Spotify", slug: "confidence-by-spotify", category: "Cursor Marketplace", file: "confidence-by-spotify.svg" },
  { name: "Context.dev", slug: "context-dev", category: "Cursor Marketplace", file: "context-dev.png" },
  { name: "Context7", slug: "context7", category: "Cursor Marketplace", file: "context7.png" },
  { name: "Continual Learning", slug: "continual-learning", category: "Cursor Marketplace", file: "continual-learning.png" },
  { name: "Convex", slug: "convex", category: "Cursor Marketplace", file: "convex.svg" },
  { name: "Coralogix", slug: "coralogix", category: "Cursor Marketplace", file: "coralogix.png" },
  { name: "Corridor", slug: "corridor", category: "Cursor Marketplace", file: "corridor.png" },
  { name: "Create Plugin", slug: "create-plugin", category: "Cursor Marketplace", file: "create-plugin.png" },
  { name: "CrowdStrike", slug: "crowdstrike", category: "Cursor Marketplace", file: "crowdstrike.png" },
  { name: "Cursor Team Kit", slug: "cursor-team-kit", category: "Cursor Marketplace", file: "cursor-team-kit.svg" },
  { name: "D&B Commercial Graph", slug: "d-amp-b-commercial-graph", category: "Cursor Marketplace", file: "d-amp-b-commercial-graph.png" },
  { name: "D&B Risk Analytics", slug: "d-amp-b-risk-analytics", category: "Cursor Marketplace", file: "d-amp-b-risk-analytics.png" },
  { name: "Dagster", slug: "dagster", category: "Cursor Marketplace", file: "dagster.png" },
  { name: "Databricks", slug: "databricks", category: "Cursor Marketplace", file: "databricks.svg" },
  { name: "Datadog", slug: "datadog", category: "Cursor Marketplace", file: "datadog.svg" },
  { name: "DataRobot", slug: "datarobot", category: "Cursor Marketplace", file: "datarobot.png" },
  { name: "dbt Labs", slug: "dbt-labs", category: "Cursor Marketplace", file: "dbt-labs.png" },
  { name: "Docs Canvas", slug: "docs-canvas", category: "Cursor Marketplace", file: "docs-canvas.png" },
  { name: "Docusign", slug: "docusign", category: "Cursor Marketplace", file: "docusign.png" },
  { name: "Dropbox", slug: "dropbox", category: "Cursor Marketplace", file: "dropbox.svg" },
  { name: "Dynatrace", slug: "dynatrace", category: "Cursor Marketplace", file: "dynatrace.svg" },
  { name: "Elastic", slug: "elastic", category: "Cursor Marketplace", file: "elastic.svg" },
  { name: "Encore", slug: "encore", category: "Cursor Marketplace", file: "encore.png" },
  { name: "Endor Labs Agent Kit", slug: "endor-labs-agent-kit", category: "Cursor Marketplace", file: "endor-labs-agent-kit.png" },
  { name: "Exa", slug: "exa", category: "Cursor Marketplace", file: "exa.png" },
  { name: "Falconer", slug: "falconer", category: "Cursor Marketplace", file: "falconer.png" },
  { name: "Firebase", slug: "firebase", category: "Cursor Marketplace", file: "firebase.svg" },
  { name: "Firecrawl", slug: "firecrawl", category: "Cursor Marketplace", file: "firecrawl.png" },
  { name: "Firetiger", slug: "firetiger", category: "Cursor Marketplace", file: "firetiger.png" },
  { name: "Forge", slug: "forge", category: "Cursor Marketplace", file: "forge.png" },
  { name: "GitBook", slug: "gitbook", category: "Cursor Marketplace", file: "gitbook.svg" },
  { name: "GitHits", slug: "githits", category: "Cursor Marketplace", file: "githits.png" },
  { name: "GitLab", slug: "gitlab", category: "Cursor Marketplace", file: "gitlab.svg" },
  { name: "Glean", slug: "glean", category: "Cursor Marketplace", file: "glean.jpg" },
  { name: "Gong", slug: "gong", category: "Cursor Marketplace", file: "gong.png" },
  { name: "Grafana Cloud", slug: "grafana-cloud", category: "Cursor Marketplace", file: "grafana-cloud.svg" },
  { name: "Grafana Labs", slug: "grafana-labs", category: "Cursor Marketplace", file: "grafana-labs.svg" },
  { name: "Granola", slug: "granola", category: "Cursor Marketplace", file: "granola.png" },
  { name: "GSAP", slug: "gsap", category: "Cursor Marketplace", file: "gsap.svg" },
  { name: "Harness", slug: "harness", category: "Cursor Marketplace", file: "harness.png" },
  { name: "here.now", slug: "here-now", category: "Cursor Marketplace", file: "here-now.png" },
  { name: "Hex", slug: "hex", category: "Cursor Marketplace", file: "hex.png" },
  { name: "HeyGen", slug: "heygen", category: "Cursor Marketplace", file: "heygen.png" },
  { name: "Higgsfield", slug: "higgsfield", category: "Cursor Marketplace", file: "higgsfield.png" },
  { name: "Hostinger", slug: "hostinger", category: "Cursor Marketplace", file: "hostinger.svg" },
  { name: "Hugging Face", slug: "hugging-face", category: "Cursor Marketplace", file: "hugging-face.svg" },
  { name: "IcePanel", slug: "icepanel", category: "Cursor Marketplace", file: "icepanel.png" },
  { name: "Intercom", slug: "intercom", category: "Cursor Marketplace", file: "intercom.svg" },
  { name: "JFrog", slug: "jfrog", category: "Cursor Marketplace", file: "jfrog.svg" },
  { name: "Juicebox", slug: "juicebox", category: "Cursor Marketplace", file: "juicebox.png" },
  { name: "Kraken", slug: "kraken", category: "Cursor Marketplace", file: "kraken.png" },
  { name: "Langfuse", slug: "langfuse", category: "Cursor Marketplace", file: "langfuse.png" },
  { name: "LaunchDarkly", slug: "launchdarkly", category: "Cursor Marketplace", file: "launchdarkly.png" },
  { name: "Lovable", slug: "lovable", category: "Cursor Marketplace", file: "lovable.png" },
  { name: "Lucid", slug: "lucid", category: "Cursor Marketplace", file: "lucid.svg" },
  { name: "Magic Patterns", slug: "magic-patterns", category: "Cursor Marketplace", file: "magic-patterns.svg" },
  { name: "MagicPath", slug: "magicpath", category: "Cursor Marketplace", file: "magicpath.png" },
  { name: "Mainframe", slug: "mainframe", category: "Cursor Marketplace", file: "mainframe.png" },
  { name: "Manufact", slug: "manufact", category: "Cursor Marketplace", file: "manufact.png" },
  { name: "Mem0", slug: "mem0", category: "Cursor Marketplace", file: "mem0.png" },
  { name: "Merge", slug: "merge", category: "Cursor Marketplace", file: "merge.png" },
  { name: "Meta Reality Labs", slug: "meta-reality-labs", category: "Cursor Marketplace", file: "meta-reality-labs.svg" },
  { name: "Meticulous", slug: "meticulous", category: "Cursor Marketplace", file: "meticulous.png" },
  { name: "Microsoft Dataverse", slug: "microsoft-dataverse", category: "Cursor Marketplace", file: "microsoft-dataverse.png" },
  { name: "Mintlify", slug: "mintlify", category: "Cursor Marketplace", file: "mintlify.svg" },
  { name: "Miro", slug: "miro", category: "Cursor Marketplace", file: "miro.svg" },
  { name: "Mobbin", slug: "mobbin", category: "Cursor Marketplace", file: "mobbin.png" },
  { name: "Modern Web Guidance", slug: "modern-web-guidance", category: "Cursor Marketplace", file: "modern-web-guidance.png" },
  { name: "Monday.com", slug: "monday-com", category: "Cursor Marketplace", file: "monday-com.png" },
  { name: "MongoDB", slug: "mongodb", category: "Cursor Marketplace", file: "mongodb.svg" },
  { name: "MongoDB Atlas", slug: "mongodb-atlas", category: "Cursor Marketplace", file: "mongodb-atlas.svg" },
  { name: "Monk.io", slug: "monk-io", category: "Cursor Marketplace", file: "monk-io.png" },
  { name: "Navan", slug: "navan", category: "Cursor Marketplace", file: "navan.webp" },
  { name: "Neon Postgres", slug: "neon-postgres", category: "Cursor Marketplace", file: "neon-postgres.svg" },
  { name: "Netlify", slug: "netlify", category: "Cursor Marketplace", file: "netlify.svg" },
  { name: "Nvidia Skills", slug: "nvidia-skills", category: "Cursor Marketplace", file: "nvidia-skills.svg" },
  { name: "Observe by Snowflake", slug: "observe-by-snowflake", category: "Cursor Marketplace", file: "observe-by-snowflake.svg" },
  { name: "Omni", slug: "omni", category: "Cursor Marketplace", file: "omni.png" },
  { name: "OneSignal", slug: "onesignal", category: "Cursor Marketplace", file: "onesignal.png" },
  { name: "OpenSearch", slug: "opensearch", category: "Cursor Marketplace", file: "opensearch.svg" },
  { name: "Opsera", slug: "opsera", category: "Cursor Marketplace", file: "opsera.png" },
  { name: "Orchestrate", slug: "orchestrate", category: "Cursor Marketplace", file: "orchestrate.png" },
  { name: "Outreach", slug: "outreach", category: "Cursor Marketplace", file: "outreach.png" },
  { name: "PagerDuty", slug: "pagerduty", category: "Cursor Marketplace", file: "pagerduty.svg" },
  { name: "Paper", slug: "paper", category: "Cursor Marketplace", file: "paper.png" },
  { name: "ParadeDB", slug: "paradedb", category: "Cursor Marketplace", file: "paradedb.png" },
  { name: "Parallel", slug: "parallel", category: "Cursor Marketplace", file: "parallel.png" },
  { name: "Pendo", slug: "pendo", category: "Cursor Marketplace", file: "pendo.png" },
  { name: "Phantom", slug: "phantom", category: "Cursor Marketplace", file: "phantom.png" },
  { name: "Pinecone", slug: "pinecone", category: "Cursor Marketplace", file: "pinecone.png" },
  { name: "Plain", slug: "plain", category: "Cursor Marketplace", file: "plain.png" },
  { name: "PlanetScale", slug: "planetscale", category: "Cursor Marketplace", file: "planetscale.svg" },
  { name: "Playwright", slug: "playwright", category: "Cursor Marketplace", file: "playwright.png" },
  { name: "Port", slug: "port", category: "Cursor Marketplace", file: "port.png" },
  { name: "PostHog", slug: "posthog", category: "Cursor Marketplace", file: "posthog.svg" },
  { name: "Postman", slug: "postman", category: "Cursor Marketplace", file: "postman.svg" },
  { name: "PR Review Canvas", slug: "pr-review-canvas", category: "Cursor Marketplace", file: "pr-review-canvas.png" },
  { name: "Prisma", slug: "prisma", category: "Cursor Marketplace", file: "prisma.svg" },
  { name: "Profound", slug: "profound", category: "Cursor Marketplace", file: "profound.png" },
  { name: "QuiverAI", slug: "quiverai", category: "Cursor Marketplace", file: "quiverai.png" },
  { name: "Railway", slug: "railway", category: "Cursor Marketplace", file: "railway.svg" },
  { name: "Raisely", slug: "raisely", category: "Cursor Marketplace", file: "raisely.png" },
  { name: "Ramp", slug: "ramp", category: "Cursor Marketplace", file: "ramp.png" },
  { name: "React Doctor", slug: "react-doctor", category: "Cursor Marketplace", file: "react-doctor.svg" },
  { name: "Redis", slug: "redis", category: "Cursor Marketplace", file: "redis.svg" },
  { name: "Remotion", slug: "remotion", category: "Cursor Marketplace", file: "remotion.png" },
  { name: "Render", slug: "render", category: "Cursor Marketplace", file: "render.svg" },
  { name: "Resend", slug: "resend", category: "Cursor Marketplace", file: "resend.svg" },
  { name: "Resolve AI", slug: "resolve-ai", category: "Cursor Marketplace", file: "resolve-ai.png" },
  { name: "RevenueCat", slug: "revenuecat", category: "Cursor Marketplace", file: "revenuecat.svg" },
  { name: "RevenueCat Play Billing", slug: "revenuecat-play-billing", category: "Cursor Marketplace", file: "revenuecat-play-billing.svg" },
  { name: "Revolut X", slug: "revolut-x", category: "Cursor Marketplace", file: "revolut-x.svg" },
  { name: "Revyl", slug: "revyl", category: "Cursor Marketplace", file: "revyl.png" },
  { name: "Roboflow", slug: "roboflow", category: "Cursor Marketplace", file: "roboflow.svg" },
  { name: "Runlayer", slug: "runlayer", category: "Cursor Marketplace", file: "runlayer.png" },
  { name: "Sanity", slug: "sanity", category: "Cursor Marketplace", file: "sanity.svg" },
  { name: "Scandit", slug: "scandit", category: "Cursor Marketplace", file: "scandit.png" },
  { name: "ScyllaDB", slug: "scylladb", category: "Cursor Marketplace", file: "scylladb.svg" },
  { name: "Semgrep", slug: "semgrep", category: "Cursor Marketplace", file: "semgrep.png" },
  { name: "Sentry", slug: "sentry", category: "Cursor Marketplace", file: "sentry.svg" },
  { name: "shadcn/ui", slug: "shadcn-ui", category: "Cursor Marketplace", file: "shadcn-ui.svg" },
  { name: "Shopify", slug: "shopify", category: "Cursor Marketplace", file: "shopify.svg" },
  { name: "Sinch", slug: "sinch", category: "Cursor Marketplace", file: "sinch.png" },
  { name: "Snowflake", slug: "snowflake", category: "Cursor Marketplace", file: "snowflake.svg" },
  { name: "Snyk", slug: "snyk", category: "Cursor Marketplace", file: "snyk.svg" },
  { name: "Snyk API & Web", slug: "snyk-api-amp-web", category: "Cursor Marketplace", file: "snyk-api-amp-web.svg" },
  { name: "SonarQube", slug: "sonarqube", category: "Cursor Marketplace", file: "sonarqube.png" },
  { name: "Sonatype", slug: "sonatype", category: "Cursor Marketplace", file: "sonatype.svg" },
  { name: "Sourcegraph", slug: "sourcegraph", category: "Cursor Marketplace", file: "sourcegraph.png" },
  { name: "Stripe Link", slug: "stripe-link", category: "Cursor Marketplace", file: "stripe-link.svg" },
  { name: "Subtext", slug: "subtext", category: "Cursor Marketplace", file: "subtext.png" },
  { name: "Supabase", slug: "supabase", category: "Cursor Marketplace", file: "supabase.svg" },
  { name: "Superpowers", slug: "superpowers", category: "Cursor Marketplace", file: "superpowers.png" },
  { name: "Svelte", slug: "svelte", category: "Cursor Marketplace", file: "svelte.svg" },
  { name: "Tabnine", slug: "tabnine", category: "Cursor Marketplace", file: "tabnine.png" },
  { name: "Tabnine Context Engine", slug: "tabnine-context-engine", category: "Cursor Marketplace", file: "tabnine-context-engine.png" },
  { name: "Tavily", slug: "tavily", category: "Cursor Marketplace", file: "tavily.png" },
  { name: "Temporal", slug: "temporal", category: "Cursor Marketplace", file: "temporal.svg" },
  { name: "Thermos", slug: "thermos", category: "Cursor Marketplace", file: "thermos.png" },
  { name: "ThoughtSpot", slug: "thoughtspot", category: "Cursor Marketplace", file: "thoughtspot.png" },
  { name: "TierZero", slug: "tierzero", category: "Cursor Marketplace", file: "tierzero.png" },
  { name: "tldraw", slug: "tldraw", category: "Cursor Marketplace", file: "tldraw.svg" },
  { name: "turbopuffer", slug: "turbopuffer", category: "Cursor Marketplace", file: "turbopuffer.png" },
  { name: "Twilio", slug: "twilio", category: "Cursor Marketplace", file: "twilio.png" },
  { name: "Vantage", slug: "vantage", category: "Cursor Marketplace", file: "vantage.png" },
  { name: "Webflow", slug: "webflow", category: "Cursor Marketplace", file: "webflow.svg" },
  { name: "Whop", slug: "whop", category: "Cursor Marketplace", file: "whop.png" },
  { name: "WorkOS", slug: "workos", category: "Cursor Marketplace", file: "workos.png" },
  { name: "X", slug: "x", category: "Cursor Marketplace", file: "x.svg" },
  { name: "Zapier", slug: "zapier", category: "Cursor Marketplace", file: "zapier.svg" },
  { name: "Zenity", slug: "zenity", category: "Cursor Marketplace", file: "zenity.png" },
  { name: "Zoom", slug: "zoom", category: "Cursor Marketplace", file: "zoom.svg" },
  { name: "ZoomInfo", slug: "zoominfo", category: "Cursor Marketplace", file: "zoominfo.png" },
  { name: "Zscaler", slug: "zscaler", category: "Cursor Marketplace", file: "zscaler.png" },
  { name: "AITuber", slug: "aituber", category: "Community tools", file: "aituber.png" },
  { name: "Amazon", slug: "amazon", category: "Community tools", file: "amazon.svg" },
  { name: "Anki", slug: "anki", category: "Community tools", file: "anki.svg" },
  { name: "Apple Search Ads", slug: "apple-search-ads", category: "Community tools", file: "apple-search-ads.svg" },
  { name: "Aviation Weather Center", slug: "aviation-weather-center", category: "Community tools", file: "aviation-weather-center.png" },
  { name: "Axiom", slug: "axiom", category: "Community tools", file: "axiom.png" },
  { name: "Bee", slug: "bee", category: "Community tools", file: "bee.png" },
  { name: "Bible", slug: "bible", category: "Community tools", file: "bible.png" },
  { name: "Bot Directory", slug: "bot-directory", category: "Community tools", file: "bot-directory.png" },
  { name: "Castos", slug: "castos", category: "Community tools", file: "castos.png" },
  { name: "Claude Code", slug: "claude-code", category: "Community tools", file: "claude-code.svg" },
  { name: "Codex", slug: "codex", category: "Community tools", file: "codex.png" },
  { name: "Codex CLI", slug: "codex-cli", category: "Community tools", file: "codex-cli.png" },
  { name: "Comp AI", slug: "comp-ai", category: "Community tools", file: "comp-ai.png" },
  { name: "Converly", slug: "converly", category: "Community tools", file: "converly.png" },
  { name: "Costco", slug: "costco", category: "Community tools", file: "costco.png" },
  { name: "Cursor Background Agents", slug: "cursor-background-agents", category: "Community tools", file: "cursor-background-agents.svg" },
  { name: "Cursor Cloud Agents", slug: "cursor-cloud-agents", category: "Community tools", file: "cursor-cloud-agents.svg" },
  { name: "DataForSEO", slug: "dataforseo", category: "Community tools", file: "dataforseo.png" },
  { name: "Delulu Social", slug: "delulu-social", category: "Community tools", file: "delulu-social.png" },
  { name: "Discord", slug: "discord", category: "Community tools", file: "discord.svg" },
  { name: "ExifTool", slug: "exiftool", category: "Community tools", file: "exiftool.png" },
  { name: "FAA NOTAM Search", slug: "faa-notam-search", category: "Community tools", file: "faa-notam-search.png" },
  { name: "FeedHive", slug: "feedhive", category: "Community tools", file: "feedhive.png" },
  { name: "Ferndesk", slug: "ferndesk", category: "Community tools", file: "ferndesk.png" },
  { name: "Google Flights", slug: "google-flights", category: "Community tools", file: "google-flights.svg" },
  { name: "Google Sheets", slug: "google-sheets", category: "Community tools", file: "google-sheets.svg" },
  { name: "Google Slides", slug: "google-slides", category: "Community tools", file: "google-slides.svg" },
  { name: "Grok Bot", slug: "grok-bot", category: "Community tools", file: "grok-bot.svg" },
  { name: "Hacker News", slug: "hacker-news", category: "Community tools", file: "hacker-news.svg" },
  { name: "Help Scout", slug: "help-scout", category: "Community tools", file: "help-scout.svg" },
  { name: "HelpSpot", slug: "helpspot", category: "Community tools", file: "helpspot.png" },
  { name: "HireNimbus", slug: "hirenimbus", category: "Community tools", file: "hirenimbus.ico" },
  { name: "Hyperliquid", slug: "hyperliquid", category: "Community tools", file: "hyperliquid.png" },
  { name: "iCloud", slug: "icloud", category: "Community tools", file: "icloud.svg" },
  { name: "Infisical", slug: "infisical", category: "Community tools", file: "infisical.png" },
  { name: "Kindle", slug: "kindle", category: "Community tools", file: "kindle.svg" },
  { name: "Kobbe", slug: "kobbe", category: "Community tools", file: "kobbe.png" },
  { name: "LinkedIn", slug: "linkedin", category: "Community tools", file: "linkedin.svg" },
  { name: "Luma", slug: "luma", category: "Community tools", file: "luma.png" },
  { name: "MaxFusion", slug: "maxfusion", category: "Community tools", file: "maxfusion.svg" },
  { name: "Photos", slug: "photos", category: "Community tools", file: "photos.png" },
  { name: "Postiz", slug: "postiz", category: "Community tools", file: "postiz.svg" },
  { name: "PostNitro", slug: "postnitro", category: "Community tools", file: "postnitro.png" },
  { name: "QuickBooks", slug: "quickbooks", category: "Community tools", file: "quickbooks.svg" },
  { name: "Reddit", slug: "reddit", category: "Community tools", file: "reddit.svg" },
  { name: "Sales Navigator", slug: "sales-navigator", category: "Community tools", file: "sales-navigator.svg" },
  { name: "ScreenshotOne", slug: "screenshotone", category: "Community tools", file: "screenshotone.png" },
  { name: "Search Console", slug: "search-console", category: "Community tools", file: "search-console.svg" },
  { name: "Stacktree", slug: "stacktree", category: "Community tools" },
  { name: "TikTok", slug: "tiktok", category: "Community tools", file: "tiktok.svg" },
  { name: "Trends.vc", slug: "trends-vc", category: "Community tools", file: "trends-vc.png" },
  { name: "Web Search", slug: "web-search", category: "Community tools", file: "web-search.svg" },
  { name: "Whole Foods", slug: "whole-foods", category: "Community tools", file: "whole-foods.png" },
  { name: "Whole Foods delivery", slug: "whole-foods-delivery", category: "Community tools", file: "whole-foods-delivery.png" },
  { name: "Xero", slug: "xero", category: "Community tools", file: "xero.svg" },
  { name: "YouTube", slug: "youtube", category: "Community tools", file: "youtube.svg" },
  { name: "Zendesk", slug: "zendesk", category: "Community tools", file: "zendesk.svg" },
];

/* The connectors xAI itself names as built in, on docs.x.ai/grok/connectors.
   Everything outside this set comes from the in-app picker, which xAI does
   not publish. */
export const BUILT_IN = new Set<string>([
  "gmail",
  "google-calendar",
  "google-drive",
  "onedrive",
  "outlook",
  "outlook-calendar",
  "microsoft-teams",
  "sharepoint",
  "salesforce",
]);

export function isBuiltIn(slug: string): boolean {
  return BUILT_IN.has(slug);
}

/* Pulled from the catalog upstream. Still resolves so old team files and
   forks keep rendering, but it is not an available connector. */
const RETIRED: CatalogEntry[] = [
  { name: "Slack", slug: "slack", category: "Productivity", file: "slack.svg" },
];

/* Names a team file may reasonably write, mapped to a catalog slug.
   "Calendar" is the one that matters: every existing team uses it. */
const ALIASES: Record<string, string> = {
  calendar: "google-calendar",
  googlecalendar: "google-calendar",
  gcal: "google-calendar",
  drive: "google-drive",
  googledrive: "google-drive",
  docs: "google-drive",
  sheets: "google-drive",
  slides: "google-drive",
  x: "x-ads",
  twitter: "x-ads",
  xads: "x-ads",
  bigquery: "google-cloud-bigquery",
  googlebigquery: "google-cloud-bigquery",
  teams: "microsoft-teams",
  msteams: "microsoft-teams",
  microsoftteams: "microsoft-teams",
  outlookmail: "outlook",
  onedrive: "onedrive",
  sharepoint: "sharepoint",
  ibkr: "interactive-brokers",
  interactivebrokers: "interactive-brokers",
  spglobal: "s-and-p-global",
  "s&p global": "s-and-p-global",
  heygen: "hyperframes",
  hyperframesbyheygen: "hyperframes",
};

export type ConnectorMark = {
  name: string;
  slug: string;
  src: string;
};

const BY_SLUG = new Map<string, CatalogEntry>();
for (const entry of [...CONNECTOR_CATALOG, ...RETIRED]) BY_SLUG.set(entry.slug, entry);

const BY_NAME = new Map<string, CatalogEntry>();
for (const entry of [...CONNECTOR_CATALOG, ...RETIRED]) {
  BY_NAME.set(connectorKey(entry.name), entry);
  BY_NAME.set(connectorKey(entry.name).replace(/\s+/g, ""), entry);
  BY_NAME.set(entry.slug, entry);
}

export function connectorKey(name: string): string {
  return name.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function lookup(name: string): CatalogEntry | undefined {
  const key = connectorKey(name);
  const tight = key.replace(/\s+/g, "");
  const aliased = ALIASES[key] ?? ALIASES[tight];
  if (aliased) return BY_SLUG.get(aliased);
  return BY_NAME.get(key) ?? BY_NAME.get(tight);
}

export function resolveConnector(name: string): ConnectorMark {
  const entry = lookup(name);
  if (entry) {
    return {
      // Catalog spelling wins, so "calendar" renders as "Google Calendar".
      name: entry.name,
      slug: entry.slug,
      src: entry.file ? `/connectors/${entry.file}` : "",
    };
  }
  // Unknown name: almost always a Bring Your Own MCP server. Keep it
  // visible with a monogram rather than dropping it silently.
  return { name, slug: connectorKey(name).replace(/\s+/g, "-"), src: "" };
}

export function resolveConnectors(names: string[]): ConnectorMark[] {
  const seen = new Set<string>();
  const out: ConnectorMark[] = [];
  for (const name of names) {
    const mark = resolveConnector(name);
    const id = mark.slug || mark.name.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(mark);
  }
  return out;
}

/** True when the name matches a currently available connector. */
export function isKnownConnector(name: string): boolean {
  const entry = lookup(name);
  return Boolean(entry) && CONNECTOR_CATALOG.includes(entry as CatalogEntry);
}

/** Catalog grouped for display, in the category order declared above. */
export function catalogByCategory(): { category: ConnectorCategory; entries: CatalogEntry[] }[] {
  const order: ConnectorCategory[] = [
    "Featured",
    "Advertising",
    "Analytics",
    "Developer",
    "Finance",
    "Productivity",
    "Sales",
    "Business and enterprise",
    "Cursor Marketplace",
    "Community tools",
  ];
  return order
    .map((category) => ({ category, entries: CONNECTOR_CATALOG.filter((e) => e.category === category) }))
    .filter((group) => group.entries.length > 0);
}
