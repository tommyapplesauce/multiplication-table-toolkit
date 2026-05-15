# Multiplication Table Toolkit — Locker Pattern Mystery

A standalone children's web app for exploring multiplication tables through a school-locker mystery. The child counts the letters in a hidden name, uses that count to unlock a sequence, and then sees the matching multiplication table as a compressed digit loop that expands into full products.

## What it teaches

The app follows the toolkit loop:

1. **Observe** the hallway/locker scene.
2. **Compress** the hidden name into a letter count.
3. **Predict** how many lock or Trapper Keeper dials are needed.
4. **Expand** the count into the matching multiplication table.
5. **Validate** the answer with the displayed products and wrap notes.

The key child-facing rule is:

> When the ones digit loops back down, the tens digit steps up.

## Run locally

```bash
npm start
```

Then open <http://127.0.0.1:4173>.

Because the app is plain HTML, CSS, and JavaScript, it can also be opened directly from `index.html` in a browser.

## Source assets

The app is wired to use image assets from `assets/source_assets` when they are present, with CSS fallbacks if an asset has not been downloaded locally yet.

Expected folders:

```text
assets/source_assets/
  backgrounds/          # view 1 through view 6 hallway/locker/trapper backgrounds
  dial/                 # main dial artwork
    perspective/        # 17 dial positions, including center dial 9
  hand with paper/      # hand-and-paper clue artwork
  lock/                 # lock body, locked shackle, popped-open shackle
```

The Trapper Keeper dial layout starts with dial 9 as the exact middle and spreads additional letter dials outward from that center position.

## Test

```bash
npm test
```

The tests verify table accuracy, ones-digit cycles, wrap detection, 2s and 9s anchor behavior, name-length counting, dial placement, and expected asset path candidates.
