import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONNECTOR_CATALOG } from "../src/lib/connectors";
import { catalogFamilyCoverage, connectorFamily } from "../src/lib/connector-families";
import { createBotName, grokBotName, grokDisplayBotName, grokMemberName, grokRoomName, grokTeamName } from "../src/lib/grok-names";
import { buildPrompt, defaultState, modeRule } from "../src/lib/customize";
import { installerPrompt } from "../src/lib/installer";
import { site } from "../src/lib/site";
import { getBot, getTeam } from "../src/lib/teams";

describe("create names", () => {
  it("builds team member names as Team - Role Bot, with no Grok and no middle dot", () => {
    assert.equal(grokMemberName("Company team", "Company · Product"), "Company Team - Product Bot");
    assert.equal(grokMemberName("Company team", "Coding"), "Company Team - Coding Bot");
    assert.equal(createBotName("team", "Company team", "Company · Product"), "Company Team - Product Bot");
    assert.equal(grokMemberName("Company Team", "Company Team - Product Bot"), "Company Team - Product Bot");
    assert.doesNotMatch(grokMemberName("Company team", "Product"), /Grok/);
    assert.doesNotMatch(grokMemberName("Company team", "Product"), /·/);
  });

  it("builds solo Bot names as Name Bot, still without Grok", () => {
    assert.equal(grokBotName("Inbox Manager"), "Inbox Manager Bot");
    assert.equal(grokBotName("Inbox Manager Grok Bot"), "Inbox Manager Bot");
    assert.equal(createBotName("bot", "Inbox Manager", "Inbox Manager"), "Inbox Manager Bot");
    assert.doesNotMatch(grokBotName("Inbox Manager"), /Grok/);
  });

  it("keeps website display names as Role Grok Bot", () => {
    assert.equal(grokDisplayBotName("Company · Product"), "Product Grok Bot");
    assert.equal(grokDisplayBotName("Inbox Manager"), "Inbox Manager Grok Bot");
  });

  it("keeps group chat names ending in group chat", () => {
    assert.equal(grokRoomName("Company group chat"), "Company group chat");
    assert.equal(grokRoomName("Company HQ"), "Company HQ group chat");
    assert.match(grokRoomName("Company"), /group chat$/);
  });
});

describe("connector families", () => {
  it("assigns a verb family to every CONNECTOR_CATALOG slug", () => {
    const coverage = catalogFamilyCoverage();
    assert.equal(coverage.length, CONNECTOR_CATALOG.length);
    const missing = CONNECTOR_CATALOG.filter((entry) => {
      try {
        connectorFamily(entry.slug);
        return false;
      } catch {
        return true;
      }
    }).map((entry) => entry.slug);
    assert.deepEqual(missing, []);
  });

  it("prints family sentences from modeRule", () => {
    const github = modeRule("GitHub", "draft");
    assert.match(github, /Draft the PR or branch/i);
    assert.match(github, /never merge/i);
    assert.doesNotMatch(github, /unsaved/i);

    const gmail = modeRule("Gmail", "draft");
    assert.match(gmail, /do not send/i);
    assert.doesNotMatch(gmail, /unsaved/i);

    const stripe = modeRule("Stripe", "read");
    assert.match(stripe, /read-only/i);
    assert.match(stripe, /Never move funds/);
  });

  it("fails when a catalog slug has no family", () => {
    assert.throws(() => connectorFamily("not-a-catalog-connector"), /no verb family/);
  });
});

describe("installer prompt", () => {
  it("is buildPrompt with the stock recipe state", () => {
    const team = getTeam("company");
    assert.ok(team);
    assert.equal(installerPrompt(team), buildPrompt(team, defaultState(team), site.url, site.github));
  });

  it("shapes a Company team paste", () => {
    const team = getTeam("company");
    assert.ok(team);
    const prompt = installerPrompt(team);

    for (const role of ["Product", "Coding", "Findability", "Marketing", "Trust", "Money"]) {
      assert.match(prompt, new RegExp(`### Company Team - ${role} Bot`));
    }
    assert.match(prompt, /### Company group chat/);

    const createHeading = prompt.indexOf("## 1. Create these Bots");
    const groupHeading = prompt.indexOf("## 2. Create this group chat");
    const humanHeading = prompt.indexOf("## Human steps");
    assert.ok(createHeading >= 0);
    assert.ok(groupHeading > createHeading);
    assert.ok(humanHeading > groupHeading);
    const roster = prompt.slice(createHeading, groupHeading);
    assert.doesNotMatch(roster, /Grok/);
    assert.doesNotMatch(roster, /Company · /);
    assert.doesNotMatch(prompt, /\(Named /);
    assert.doesNotMatch(prompt, /If you create this Bot from an existing Bot/);
    assert.doesNotMatch(prompt, /unsaved/i);

    const githubLine = prompt.split("\n").find((line) => line.startsWith("- GitHub:"));
    assert.ok(githubLine);
    assert.match(githubLine, /Draft the PR or branch/i);
    assert.match(githubLine, /never merge/i);

    const gmailLine = prompt.split("\n").find((line) => line.startsWith("- Gmail:"));
    assert.ok(gmailLine);
    assert.match(gmailLine, /do not send/i);

    const stripeLine = prompt.split("\n").find((line) => line.startsWith("- Stripe:"));
    assert.ok(stripeLine);
    assert.match(stripeLine, /Never move funds/);

    assert.match(prompt, /If a skill is already installed on the account \(Settings → Plugins → Yours\), use it/);
    assert.match(prompt, /fetch or load it through the Skillselion connector using the skill id/);
    assert.doesNotMatch(prompt, /Enable the ones listed here for the named Bots/);

    const afterHuman = prompt.slice(humanHeading);
    const sidebarSection = grokTeamName(team.name);
    assert.equal(sidebarSection, "Company Team");
    assert.match(afterHuman, /Set each Bot avatar/);
    assert.match(afterHuman, new RegExp(`Create a sidebar section named exactly: ${sidebarSection}`));
    assert.match(afterHuman, new RegExp(`I have created section "${sidebarSection}"`));
    assert.match(afterHuman, /Settings → Plugins, disable the write tools/);
    assert.match(afterHuman, /Leave notifications on/);
    assert.doesNotMatch(prompt, /Founder OS/);
    assert.doesNotMatch(roster, /set the avatar/i);
    assert.ok(humanHeading > prompt.indexOf("## 5. Skills"));
  });

  it("shapes a solo Bot paste", () => {
    const bot = getBot("xai-inbox-manager");
    assert.ok(bot);
    const prompt = installerPrompt(bot);

    assert.match(prompt, /### Inbox Manager Bot/);
    assert.match(prompt, /Set up a new Bot for me called Inbox Manager Bot/);
    assert.doesNotMatch(prompt, /Inbox Manager Grok Bot/);
    assert.doesNotMatch(prompt, /If you create this Bot from an existing Bot/);
    assert.doesNotMatch(prompt, /\(Named /);
    assert.doesNotMatch(prompt, /Create a sidebar section/);
    assert.match(prompt, /Do not create a group chat/);

    const gmailLine = prompt.split("\n").find((line) => line.startsWith("- Gmail:"));
    assert.ok(gmailLine);
    assert.match(gmailLine, /do not send/i);

    assert.match(prompt, /If a skill is already installed on the account \(Settings → Plugins → Yours\), use it/);
    assert.match(prompt, /fetch or load it through the Skillselion connector using the skill id/);

    const humanHeading = prompt.indexOf("## Human steps");
    assert.ok(humanHeading > prompt.indexOf("## 5. Skills"));
    const afterHuman = prompt.slice(humanHeading);
    assert.match(afterHuman, /Set each Bot avatar/);
    assert.doesNotMatch(afterHuman, /sidebar section/);
    assert.match(afterHuman, /Leave notifications on/);
  });

  it("does not print Named even after a Customize rename", () => {
    const team = getTeam("company");
    assert.ok(team);
    const state = defaultState(team);
    state.names["Company · Product"] = "Growth";
    const prompt = buildPrompt(team, state, site.url, site.github);
    assert.match(prompt, /### Company Team - Growth Bot/);
    assert.doesNotMatch(prompt, /\(Named /);
  });

  it("does not use em dashes in generated prompt text", () => {
    const team = getTeam("company");
    const bot = getBot("xai-inbox-manager");
    assert.ok(team);
    assert.ok(bot);
    assert.doesNotMatch(installerPrompt(team), /—/);
    assert.doesNotMatch(installerPrompt(bot), /—/);
  });
});
