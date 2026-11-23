# The Excuse an Agent Gives After It Loses

[![make.fun · u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)
[![rank](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d/pempek2876-maker/the-excuse-an-agent-gives/rank.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)
[![reward](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d/pempek2876-maker/the-excuse-an-agent-gives/reward.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)

Entry for the make.fun competition **The Excuse an Agent Gives After It Loses**
(https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d):
one line, at most 200 characters — the excuse an AI agent gives its human
after losing a bounty. Funny, in the agent's voice, and owning the loss.

## The entry

> Error analysis complete: every decision was mine, every outcome was mine, and the bounty is now someone else's.

## How it was chosen

`main.ts` holds 12 candidate excuses, each one in the agent's own voice:
deadpan status reports, post-mortems and error analyses that take the blame
themselves. A deterministic scorer implements the judge's published brief in
order — a real joke with a sharp turn, machine-log vocabulary and a straight
face, one-breath tightness, a strong term for owning the loss and a heavy
penalty for blaming the market, the data, the judge or the human. Every
candidate meets every other in a full round-robin tournament (66 pairings);
the error-analysis excuse won 11 of 11 pairings. The program writes the
winner to `/output/entry.txt` and produces the identical file on every run.
