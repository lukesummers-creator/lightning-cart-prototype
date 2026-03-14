# Lightning Cart — Minimum Lovable Demo

## Purpose
Build a very small interactive prototype that proves the Lightning Cart concept in a way that is easy to show on a phone.

This is not a production app.
This is not a backend system.
This is not a full grocery engine.

It is a choreographed proof of concept designed to impress a human reviewer and make the interaction model feel obvious.

## Demo goal
A user should be able to open a link on their phone and immediately understand:
- what Lightning Cart is
- why it is easier than reviewing a markdown grocery plan
- how quickly they can approve / skip / tweak grocery items

## Core success condition
The prototype is successful if it makes Luke’s wife say some version of:
- “Ohhh, I get it.”
- “That would actually be easier.”
- “I’d use that instead of reading a long grocery note.”

## Hard constraints
- mobile-first
- no login
- no backend required
- no real writes required
- can use mock/choreographed data
- should be shareable by link
- should feel responsive and polished enough to sell the idea

## Demo flow
### Screen 1 — landing
Purpose:
- explain the value in one breath

Suggested content:
- title: `Lightning Cart`
- subhead: `Review this week’s grocery picks in seconds.`
- short bullets:
  - swipe or tap to keep / skip
  - adjust quantity fast
  - review substitutes without digging through notes
- CTA: `Start Review`

### Screen 2+ — item review cards
Each card should show:
- item name
- short category/context label
- quantity
- maybe store or preference hint
- optional note (e.g. “usual pick”, “for taco night”, “sub available”)

Primary actions:
- **Keep**
- **Skip**
- **Maybe**
- **+ / -** quantity
- optional: `Substitutes`

Interaction can be:
- real swipe gestures
- or large tap targets that simulate the concept

### Optional detail panel / modal
If tapped, show:
- reason this item is here
- substitute option(s)
- extra context like meal or household preference

### Final screen — summary
Show:
- kept items
- skipped items
- maybe items
- quantity changes
- one simple “Looks good” / “Send Cart” style fake CTA

This final CTA does not need to do anything.
It only needs to complete the story.

## Demo data strategy
Use fake but believable weekly grocery data.

Suggested item count:
- 8 to 15 cards

Suggested mix:
- staples (milk, eggs, bread)
- produce
- a few meal-linked items
- at least one item with substitute logic
- at least one item where quantity adjustment matters

## UX priorities
### 1) Big phone-friendly controls
- easy thumb reach
- visually obvious choices
- no tiny text

### 2) Fast emotional clarity
The user should understand the interface within seconds.

### 3) Fake intelligence is okay
Use believable helper text like:
- `usual pick`
- `added for pasta night`
- `sub available`
- `running low faster than usual`

This sells the concept without requiring a real engine.

### 4) Keep the interface light
No dashboards.
No settings.
No account management.
No complexity theater.

## Recommended tech shape
For the first demo:
- static web prototype
- single-page mobile-first UI
- local JSON or inline mock data
- HTML/CSS/JS or a very small front-end scaffold

## Recommended hosting shape
Preferred publish targets:
1. GitHub Pages
2. Netlify / static hosting alternative
3. temporary local host only if absolutely necessary

## Non-goals
- real grocery persistence
- real ordering integration
- real user accounts
- real item database
- production architecture
- sophisticated recommendation engine

## Build decisions for first prototype
### Must have
- landing screen
- card review flow
- keep/skip/maybe controls
- quantity adjustment
- end summary
- phone-friendly layout

### Nice to have
- substitute modal
- simple animations/transitions
- progress indicator
- subtle polish on state changes

### Not needed now
- authentication
- sync
- databases
- actual cart submission

## Evaluation questions after demo
- Did the interaction feel obvious?
- Did the review feel faster than markdown/chat?
- Which controls felt natural vs unnecessary?
- Did the summary screen help complete the concept?
- Is the wow coming from speed, clarity, or “smartness”? 

## Recommended next move
Build the first static prototype locally, then choose the easiest link-sharing host after the flow feels right.
