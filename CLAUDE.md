# Relay Redesign: rules for Claude Code

This repo is a classroom design relay. Each git branch `screen-N` belongs to exactly one screen file, `app/screens/screen-N.tsx`. Students take turns improving screens in 4 short rounds.

## Find the current screen first
Run `git branch --show-current`. If it prints `screen-7`, the ONLY file you may edit is `app/screens/screen-7.tsx`. (`./relay status` also shows the screen and this round's focus.)

## Hard rules
- Only edit the screen file for the current branch. Never edit other screens, `app/index.tsx`, `app/_layout.tsx`, `package.json`, `app.json`, `tsconfig.json`, the `relay` script, or any other shared file.
- Never create new files. No shared components, theme files or helpers. Everything stays inside the one screen file.
- Never install, add, remove or upgrade packages (no `npm install`, `npx expo install`, etc.). Use only what is already installed and works in Expo Go: `react-native`, `@expo/vector-icons`, `expo-haptics`, `react-native-reanimated`, `expo-blur`, `expo-linear-gradient`, `react-native-safe-area-context`, `react-native-gesture-handler`.
- Keep the mock data hardcoded in the same file. No network calls, no remote images (use plain gray Views as image placeholders).
- Don't run git commands that commit, push, pull, stash, reset or switch branches. The student's `./relay` script handles all of that.

## How to help
- Look at the screen with fresh eyes and name the specific problems you see before changing anything.
- Prefer specific, implementable design changes ("make the amount due 32pt semibold and move the Pay button to a full-width bar at the bottom") over vague advice ("improve the hierarchy").
- Focus on this round's theme: 1 hierarchy, 2 spacing and type, 3 color and polish, 4 feel (press states, haptics, motion, loading and empty states). Other fixes are fine if they're small.
- Tap targets should be at least 44 points. In React Native that's a `minHeight` or `minWidth` of 44 (or `hitSlop` for small icons).
- Keep the screen working: every button should still do something, and the file must still type-check.
- Keep changes reviewable. This round is about 5 minutes long.
- After making changes, remind the student to check the result in Expo Go on their phone or in the simulator.
