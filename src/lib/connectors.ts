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

/* Categories name the job a connector does, not where we found it. The
   catalog used to carry "Cursor Marketplace" and "Community tools", which
   were provenance tags: two of them covered 274 of 306 rows, so as filters
   they sorted nothing. Provenance is recorded in the header comment above,
   which is the right place for it. */
export type ConnectorCategory =
  | "Featured"
  | "Advertising"
  | "Analytics"
  | "Business and enterprise"
  | "Cloud"
  | "Data"
  | "Developer"
  | "Engineering"
  | "Finance"
  | "Marketing"
  | "Productivity"
  | "Sales"
  | "Security"
  | "Support";

export type CatalogEntry = {
  name: string;
  slug: string;
  category: ConnectorCategory;
  /* Filename under /public/connectors. Omitted when the vendor has no
     official mark to use, and the row falls back to a letter chip. We do
     not draw one ourselves to fill the gap. */
  file?: string;
  /* Official product site or MCP/API docs. Community rows use this when
     we have a verified URL and no vendor mark. */
  href?: string;
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
  { name: "1inch", slug: "1inch", category: "Finance", file: "1inch.png" },
  { name: "1Password", slug: "1password", category: "Security", file: "1password.svg" },
  { name: "Adobe Developer App Builder", slug: "adobe-developer-app-builder", category: "Developer", file: "adobe-developer-app-builder.png" },
  { name: "Agent Compatibility", slug: "agent-compatibility", category: "Developer", file: "agent-compatibility.png" },
  { name: "AgentMail", slug: "agentmail", category: "Developer", file: "agentmail.png" },
  { name: "Aikido", slug: "aikido", category: "Security", file: "aikido.png" },
  { name: "Airtable", slug: "airtable", category: "Productivity", file: "airtable.svg" },
  { name: "Airwallex", slug: "airwallex", category: "Finance", file: "airwallex.png" },
  { name: "Airwallex AgentOS", slug: "airwallex-agentos", category: "Finance", file: "airwallex-agentos.png" },
  { name: "Airwallex Developer", slug: "airwallex-developer", category: "Finance", file: "airwallex-developer.png" },
  { name: "Aleph", slug: "aleph", category: "Data", file: "aleph.png" },
  { name: "Amazon Location Service", slug: "amazon-location-service", category: "Cloud", file: "amazon-location-service.svg" },
  { name: "AMD", slug: "amd", category: "Developer", file: "amd.svg" },
  { name: "Amplemarket", slug: "amplemarket", category: "Sales", file: "amplemarket.png" },
  { name: "Amplitude", slug: "amplitude", category: "Analytics", file: "amplitude.png" },
  { name: "Antimetal", slug: "antimetal", category: "Cloud", file: "antimetal.png" },
  { name: "Apify", slug: "apify", category: "Data", file: "apify.png" },
  { name: "Apollo.io", slug: "apollo-io", category: "Sales", file: "apollo-io.png" },
  { name: "Appwrite", slug: "appwrite", category: "Developer", file: "appwrite.svg" },
  { name: "Arize", slug: "arize", category: "Data", file: "arize.png" },
  { name: "Asana", slug: "asana", category: "Productivity", file: "asana.svg" },
  { name: "Ashby", slug: "ashby", category: "Business and enterprise", file: "ashby.png" },
  { name: "Astronomer", slug: "astronomer", category: "Data", file: "astronomer.png" },
  { name: "Atlan", slug: "atlan", category: "Data", file: "atlan.png" },
  { name: "Atlassian", slug: "atlassian", category: "Developer", file: "atlassian.svg" },
  { name: "Atlassian Forge", slug: "atlassian-forge", category: "Developer", file: "atlassian-forge.svg" },
  { name: "Atlassian Teamwork Graph", slug: "atlassian-teamwork-graph", category: "Developer", file: "atlassian-teamwork-graph.svg" },
  { name: "AtScale", slug: "atscale", category: "Data", file: "atscale.png" },
  { name: "Auth0", slug: "auth0", category: "Security", file: "auth0.svg" },
  { name: "AWS Agents", slug: "aws-agents", category: "Cloud", file: "aws-agents.svg" },
  { name: "AWS Amplify", slug: "aws-amplify", category: "Cloud", file: "aws-amplify.svg" },
  { name: "AWS Core", slug: "aws-core", category: "Cloud", file: "aws-core.svg" },
  { name: "AWS Data Analytics", slug: "aws-data-analytics", category: "Cloud", file: "aws-data-analytics.svg" },
  { name: "AWS Databases", slug: "aws-databases", category: "Cloud", file: "aws-databases.svg" },
  { name: "AWS Deployments", slug: "aws-deployments", category: "Cloud", file: "aws-deployments.svg" },
  { name: "AWS SageMaker", slug: "aws-sagemaker", category: "Cloud", file: "aws-sagemaker.svg" },
  { name: "AWS Serverless", slug: "aws-serverless", category: "Cloud", file: "aws-serverless.svg" },
  { name: "Azure", slug: "azure", category: "Cloud", file: "azure.png" },
  { name: "Azure Cosmos DB", slug: "azure-cosmos-db", category: "Data", file: "azure-cosmos-db.png" },
  { name: "Braintrust", slug: "braintrust", category: "Data", file: "braintrust.svg" },
  { name: "Bright Data", slug: "bright-data", category: "Data", file: "bright-data.png" },
  { name: "Browser Use", slug: "browser-use", category: "Developer", file: "browser-use.png" },
  { name: "Browserbase", slug: "browserbase", category: "Developer", file: "browserbase.svg" },
  { name: "Browserstack", slug: "browserstack", category: "Engineering", file: "browserstack.png" },
  { name: "Buildkite", slug: "buildkite", category: "Engineering", file: "buildkite.svg" },
  { name: "Chainguard", slug: "chainguard", category: "Security", file: "chainguard.svg" },
  { name: "Chargebee", slug: "chargebee", category: "Finance", file: "chargebee.png" },
  { name: "ChatPRD", slug: "chatprd", category: "Productivity", file: "chatprd.png" },
  { name: "Checkmarx", slug: "checkmarx", category: "Security", file: "checkmarx.svg" },
  { name: "Circle", slug: "circle", category: "Finance", file: "circle.svg" },
  { name: "Circleback", slug: "circleback", category: "Productivity", file: "circleback.png" },
  { name: "Cisco ThousandEyes", slug: "cisco-thousandeyes", category: "Engineering", file: "cisco-thousandeyes.svg" },
  { name: "Clay", slug: "clay", category: "Sales", file: "clay.png" },
  { name: "Clerk", slug: "clerk", category: "Security", file: "clerk.svg" },
  { name: "ClickHouse", slug: "clickhouse", category: "Data", file: "clickhouse.svg" },
  { name: "ClickUp", slug: "clickup", category: "Productivity", file: "clickup.svg" },
  { name: "Cloudflare", slug: "cloudflare", category: "Cloud", file: "cloudflare.svg" },
  { name: "Cloudinary", slug: "cloudinary", category: "Developer", file: "cloudinary.svg" },
  { name: "CockroachDB", slug: "cockroachdb", category: "Data", file: "cockroachdb.svg" },
  { name: "CodeRabbit", slug: "coderabbit", category: "Engineering", file: "coderabbit.svg" },
  { name: "Composio", slug: "composio", category: "Developer", file: "composio.png" },
  { name: "Compound Engineering", slug: "compound-engineering", category: "Developer", file: "compound-engineering.png" },
  { name: "Confidence by Spotify", slug: "confidence-by-spotify", category: "Analytics", file: "confidence-by-spotify.svg" },
  { name: "Context.dev", slug: "context-dev", category: "Developer", file: "context-dev.png" },
  { name: "Context7", slug: "context7", category: "Developer", file: "context7.png" },
  { name: "Continual Learning", slug: "continual-learning", category: "Developer", file: "continual-learning.png" },
  { name: "Convex", slug: "convex", category: "Cloud", file: "convex.svg" },
  { name: "Coralogix", slug: "coralogix", category: "Engineering", file: "coralogix.png" },
  { name: "Corridor", slug: "corridor", category: "Engineering", file: "corridor.png" },
  { name: "Create Plugin", slug: "create-plugin", category: "Developer", file: "create-plugin.png" },
  { name: "CrowdStrike", slug: "crowdstrike", category: "Security", file: "crowdstrike.png" },
  { name: "Cursor Team Kit", slug: "cursor-team-kit", category: "Developer", file: "cursor-team-kit.svg" },
  { name: "D&B Commercial Graph", slug: "d-amp-b-commercial-graph", category: "Sales", file: "d-amp-b-commercial-graph.png" },
  { name: "D&B Risk Analytics", slug: "d-amp-b-risk-analytics", category: "Finance", file: "d-amp-b-risk-analytics.png" },
  { name: "Dagster", slug: "dagster", category: "Data", file: "dagster.png" },
  { name: "Databricks", slug: "databricks", category: "Data", file: "databricks.svg" },
  { name: "Datadog", slug: "datadog", category: "Engineering", file: "datadog.svg" },
  { name: "DataRobot", slug: "datarobot", category: "Data", file: "datarobot.png" },
  { name: "dbt Labs", slug: "dbt-labs", category: "Data", file: "dbt-labs.png" },
  { name: "Docs Canvas", slug: "docs-canvas", category: "Developer", file: "docs-canvas.png" },
  { name: "Docusign", slug: "docusign", category: "Business and enterprise", file: "docusign.png" },
  { name: "Dropbox", slug: "dropbox", category: "Productivity", file: "dropbox.svg" },
  { name: "Dynatrace", slug: "dynatrace", category: "Engineering", file: "dynatrace.svg" },
  { name: "Elastic", slug: "elastic", category: "Data", file: "elastic.svg" },
  { name: "Encore", slug: "encore", category: "Cloud", file: "encore.png" },
  { name: "Endor Labs Agent Kit", slug: "endor-labs-agent-kit", category: "Security", file: "endor-labs-agent-kit.png" },
  { name: "Exa", slug: "exa", category: "Data", file: "exa.png" },
  { name: "Falconer", slug: "falconer", category: "Security", file: "falconer.png" },
  { name: "Firebase", slug: "firebase", category: "Cloud", file: "firebase.svg" },
  { name: "Firecrawl", slug: "firecrawl", category: "Data", file: "firecrawl.png" },
  { name: "Firetiger", slug: "firetiger", category: "Engineering", file: "firetiger.png" },
  { name: "Forge", slug: "forge", category: "Developer", file: "forge.png" },
  { name: "GitBook", slug: "gitbook", category: "Developer", file: "gitbook.svg" },
  { name: "GitHits", slug: "githits", category: "Developer", file: "githits.png" },
  { name: "GitLab", slug: "gitlab", category: "Developer", file: "gitlab.svg" },
  { name: "Glean", slug: "glean", category: "Business and enterprise", file: "glean.jpg" },
  { name: "Gong", slug: "gong", category: "Sales", file: "gong.png" },
  { name: "Grafana Cloud", slug: "grafana-cloud", category: "Engineering", file: "grafana-cloud.svg" },
  { name: "Grafana Labs", slug: "grafana-labs", category: "Engineering", file: "grafana-labs.svg" },
  { name: "Granola", slug: "granola", category: "Productivity", file: "granola.png" },
  { name: "GSAP", slug: "gsap", category: "Developer", file: "gsap.svg" },
  { name: "Harness", slug: "harness", category: "Engineering", file: "harness.png" },
  { name: "here.now", slug: "here-now", category: "Productivity", file: "here-now.png" },
  { name: "Hex", slug: "hex", category: "Data", file: "hex.png" },
  { name: "HeyGen", slug: "heygen", category: "Marketing", file: "heygen.png" },
  { name: "Higgsfield", slug: "higgsfield", category: "Marketing", file: "higgsfield.png" },
  { name: "Hostinger", slug: "hostinger", category: "Cloud", file: "hostinger.svg" },
  { name: "Hugging Face", slug: "hugging-face", category: "Data", file: "hugging-face.svg" },
  { name: "IcePanel", slug: "icepanel", category: "Developer", file: "icepanel.png" },
  { name: "Intercom", slug: "intercom", category: "Support", file: "intercom.svg" },
  { name: "JFrog", slug: "jfrog", category: "Engineering", file: "jfrog.svg" },
  { name: "Juicebox", slug: "juicebox", category: "Sales", file: "juicebox.png" },
  { name: "Kraken", slug: "kraken", category: "Finance", file: "kraken.png" },
  { name: "Langfuse", slug: "langfuse", category: "Data", file: "langfuse.png" },
  { name: "LaunchDarkly", slug: "launchdarkly", category: "Engineering", file: "launchdarkly.png" },
  { name: "Lovable", slug: "lovable", category: "Developer", file: "lovable.png" },
  { name: "Lucid", slug: "lucid", category: "Productivity", file: "lucid.svg" },
  { name: "Magic Patterns", slug: "magic-patterns", category: "Developer", file: "magic-patterns.svg" },
  { name: "MagicPath", slug: "magicpath", category: "Developer", file: "magicpath.png" },
  { name: "Mainframe", slug: "mainframe", category: "Productivity", file: "mainframe.png" },
  { name: "Manufact", slug: "manufact", category: "Developer", file: "manufact.png" },
  { name: "Mem0", slug: "mem0", category: "Data", file: "mem0.png" },
  { name: "Merge", slug: "merge", category: "Developer", file: "merge.png" },
  { name: "Meta Reality Labs", slug: "meta-reality-labs", category: "Developer", file: "meta-reality-labs.svg" },
  { name: "Meticulous", slug: "meticulous", category: "Engineering", file: "meticulous.png" },
  { name: "Microsoft Dataverse", slug: "microsoft-dataverse", category: "Business and enterprise", file: "microsoft-dataverse.png" },
  { name: "Mintlify", slug: "mintlify", category: "Developer", file: "mintlify.svg" },
  { name: "Miro", slug: "miro", category: "Productivity", file: "miro.svg" },
  { name: "Mobbin", slug: "mobbin", category: "Developer", file: "mobbin.png" },
  { name: "Modern Web Guidance", slug: "modern-web-guidance", category: "Developer", file: "modern-web-guidance.png" },
  { name: "Monday.com", slug: "monday-com", category: "Productivity", file: "monday-com.png" },
  { name: "MongoDB", slug: "mongodb", category: "Data", file: "mongodb.svg" },
  { name: "MongoDB Atlas", slug: "mongodb-atlas", category: "Data", file: "mongodb-atlas.svg" },
  { name: "Monk.io", slug: "monk-io", category: "Engineering", file: "monk-io.png" },
  { name: "Navan", slug: "navan", category: "Finance", file: "navan.webp" },
  { name: "Neon Postgres", slug: "neon-postgres", category: "Data", file: "neon-postgres.svg" },
  { name: "Netlify", slug: "netlify", category: "Cloud", file: "netlify.svg" },
  { name: "Nvidia Skills", slug: "nvidia-skills", category: "Developer", file: "nvidia-skills.svg" },
  { name: "Observe by Snowflake", slug: "observe-by-snowflake", category: "Engineering", file: "observe-by-snowflake.svg" },
  { name: "Omni", slug: "omni", category: "Analytics", file: "omni.png" },
  { name: "OneSignal", slug: "onesignal", category: "Marketing", file: "onesignal.png" },
  { name: "OpenSearch", slug: "opensearch", category: "Data", file: "opensearch.svg" },
  { name: "Opsera", slug: "opsera", category: "Engineering", file: "opsera.png" },
  { name: "Orchestrate", slug: "orchestrate", category: "Productivity", file: "orchestrate.png" },
  { name: "Outreach", slug: "outreach", category: "Sales", file: "outreach.png" },
  { name: "PagerDuty", slug: "pagerduty", category: "Engineering", file: "pagerduty.svg" },
  { name: "Paper", slug: "paper", category: "Productivity", file: "paper.png" },
  { name: "ParadeDB", slug: "paradedb", category: "Data", file: "paradedb.png" },
  { name: "Parallel", slug: "parallel", category: "Data", file: "parallel.png" },
  { name: "Pendo", slug: "pendo", category: "Analytics", file: "pendo.png" },
  { name: "Phantom", slug: "phantom", category: "Finance", file: "phantom.png" },
  { name: "Pinecone", slug: "pinecone", category: "Data", file: "pinecone.png" },
  { name: "Plain", slug: "plain", category: "Support", file: "plain.png" },
  { name: "PlanetScale", slug: "planetscale", category: "Data", file: "planetscale.svg" },
  { name: "Playwright", slug: "playwright", category: "Engineering", file: "playwright.png" },
  { name: "Port", slug: "port", category: "Engineering", file: "port.png" },
  { name: "PostHog", slug: "posthog", category: "Analytics", file: "posthog.svg" },
  { name: "Postman", slug: "postman", category: "Developer", file: "postman.svg" },
  { name: "PR Review Canvas", slug: "pr-review-canvas", category: "Developer", file: "pr-review-canvas.png" },
  { name: "Prisma", slug: "prisma", category: "Developer", file: "prisma.svg" },
  { name: "Profound", slug: "profound", category: "Marketing", file: "profound.png" },
  { name: "QuiverAI", slug: "quiverai", category: "Marketing", file: "quiverai.png" },
  { name: "Railway", slug: "railway", category: "Cloud", file: "railway.svg" },
  { name: "Raisely", slug: "raisely", category: "Finance", file: "raisely.png" },
  { name: "Ramp", slug: "ramp", category: "Finance", file: "ramp.png" },
  { name: "React Doctor", slug: "react-doctor", category: "Engineering", file: "react-doctor.svg" },
  { name: "Redis", slug: "redis", category: "Data", file: "redis.svg" },
  { name: "Remotion", slug: "remotion", category: "Developer", file: "remotion.png" },
  { name: "Render", slug: "render", category: "Cloud", file: "render.svg" },
  { name: "Resend", slug: "resend", category: "Developer", file: "resend.svg" },
  { name: "Resolve AI", slug: "resolve-ai", category: "Engineering", file: "resolve-ai.png" },
  { name: "RevenueCat", slug: "revenuecat", category: "Finance", file: "revenuecat.svg" },
  { name: "RevenueCat Play Billing", slug: "revenuecat-play-billing", category: "Finance", file: "revenuecat-play-billing.svg" },
  { name: "Revolut X", slug: "revolut-x", category: "Finance", file: "revolut-x.svg" },
  { name: "Revyl", slug: "revyl", category: "Engineering", file: "revyl.png" },
  { name: "Roboflow", slug: "roboflow", category: "Data", file: "roboflow.svg" },
  { name: "Runlayer", slug: "runlayer", category: "Developer", file: "runlayer.png" },
  { name: "Sanity", slug: "sanity", category: "Developer", file: "sanity.svg" },
  { name: "Scandit", slug: "scandit", category: "Developer", file: "scandit.png" },
  { name: "ScyllaDB", slug: "scylladb", category: "Data", file: "scylladb.svg" },
  { name: "Semgrep", slug: "semgrep", category: "Security", file: "semgrep.png" },
  { name: "Sentry", slug: "sentry", category: "Engineering", file: "sentry.svg" },
  { name: "shadcn/ui", slug: "shadcn-ui", category: "Developer", file: "shadcn-ui.svg" },
  { name: "Shopify", slug: "shopify", category: "Sales", file: "shopify.svg" },
  { name: "Sinch", slug: "sinch", category: "Support", file: "sinch.png" },
  { name: "Snowflake", slug: "snowflake", category: "Data", file: "snowflake.svg" },
  { name: "Snyk", slug: "snyk", category: "Security", file: "snyk.svg" },
  { name: "Snyk API & Web", slug: "snyk-api-amp-web", category: "Security", file: "snyk-api-amp-web.svg" },
  { name: "SonarQube", slug: "sonarqube", category: "Engineering", file: "sonarqube.png" },
  { name: "Sonatype", slug: "sonatype", category: "Security", file: "sonatype.svg" },
  { name: "Sourcegraph", slug: "sourcegraph", category: "Developer", file: "sourcegraph.png" },
  { name: "Stripe Link", slug: "stripe-link", category: "Finance", file: "stripe-link.svg" },
  { name: "Subtext", slug: "subtext", category: "Productivity", file: "subtext.png" },
  { name: "Supabase", slug: "supabase", category: "Cloud", file: "supabase.svg" },
  { name: "Superpowers", slug: "superpowers", category: "Developer", file: "superpowers.png" },
  { name: "Svelte", slug: "svelte", category: "Developer", file: "svelte.svg" },
  { name: "Tabnine", slug: "tabnine", category: "Developer", file: "tabnine.png" },
  { name: "Tabnine Context Engine", slug: "tabnine-context-engine", category: "Developer", file: "tabnine-context-engine.png" },
  { name: "Tavily", slug: "tavily", category: "Data", file: "tavily.png" },
  { name: "Temporal", slug: "temporal", category: "Engineering", file: "temporal.svg" },
  { name: "Thermos", slug: "thermos", category: "Productivity", file: "thermos.png" },
  { name: "ThoughtSpot", slug: "thoughtspot", category: "Analytics", file: "thoughtspot.png" },
  { name: "TierZero", slug: "tierzero", category: "Security", file: "tierzero.png" },
  { name: "tldraw", slug: "tldraw", category: "Developer", file: "tldraw.svg" },
  { name: "turbopuffer", slug: "turbopuffer", category: "Data", file: "turbopuffer.png" },
  { name: "Twilio", slug: "twilio", category: "Support", file: "twilio.png" },
  { name: "Vantage", slug: "vantage", category: "Cloud", file: "vantage.png" },
  { name: "Webflow", slug: "webflow", category: "Marketing", file: "webflow.svg" },
  { name: "Whop", slug: "whop", category: "Finance", file: "whop.png" },
  { name: "WorkOS", slug: "workos", category: "Security", file: "workos.png" },
  { name: "X", slug: "x", category: "Marketing", file: "x.svg" },
  { name: "Zapier", slug: "zapier", category: "Productivity", file: "zapier.svg" },
  { name: "Zenity", slug: "zenity", category: "Security", file: "zenity.png" },
  { name: "Zoom", slug: "zoom", category: "Productivity", file: "zoom.svg" },
  { name: "ZoomInfo", slug: "zoominfo", category: "Sales", file: "zoominfo.png" },
  { name: "Zscaler", slug: "zscaler", category: "Security", file: "zscaler.png" },
  { name: "AITuber", slug: "aituber", category: "Marketing", file: "aituber.png" },
  { name: "Ahrefs", slug: "ahrefs", category: "Marketing", file: "ahrefs.png" },
  { name: "Amazon", slug: "amazon", category: "Productivity", file: "amazon.svg" },
  { name: "Anki", slug: "anki", category: "Productivity", file: "anki.svg" },
  { name: "Apple Search Ads", slug: "apple-search-ads", category: "Advertising", file: "apple-search-ads.svg" },
  { name: "Aviation Weather Center", slug: "aviation-weather-center", category: "Productivity", file: "aviation-weather-center.png" },
  { name: "Axiom", slug: "axiom", category: "Engineering", file: "axiom.png" },
  { name: "Bee", slug: "bee", category: "Productivity", file: "bee.png" },
  { name: "Bible", slug: "bible", category: "Productivity", file: "bible.png" },
  { name: "Bot Directory", slug: "bot-directory", category: "Developer", file: "bot-directory.png" },
  { name: "Castos", slug: "castos", category: "Marketing", file: "castos.png" },
  { name: "Claude Code", slug: "claude-code", category: "Developer", file: "claude-code.svg" },
  { name: "Codex", slug: "codex", category: "Developer", file: "codex.png" },
  { name: "Codex CLI", slug: "codex-cli", category: "Developer", file: "codex-cli.png" },
  { name: "Comp AI", slug: "comp-ai", category: "Security", file: "comp-ai.png" },
  { name: "Converly", slug: "converly", category: "Marketing", file: "converly.png" },
  { name: "Costco", slug: "costco", category: "Productivity", file: "costco.png" },
  { name: "Cursor Background Agents", slug: "cursor-background-agents", category: "Developer", file: "cursor-background-agents.svg" },
  { name: "Cursor Cloud Agents", slug: "cursor-cloud-agents", category: "Developer", file: "cursor-cloud-agents.svg" },
  { name: "DataForSEO", slug: "dataforseo", category: "Marketing", file: "dataforseo.png" },
  { name: "Delulu Social", slug: "delulu-social", category: "Marketing", file: "delulu-social.png" },
  { name: "Discord", slug: "discord", category: "Marketing", file: "discord.svg" },
  { name: "ExifTool", slug: "exiftool", category: "Productivity", file: "exiftool.png" },
  { name: "FAA NOTAM Search", slug: "faa-notam-search", category: "Productivity", file: "faa-notam-search.png" },
  { name: "FeedHive", slug: "feedhive", category: "Marketing", file: "feedhive.png" },
  { name: "Ferndesk", slug: "ferndesk", category: "Support", file: "ferndesk.png" },
  { name: "Google Ads", slug: "google-ads", category: "Advertising" },
  { name: "Google Analytics", slug: "google-analytics", category: "Analytics", file: "google-analytics.svg" },
  { name: "Google Docs", slug: "google-docs", category: "Productivity" },
  { name: "Google Flights", slug: "google-flights", category: "Productivity", file: "google-flights.svg" },
  { name: "Google Sheets", slug: "google-sheets", category: "Productivity", file: "google-sheets.svg" },
  { name: "Google Slides", slug: "google-slides", category: "Productivity", file: "google-slides.svg" },
  { name: "Grok Bot", slug: "grok-bot", category: "Productivity", file: "grok-bot.svg" },
  { name: "Hacker News", slug: "hacker-news", category: "Productivity", file: "hacker-news.svg" },
  { name: "Help Scout", slug: "help-scout", category: "Support", file: "help-scout.svg" },
  { name: "HelpSpot", slug: "helpspot", category: "Support", file: "helpspot.png" },
  { name: "HireNimbus", slug: "hirenimbus", category: "Business and enterprise", file: "hirenimbus.ico" },
  { name: "Hyperliquid", slug: "hyperliquid", category: "Finance", file: "hyperliquid.png" },
  { name: "iCloud", slug: "icloud", category: "Productivity", file: "icloud.svg" },
  { name: "Infisical", slug: "infisical", category: "Security", file: "infisical.png" },
  { name: "Instagram", slug: "instagram", category: "Marketing" },
  { name: "Kindle", slug: "kindle", category: "Productivity", file: "kindle.svg" },
  { name: "Kobbe", slug: "kobbe", category: "Productivity", file: "kobbe.png" },
  { name: "LinkedIn", slug: "linkedin", category: "Marketing", file: "linkedin.svg" },
  { name: "Luma", slug: "luma", category: "Marketing", file: "luma.png" },
  { name: "MaxFusion", slug: "maxfusion", category: "Productivity", file: "maxfusion.svg" },
  { name: "Photos", slug: "photos", category: "Productivity", file: "photos.png" },
  { name: "Postiz", slug: "postiz", category: "Marketing", file: "postiz.svg" },
  { name: "PostNitro", slug: "postnitro", category: "Marketing", file: "postnitro.png" },
  { name: "QuickBooks", slug: "quickbooks", category: "Finance", file: "quickbooks.svg" },
  { name: "Reddit", slug: "reddit", category: "Marketing", file: "reddit.svg" },
  { name: "Sales Navigator", slug: "sales-navigator", category: "Sales", file: "sales-navigator.svg" },
  { name: "ScreenshotOne", slug: "screenshotone", category: "Developer", file: "screenshotone.png" },
  { name: "Google Search Console", slug: "search-console", category: "Marketing", file: "search-console.svg" },
  { name: "Stacktree", slug: "stacktree", category: "Developer" },
  { name: "Threads", slug: "threads", category: "Marketing" },
  { name: "TikTok", slug: "tiktok", category: "Marketing", file: "tiktok.svg" },
  { name: "Trends.vc", slug: "trends-vc", category: "Marketing", file: "trends-vc.png" },
  { name: "Web Search", slug: "web-search", category: "Productivity", file: "web-search.svg" },
  { name: "Whole Foods", slug: "whole-foods", category: "Productivity", file: "whole-foods.png" },
  { name: "Whole Foods delivery", slug: "whole-foods-delivery", category: "Productivity", file: "whole-foods-delivery.png" },
  { name: "Xero", slug: "xero", category: "Finance", file: "xero.svg" },
  { name: "YouTube", slug: "youtube", category: "Marketing", file: "youtube.svg" },
  { name: "Zendesk", slug: "zendesk", category: "Support", file: "zendesk.svg" },
  { name: "Adanos Market Sentiment", slug: "adanos-market-sentiment", category: "Finance", href: "https://adanos.org" },
  { name: "Adlicio", slug: "adlicio", category: "Advertising", href: "https://mcp.tryadlicio.com/mcp" },
  { name: "Affonso", slug: "affonso", category: "Marketing", href: "https://docs.affonso.io/mcp/introduction" },
  { name: "arXiv", slug: "arxiv", category: "Data", href: "https://info.arxiv.org/help/api/user-manual.html" },
  { name: "Bento Chat", slug: "bento-chat", category: "Marketing", href: "https://bentonow.com/docs/integrations/mcp" },
  { name: "Bing", slug: "bing", category: "Marketing", file: "bing.svg", href: "https://learn.microsoft.com/en-us/bingwebmaster/getting-access" },
  { name: "Blender", slug: "blender", category: "Developer", href: "https://www.blender.org/lab/mcp-server/" },
  { name: "BulkPublish", slug: "bulkpublish", category: "Marketing", href: "https://mcp.bulkpublish.com/mcp" },
  { name: "ClickFlow", slug: "clickflow", category: "Marketing", href: "https://docs.clickflow.com/" },
  { name: "GitHub Actions", slug: "github-actions", category: "Developer", href: "https://docs.github.com/en/rest/actions" },
  { name: "Godot", slug: "godot", category: "Developer", href: "https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html" },
  { name: "Google Maps", slug: "google-maps", category: "Productivity", href: "https://developers.google.com/maps" },
  { name: "Google Search", slug: "google-search", category: "Productivity", href: "https://developers.google.com/custom-search/v1/overview" },
  { name: "HotMention", slug: "hotmention", category: "Sales", href: "https://hotmention.com/docs/mcp" },
  { name: "IndexNow", slug: "indexnow", category: "Marketing", file: "indexnow.png", href: "https://www.indexnow.org/documentation" },
  { name: "Nuvio", slug: "nuvio", category: "Finance", href: "https://developers.nuvio.io/" },
  { name: "OmniSocials", slug: "omnisocials", category: "Marketing", href: "https://docs.omnisocials.com/mcp-server" },
  { name: "Plaid", slug: "plaid", category: "Finance", href: "https://plaid.com/docs/resources/mcp/" },
  { name: "Post Bridge", slug: "post-bridge", category: "Marketing", href: "https://www.post-bridge.com/api/mcp/mcp" },
  { name: "Refgrow", slug: "refgrow", category: "Marketing", href: "https://refgrow.com/docs/mcp-server" },
  { name: "Soundcheck", slug: "soundcheck", category: "Productivity", href: "https://docs.soundchecklive.io/integrations/mcp-server" },
  { name: "Squarespace", slug: "squarespace", category: "Marketing", href: "https://developers.squarespace.com/" },
  { name: "Semrush", slug: "semrush", category: "Marketing", file: "semrush.svg", href: "https://developer.semrush.com/" },
  { name: "StayingAPI", slug: "stayingapi", category: "Data", href: "https://stayingapi.com/docs/mcp" },
  { name: "TranscriptAPI", slug: "transcriptapi", category: "Data", href: "https://transcriptapi.com/docs/mcp/" },
  { name: "Unity", slug: "unity", category: "Developer", href: "https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/manual/unity-mcp-overview.html" },
  { name: "VidEngineer", slug: "videngineer", category: "Marketing", href: "https://mcp.videngineer.com/mcp" },
  { name: "Yandex", slug: "yandex", category: "Marketing", file: "yandex.svg", href: "https://yandex.com/dev/webmaster/" },
  { name: "Zillapi", slug: "zillapi", category: "Data", href: "https://zillapi.com/" },
  { name: "Skillselion", slug: "skillselion", category: "Developer", href: "https://skillselion.com/skillselion-mcp" },
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
  googledocs: "google-docs",
  gdocs: "google-docs",
  googleads: "google-ads",
  gadwords: "google-ads",
  googleanalytics: "google-analytics",
  ga4: "google-analytics",
  analytics: "google-analytics",
  ahrefs: "ahrefs",
  instagram: "instagram",
  ig: "instagram",
  threads: "threads",
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
  "bot directory api": "bot-directory",
  botdirectoryapi: "bot-directory",
  "botdirectory api": "bot-directory",
  "google analytics 4": "google-analytics",
  "search console": "search-console",
  "google search console": "search-console",
  googlesearchconsole: "search-console",
  adanos: "adanos-market-sentiment",
  postbridge: "post-bridge",
  bento: "bento-chat",
  bentochat: "bento-chat",
  githubactions: "github-actions",
  googlemaps: "google-maps",
  soundchecklive: "soundcheck",
  cursor: "cursor-cloud-agents",
  googlesearch: "google-search",
  semrush: "semrush",
  yandex: "yandex",
  "yandex webmaster": "yandex",
  yandexwebmaster: "yandex",
  "yandex metrica": "yandex",
  yandexmetrica: "yandex",
  bing: "bing",
  "bing webmaster": "bing",
  bingwebmaster: "bing",
  indexnow: "indexnow",
  "index now": "indexnow",
  skillselion: "skillselion",
  "skillselion mcp": "skillselion",
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

/* Search terms beyond the catalog name, per slug. Someone hunting the
   calendar connector types "gcal" as often as "Google Calendar", and the
   alias table already knows that, so the finder should not have to guess. */
export function aliasesBySlug(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [alias, slug] of Object.entries(ALIASES)) {
    map.set(slug, [...(map.get(slug) ?? []), alias]);
  }
  return map;
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
    "Business and enterprise",
    "Cloud",
    "Data",
    "Developer",
    "Engineering",
    "Finance",
    "Marketing",
    "Productivity",
    "Sales",
    "Security",
    "Support",
  ];
  return order
    .map((category) => ({ category, entries: CONNECTOR_CATALOG.filter((e) => e.category === category) }))
    .filter((group) => group.entries.length > 0);
}
