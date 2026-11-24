# Relay Redesign 🏃‍♀️📱

12 everyday Berkeley apps, each a little clunky. In 4 quick rounds you'll pass screens around the room and make them better with Claude Code.

## Setup (before class)

```bash
git clone https://github.com/jejeruswan/relay-redesign.git && cd relay-redesign && npm install && chmod +x relay
```

Then start the app and open it in **Expo Go** on your phone (scan the QR code). This project uses **Expo SDK 58**, so update Expo Go from the App Store or Play Store first.

```bash
npx expo start
```

## In class

1. Save your number and the total number of people (your instructor will tell you both):
   ```bash
   ./relay setup 3 10
   ```
2. Go to your first screen:
   ```bash
   ./relay start
   ```
   The banner tells you your round, your screen, and the focus.
3. In the app, tap your screen. Then use Claude Code to improve it, staying on this round's focus.
4. When your instructor says to push: let Claude Code finish (or press Esc), **take a screenshot of your screen on your phone**, then run:
   ```bash
   ./relay next
   ```
   This saves and sends your work, then moves you to your next screen. Type `/clear` in Claude Code and repeat from step 3.

Lost? `./relay status` shows where you are.

## Round themes

| Round | Focus | Ask yourself |
| --- | --- | --- |
| 1 | **Hierarchy** | What should my eye land on first? Does the main action stand out? |
| 2 | **Spacing and type** | Is there a consistent spacing scale? Just a few text styles? |
| 3 | **Color and polish** | Fewer colors, readable contrast, no borders or shadows that aren't doing a job |
| 4 | **Feel** | Press states, haptics, motion, loading and empty states, 44pt tap targets |

## The one rule

**Only edit your own screen file**, `app/screens/screen-N.tsx` for the screen in your banner. Don't touch other screens, `package.json`, or the `relay` script, and don't install packages. That's how everyone works at once with zero merge conflicts.
