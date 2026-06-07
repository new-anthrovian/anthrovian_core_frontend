/* =============================================================
   "Sundiata's Rise" state machine.

   useReducer pattern. The reducer is PURE — all side effects
   (localStorage saves, decision sync) live in PlayClient.

   Ending logic is built from the script appendix (v1.0), priority
   order: secret -> balanced -> dominant -> fallback.
   ============================================================= */

import type {
  GameState,
  VariableScores,
  Variable,
  EndingId,
  ChoiceKey,
  PlayerTheme,
} from "./types";
import {
  SCENES,
  ENDINGS,
  LEGACY_CHOICE,
  getScene,
  isScoredScene,
} from "./story-data";

/** Choice 10 is offered only if the player finishes Act III in under 18 minutes. */
export const LEGACY_TIME_LIMIT_MS = 18 * 60 * 1000;

/**
 * How many scenes are currently playable. Currently SCENES.length (9) —
 * every scene 1–9 is reachable, including Scene 9 (Final Moral Choice).
 *
 * Scene 9 setup + the 6 endings + the Amina teaser render as text-only
 * for now (no video assets delivered yet — same fallback Iron Rod used
 * before its video landed). When the videos arrive, slot them back into
 * story-data and the text fallbacks step aside automatically.
 *
 * With ACTIVE_SCENE_COUNT === SCENES.length, the reducer's BRANCH_ENDED
 * case flows past the act_interlude branch into legacy (if under the
 * 18-minute Choice-10 window) or directly into the ending.
 */
export const ACTIVE_SCENE_COUNT = SCENES.length;

/* ---------- Initial state ---------- */

export const initialGameState: GameState = {
  version: 2,
  phase: "griot_intro",
  playerName: null,
  playerEmail: null,
  playerTheme: null,
  sceneIndex: 0,
  scores: { badenya: 0, fadenya: 0, nyama: 0 },
  tags: [],
  history: [],
  pendingBranch: null,
  lastIncreasedVar: null,
  startedAt: null,
  showLegacy: false,
  legacyTag: null,
  endingId: null,
  unlocksAmina: false,
};

/* ---------- Actions ---------- */

export type GameAction =
  | { type: "START_INTRO" }
  | { type: "INTRO_VIDEO_ENDED" }
  | { type: "SET_PLAYER_NAME"; name: string }
  | { type: "SET_PLAYER_EMAIL"; email: string }
  | { type: "NAME_CAPTURE_DONE" }
  | { type: "EMAIL_CAPTURE_DONE" }
  | { type: "SELECT_THEME"; theme: PlayerTheme }
  | { type: "SCENE_VIDEO_ENDED" }
  | { type: "MAKE_CHOICE"; choiceKey: ChoiceKey }
  | { type: "BRANCH_ENDED" }
  | { type: "CINEMATIC_TAP" }
  | { type: "PORTAL_DONE" }
  | { type: "MAKE_LEGACY_CHOICE"; choiceKey: ChoiceKey }
  | { type: "ADVANCE_TO_REFLECTION" }
  | { type: "SHOW_AMINA" }
  | { type: "REWATCH_SETUP" }
  | { type: "RESTART" }
  | { type: "LOAD_SAVE"; state: GameState };

/* ---------- Reducer ---------- */

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_INTRO":
      return {
        ...initialGameState,
        phase: "griot_intro",
        startedAt: Date.now(),
      };

    case "INTRO_VIDEO_ENDED":
      return { ...state, phase: "name_capture" };

    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.name.trim() || null };

    case "SET_PLAYER_EMAIL":
      return { ...state, playerEmail: action.email.trim().toLowerCase() || null };

    case "NAME_CAPTURE_DONE":
      return { ...state, phase: "email_capture" };

    case "EMAIL_CAPTURE_DONE":
      return { ...state, phase: "personalization" };

    case "SELECT_THEME": {
      const themeTag = action.theme;
      return {
        ...state,
        playerTheme: action.theme,
        tags: state.tags.includes(themeTag)
          ? state.tags
          : [...state.tags, themeTag],
        sceneIndex: 0,
        phase: "portal_transition",
      };
    }

    case "PORTAL_DONE": {
      const scene = SCENES[state.sceneIndex];
      if (!scene) return state;
      return {
        ...state,
        phase: scene.isCinematic ? "cinematic" : "scene",
      };
    }

    case "SCENE_VIDEO_ENDED": {
      const scene = SCENES[state.sceneIndex];
      if (!scene) return state;
      // Non-cinematic scenes are all scored — show the choice layer.
      return { ...state, phase: "choice" };
    }

    case "MAKE_CHOICE": {
      const scene = SCENES[state.sceneIndex];
      const option = scene?.choices?.find((c) => c.key === action.choiceKey);
      if (!scene || !option) return state;

      return {
        ...state,
        scores: applyImpact(state.scores, option.impact),
        tags: [...state.tags, ...(option.tags ?? [])],
        history: [
          ...state.history,
          { sceneId: scene.id, choiceKey: action.choiceKey },
        ],
        pendingBranch: { sceneId: scene.id, choiceKey: action.choiceKey },
        lastIncreasedVar: dominantImpactVar(option.impact),
        phase: "branch",
      };
    }

    case "BRANCH_ENDED": {
      const nextIndex = state.sceneIndex + 1;
      const cleared = { ...state, pendingBranch: null };

      // More playable scenes in this build.
      if (nextIndex < ACTIVE_SCENE_COUNT) {
        return {
          ...cleared,
          sceneIndex: nextIndex,
          phase: "portal_transition",
        };
      }

      // End of the playable range. (Act I only for now -> interlude.
      // When ACTIVE_SCENE_COUNT === SCENES.length this becomes the Act III
      // finish: the Choice 10 gate / ending resolution below takes over.)
      if (ACTIVE_SCENE_COUNT < SCENES.length) {
        return { ...cleared, phase: "act_interlude" };
      }

      const elapsed =
        state.startedAt != null ? Date.now() - state.startedAt : 0;
      const showLegacy = elapsed < LEGACY_TIME_LIMIT_MS;
      if (showLegacy) {
        return { ...cleared, showLegacy: true, phase: "legacy" };
      }
      return {
        ...cleared,
        showLegacy: false,
        ...resolveEnding(cleared),
        phase: "ending",
      };
    }

    case "CINEMATIC_TAP": {
      const nextIndex = state.sceneIndex + 1;
      if (nextIndex < ACTIVE_SCENE_COUNT) {
        return { ...state, sceneIndex: nextIndex, phase: "portal_transition" };
      }
      // Cinematic was the last playable scene (Act I ends on the baobab).
      if (ACTIVE_SCENE_COUNT < SCENES.length) {
        return { ...state, phase: "act_interlude" };
      }
      return state;
    }

    case "MAKE_LEGACY_CHOICE": {
      const option = LEGACY_CHOICE.options.find(
        (o) => o.key === action.choiceKey
      );
      if (!option) return state;
      const withTag = {
        ...state,
        legacyTag: option.tag,
        tags: [...state.tags, option.tag],
      };
      return { ...withTag, ...resolveEnding(withTag), phase: "ending" };
    }

    case "ADVANCE_TO_REFLECTION":
      return { ...state, phase: "reflection" };

    case "SHOW_AMINA":
      return { ...state, phase: "amina" };

    // Re-watch the current scene's setup video from the choice screen.
    // Lossless — scores, tags and history are untouched.
    case "REWATCH_SETUP":
      return state.phase === "choice"
        ? { ...state, phase: "scene" }
        : state;

    case "RESTART":
      return { ...initialGameState };

    case "LOAD_SAVE":
      return { ...action.state };

    default:
      return state;
  }
}

/* ---------- Ending resolution ---------- */

function resolveEnding(
  state: GameState
): Pick<GameState, "endingId" | "unlocksAmina"> {
  const endingId = determineEnding(state);
  return { endingId, unlocksAmina: ENDINGS[endingId].unlocksAmina };
}

/**
 * Priority: secret -> balanced -> dominant -> fallback.
 * Called only after all 8 scored choices are recorded.
 */
export function determineEnding(state: GameState): EndingId {
  const { badenya, fadenya, nyama } = state.scores;
  const max = Math.max(badenya, fadenya, nyama);

  // 1. SECRET — The Mother's Hidden Lion.
  // Max Badenya + the seed/exile tags + every scored choice was the
  // Badenya-impact option. (Choice 1's Badenya option is A; Choices
  // 2-9 it is B — so this is checked by impact, never by key.)
  const scoredHistory = state.history.filter((h) => isScoredScene(h.sceneId));
  const allBadenyaChoices =
    scoredHistory.length > 0 &&
    scoredHistory.every((h) => {
      const opt = getScene(h.sceneId)?.choices?.find(
        (c) => c.key === h.choiceKey
      );
      return (opt?.impact.badenya ?? 0) > 0;
    });
  if (
    badenya === max &&
    state.tags.includes("BADENYA_SEED_PLANTED") &&
    state.tags.includes("QUIET_EXILE") &&
    allBadenyaChoices
  ) {
    return "mothers_hidden_lion";
  }

  // 2. BALANCED — The True Lion King (min +2 in all three).
  if (badenya >= 2 && fadenya >= 2 && nyama >= 2) {
    return "true_lion_king";
  }

  // 3. DOMINANT — +4 or more AND strictly the highest.
  if (fadenya >= 4 && fadenya > badenya && fadenya > nyama) return "iron_lion";
  if (badenya >= 4 && badenya > fadenya && badenya > nyama) return "wise_builder";
  if (nyama >= 4 && nyama > badenya && nyama > fadenya) return "sorcerer_king";

  // 4. FALLBACK — The Seeking Son (also the script's literal "all below +2").
  return "seeking_son";
}

/* ---------- Score helpers ---------- */

function applyImpact(
  scores: VariableScores,
  impact: Partial<VariableScores>
): VariableScores {
  return {
    badenya: scores.badenya + (impact.badenya ?? 0),
    fadenya: scores.fadenya + (impact.fadenya ?? 0),
    nyama: scores.nyama + (impact.nyama ?? 0),
  };
}

/** The single variable a choice option awards (used to pulse the visualizer). */
function dominantImpactVar(impact: Partial<VariableScores>): Variable | null {
  if ((impact.badenya ?? 0) > 0) return "badenya";
  if ((impact.fadenya ?? 0) > 0) return "fadenya";
  if ((impact.nyama ?? 0) > 0) return "nyama";
  return null;
}

export function getDominantVariable(scores: VariableScores): Variable {
  const { badenya, fadenya, nyama } = scores;
  if (badenya >= fadenya && badenya >= nyama) return "badenya";
  if (fadenya >= badenya && fadenya >= nyama) return "fadenya";
  return "nyama";
}

/* ---------- Selectors ---------- */

export function getCurrentScene(state: GameState) {
  return SCENES[state.sceneIndex];
}

export function getEnding(state: GameState) {
  return state.endingId ? ENDINGS[state.endingId] : null;
}
