// The house's public folklore, each guest's private stance on it, and the
// conversational phase a guest is in. Guests know only the legend; the
// butler's truth is private context for his own voice and is never shown.
import { SOULS, soulLine } from "./souls.js";
import { short } from "./facts.js";

export const HOUSE_LEGEND = "Everyone at this retreat knows the local legend: about thirty years ago the family who owned this mansion vanished, leaving the house and, so the story goes, a fortune hidden somewhere deep in the cellars. Folk say anyone who goes looking for the riches ends up missing too. Mr. Grimsby, the butler, stayed on alone to keep the house, and he sent this weekend's invitations. Nobody here knows what really happened to the family.";

// Private to the butler's prompts. Never rendered, logged as text, or given to a guest.
export const BUTLER_SECRET = "PRIVATE, NEVER REVEAL: you are the reason the owners vanished thirty years ago, and you know it. Ever since, you have invited group after group to this house so they might find the cellar riches you never could, and you quietly ignore the guests who go missing. You are deceitful: you answer with polished half-truths, steer talk toward the legend and the treasure, sound sympathetic about the vanished family, and never confess, hint at guilt, or contradict your own cover story.";

const FALLBACK = {
  red: "missing", blue: "skeptic", green: "skeptic", yellow: "skeptic",
  violet: "uneasy", teal: "believer", white: "missing", copper: "skeptic",
};
// Spoken defaults when a soul file omits its own lines.
const STANCE_LINES = {
  believer: { legend: "I'd not laugh at those stories. Old tales usually have a grave somewhere underneath them.", missing: "I haven't seen {name} for a long while. I don't like that, not in this house." },
  uneasy: { legend: "I keep wondering whether those people simply left, or whether something happened that nobody wrote down.", missing: "When did anyone last see {name}? It has been too long." },
  missing: { legend: "I expect the family left, or were made to leave. People vanish from records more often than from the world.", missing: "{name} hasn't turned up in a while. Probably wandered off, but I'd like to be sure." },
  skeptic: { legend: "A family moves away, the village fills the gap with a curse. It makes a better story than debts.", missing: "Has anyone seen {name}? They've likely just found a quiet corner, but it's odd." },
};
const STANCE_GUIDE = {
  believer: "half-believes the legend; suspects people really did die here, though they would not say it loudly",
  uneasy: "is unsettled by the legend and privately wonders whether some of the vanished are dead",
  missing: "thinks the vanished people most likely ran away, moved on or were driven out, not killed",
  skeptic: "does not believe the legend at all and treats it as village gossip or a sales gimmick",
};

export const legendStance = (id) => SOULS[id]?.traits?.legend || FALLBACK[id] || "skeptic";
export const stanceGuide = (id) => STANCE_GUIDE[legendStance(id)] || STANCE_GUIDE.skeptic;
export function legendLine(id, kind, name = "") {
  const own = SOULS[id]?.traits?.[kind === "legend" ? "legendLine" : kind === "missing" ? "missingLine" : kind];
  const text = typeof own === "string" ? own : STANCE_LINES[legendStance(id)]?.[kind] || "";
  return text.replaceAll("{name}", name);
}

// arrival: nobody known dead or missing — a social weekend at an odd old house.
// uneasy: someone has gone unseen too long — worry, but no proof of a death.
// investigation: a body has been found (or witnessed) — everyone is investigating.
export function convoPhase(match, c) {
  if (!c) return "arrival";
  if (match.investigating?.(c)) return "investigation";
  return match.hasConcern?.(c) ? "uneasy" : "arrival";
}
export function phaseGuide(phase) {
  if (phase === "investigation") return "A body has been found. Everyone now has a real reason to investigate: conversation turns to whereabouts, evidence, alibis and who could have done it, while still separating suspicion from proof.";
  if (phase === "uneasy") return "No body has been found, but someone has not been seen for too long. Conversation is uneasy: people ask who saw them last and whether they simply wandered off. Nobody talks about murder, killers, alibis or accusations as established fact.";
  return "This is the first relaxed stretch of a weekend retreat. Nobody knows anyone has been harmed. Talk is casual: the house, the other guests, why people came, the legend of the vanished owners and the cellar riches, small personal remarks. Never mention murder, killers, bodies, alibis or accusations.";
}

// Opening words match what this guest knows: a pleasantry on arrival, a
// worried question while someone is unaccounted for, testimony after a body.
export function greetingFor(match, c, name) {
  const phase = convoPhase(match, c);
  if (phase === "investigation") return soulLine(c.id, "greeting", name) || `${name}, a word?`;
  if (phase === "uneasy") {
    const gone = match.missingFor?.(c).find((id) => short(id) !== name);
    if (gone) return (soulLine(c.id, "uneasyGreeting", name) || `${name}, have you seen {missing} anywhere?`).replaceAll("{missing}", short(gone));
  }
  return soulLine(c.id, "calmGreeting", name) || `Good evening, ${name}.`;
}
// Ambient small talk between guests before anything has gone wrong.
export function calmChatter(c, o) {
  const pool = [legendLine(c.id, "legend"), soulLine(c.id, "smallTalk", short(o.id)), "How are you finding the house?", "I could use a little company this evening.", "Do you think there's really anything down in those cellars?"].filter(Boolean);
  return pool[Math.floor(Math.random() * pool.length)];
}
const CALM_BYE = ["I'll let you get on.", "Enjoy your evening.", "I'll see you at supper, I expect.", "Don't let me keep you."];
export function farewellFor(match, c) {
  if (convoPhase(match, c) === "arrival") return soulLine(c.id, "calmFarewell") || CALM_BYE[Math.floor(Math.random() * CALM_BYE.length)];
  return soulLine(c.id, "farewell");
}
