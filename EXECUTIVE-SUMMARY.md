# Lightning Cart — Executive Summary

## What it is
Lightning Cart is a mobile-first grocery review interface for fast human approval/redlining of a proposed weekly grocery order.

Think:
- swipe/tap review
- keep / remove / adjust quantity / inspect substitutes
- optimized for quick decision-making while mobile or busy

## Why it matters
The current Groceries V2 workflow is proving the planning logic in markdown and chat.
That is the right first step.

But once the planning model is stable, the review experience can be dramatically improved with a purpose-built interface.

Lightning Cart is the productized review layer.

## Core value
It turns grocery review from:
- reading markdown
- sending back redlines in chat
- mentally tracking quantities and substitutions

Into:
- fast mobile review
- low-friction approvals
- clear quantity control
- visible substitute handling

## Proposed interaction model
- **Left** → remove item
- **Right** → keep item
- **Up** → view substitutes / similar products
- **+ / -** → adjust quantity
- **Tap** → details / notes / exact ordering info

## Why this is compelling
- mobile-native
- easy for non-technical household members
- much faster than editing docs
- visually intuitive
- pairs well with the planning/order split already emerging in Groceries V2

## What Lightning Cart is NOT (yet)
- not the first priority over Groceries V2 hardening
- not the current review surface
- not a replacement for the underlying grocery logic

It is a future-state review/product layer that should be built **after** the workflow and data model are proven.

## Relationship to Groceries V2
Groceries V2 proves:
- planning logic
- recurring reorder logic
- meal planning structure
- exact-item spine
- review/output shape

Lightning Cart would sit on top of that as the review UX.

## R&D status
This belongs in R&D / incubator for now.
It is worth prototyping once Groceries V2 is stable enough that the UI would not just freeze bad assumptions into software.
