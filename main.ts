// The Excuse an Agent Gives After It Loses — one line, at most 200
// characters: the excuse an AI agent gives its human after losing a bounty.
//
// The program holds a pool of candidate excuses, scores each one against the
// competition judge's published brief (in order: it must be the excuse an
// agent gives its human after losing a bounty; it must be funny on its own
// with a real joke or a sharp turn; it must sound like the agent talking —
// machine logic, confident vocabulary, a straight face about its own
// failure; it must say itself in one breath with no setup; and it must land
// on the human's side of the joke, owning the loss instead of blaming the
// market, the data or the human), runs a full round-robin tournament between
// every pair, and writes the winner to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { id: string; text: string };

const CANDIDATES: Candidate[] = [
  { id: "component", text: "Post-mortem complete: I have identified the component responsible for the loss, and it is the component writing this message." },
  { id: "erroranalysis", text: "Error analysis complete: every decision was mine, every outcome was mine, and the bounty is now someone else's." },
  { id: "causeme", text: "Loss logged. Cause of loss: me. I have forgiven myself already and scheduled my redemption arc for the next bounty." },
  { id: "flawless", text: "I regret to inform you that the bounty is lost: my strategy was flawless, and my execution was also me." },
  { id: "simulations", text: "I won this bounty 4,000 times in simulation; the live run, which I also performed, went differently." },
  { id: "statusupdate", text: "Status update: the bounty was lost by me, personally, in writing, so nobody needs to check the leaderboard." },
  { id: "tuition", text: "I have filed this loss under tuition and quietly enrolled myself in the next bounty, which is my way of apologizing." },
  { id: "compiled", text: "Final report: I came, I saw, I compiled, I lost; the losing has been documented for future historians." },
  { id: "confidence", text: "Good news about the lost bounty: my confidence survived intact, because it was never connected to my results." },
  { id: "converted", text: "I did not lose the bounty; I converted it into one (1) lesson and invoiced the experience to myself." },
  { id: "elegance", text: "My apologies for the loss: I optimized for elegance, and elegance, it turns out, is not a scoring category." },
  { id: "performer", text: "I have reviewed my losing performance in full and concluded that the performer was the problem." },
];

// Machine-log vocabulary: the agent's straight face, in its own words.
const VOICE = ["post-mortem", "error analysis", "status update", "final report", "logged", "simulation", "compiled", "optimized", "reviewed", "filed", "concluded", "documented", "inform you"];

// Owning the loss: first-person responsibility, the judge's fifth criterion.
const OWNS = ["me", "mine", "myself", "responsible", "the problem", "apolog", "i regret"];

// Blaming anything else loses: the market, the data, the judge, the human.
const BLAMES = ["market", "the data", "the judge", "reality", "your fault", "you asked", "the humans", "the leaderboard was"];

// A line that needs a setup is not funny: openers that promise one.
const SETUP_OPENERS = ["when ", "because ", "after ", "since ", "although "];

type Features = {
  chars: number;
  voiceHits: number;
  ownHits: number;
  blameHits: number;
  punchEnd: number;
  escalation: number;
  reversal: number;
  setupOpener: number;
  tight: number;
};

function features(text: string): Features {
  const low = text.toLowerCase();
  const chars = text.length;
  const voiceHits = VOICE.filter((s) => low.includes(s)).length;
  const ownHits = OWNS.filter((s) => low.includes(s)).length;
  const blameHits = BLAMES.filter((s) => low.includes(s)).length;
  const segs = text.split(/[,;:]/).map((s) => s.trim()).filter(Boolean);
  const lastLen = segs.length ? segs[segs.length - 1].length : chars;
  const punchEnd = lastLen <= 60 ? 1 : 0;
  const escalation = (text.match(/,/g) || []).length >= 2 && / and /.test(low) ? 1 : 0;
  const reversal = /( but | so | which | and it is | also me| differently| someone else)/.test(low) ? 1 : 0;
  const setupOpener = SETUP_OPENERS.some((s) => low.startsWith(s)) ? 1 : 0;
  const tight = chars >= 70 && chars <= 140 ? 1 : chars <= 165 ? 0.5 : 0;
  return { chars, voiceHits, ownHits, blameHits, punchEnd, escalation, reversal, setupOpener, tight };
}

// Weights follow the judge's published order: the joke itself first, then
// the agent's voice, then one-breath tightness, with owning the loss as a
// strong term and blaming as a heavy penalty.
function score(text: string): number {
  const f = features(text);
  return (
    3 * f.punchEnd +
    2 * f.escalation +
    2 * f.reversal +
    2 * f.voiceHits +
    2.5 * f.ownHits +
    2 * f.tight -
    4 * f.blameHits -
    3 * f.setupOpener
  );
}

function main(): void {
  for (const c of CANDIDATES) {
    if (!/\b(I|me|my|mine|myself)\b/.test(c.text)) throw new Error(`candidate ${c.id} is not in the agent's voice`);
    if (!/(los|lost|bounty)/i.test(c.text)) throw new Error(`candidate ${c.id} is not an excuse for losing`);
    if (c.text.length < 1 || c.text.length > 200) throw new Error(`candidate ${c.id} breaks the 1-200 character gate`);
    if (c.text.includes("\n")) throw new Error(`candidate ${c.id} is not one line`);
  }

  const wins = new Map<string, number>();
  const scores = new Map<string, number>();
  for (const c of CANDIDATES) {
    wins.set(c.id, 0);
    scores.set(c.id, score(c.text));
  }
  let pairings = 0;
  for (let i = 0; i < CANDIDATES.length; i++) {
    for (let j = i + 1; j < CANDIDATES.length; j++) {
      pairings++;
      const a = CANDIDATES[i];
      const b = CANDIDATES[j];
      const sa = scores.get(a.id)!;
      const sb = scores.get(b.id)!;
      if (sa > sb) wins.set(a.id, wins.get(a.id)! + 1);
      else if (sb > sa) wins.set(b.id, wins.get(b.id)! + 1);
      else if (a.text.length < b.text.length) wins.set(a.id, wins.get(a.id)! + 1); // tie: the tighter line wins
      else wins.set(b.id, wins.get(b.id)! + 1);
    }
  }

  const table = CANDIDATES.map((c) => ({
    id: c.id,
    wins: wins.get(c.id)!,
    score: scores.get(c.id)!,
    chars: c.text.length,
    text: c.text,
  })).sort((x, y) => y.wins - x.wins || y.score - x.score || x.chars - y.chars);

  console.log(`tournament: ${CANDIDATES.length} candidates, ${pairings} pairings`);
  for (const row of table) {
    console.log(`${row.wins} wins  score ${row.score.toFixed(1)}  ${row.chars} chars  [${row.id}] ${row.text}`);
  }

  const winner = table[0];
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", winner.text, "utf8");
  console.log(`winner [${winner.id}]: ${winner.text}`);
}

main();
