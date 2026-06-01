/* =============================================================
   ANTHROVIAN — "Sundiata's Rise" core types
   Built from Sundiata_Rise_Full_Script_v1.docx (authoritative).
   ============================================================= */

export type Variable = "badenya" | "fadenya" | "nyama";

export interface VariableScores {
  badenya: number;
  fadenya: number;
  nyama: number;
}

/** Personalization micro-choice flavor tag — NOT a score impact. */
export type PlayerTheme =
  | "BADENYA_THEME"
  | "FADENYA_THEME"
  | "NYAMA_THEME"
  | "NEUTRAL";

export type ChoiceKey = "A" | "B" | "C";

/** Mandé symbols used by the variable visualizer + choice screens. */
export type GameSymbol = "leaf" | "fist" | "spiral" | "none";

/* ---------- Personalization (pre-myth micro-choice) ---------- */

export interface PersonalizationOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  theme: PlayerTheme;
  symbol: GameSymbol;
}

export interface Personalization {
  prompt: string;
  options: PersonalizationOption[];
}

/* ---------- Scenes & choices ---------- */

export interface ChoiceOption {
  key: ChoiceKey;
  /** Label rendered on the carved button. */
  text: string;
  /** Score impact. For Choice 1 the Badenya option is A; for Choices 2-9 it is B. */
  impact: Partial<VariableScores>;
  /** Story tags unlocked by this option (seed tags, exile tags, origin unlocks). */
  tags?: string[];
  /** Griot's "↳ PATH X" response narration, paragraphs separated by \n\n. */
  branchNarration: string;
  /** Optional dedicated branch video; when absent, branchNarration renders over the poster. */
  branchVideo?: string;
}

export interface Scene {
  id: string;
  act: 1 | 2 | 3;
  /** 1-indexed position matching the script's Scene N numbering. */
  index: number;
  title: string;
  /** Setup video that plays before the choice. Omitted when no video exists yet. */
  setupVideo?: string;
  /** Text-narration fallback shown when a scene has no setupVideo (e.g. Iron Rod). */
  setupNarration?: string;
  /** Still frame used as <video poster> and as the branch-narration backdrop. */
  poster: string;
  /** True for the 8 scored choice scenes. */
  scored: boolean;
  /** True for Scene 4 (baobab) — whole-screen tap zone, no choice UI. */
  isCinematic?: boolean;
  /** Griot's question shown above the choices. */
  prompt?: string;
  /** Present iff scored. Always 3 options (A/B/C). */
  choices?: ChoiceOption[];
  /** Per-option reveal stagger (ms). Scene 3 & Scene 9 also use a 2s pre-delay. */
  optionRevealDelayMs?: number;
  /** Extra pause before the first option appears (ms) — Scene 3 & Scene 9 = 2000. */
  optionPreDelayMs?: number;
}

/* ---------- Choice 10 — optional Legacy moment ---------- */

export interface LegacyOption {
  key: ChoiceKey;
  text: string;
  tag: string;
}

export interface LegacyChoice {
  prompt: string;
  options: LegacyOption[];
}

/* ---------- Endings ---------- */

export type EndingId =
  | "true_lion_king"
  | "iron_lion"
  | "wise_builder"
  | "sorcerer_king"
  | "seeking_son"
  | "mothers_hidden_lion";

export interface ReflectionCard {
  proverb: string;
  soulsMirror: string;
}

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  endingVideo: string;
  poster: string;
  /** Narration shown over/after the ending video. Paragraphs separated by \n\n. */
  narration: string;
  /** mothers_hidden_lion — but NO "secret ending" banner is ever shown. */
  isSecret?: boolean;
  reflection: ReflectionCard;
  /** Endings 1, 2, 3, 6 unlock the Amina teaser; 4 and 5 do not. */
  unlocksAmina: boolean;
}

/* ---------- Amina teaser ---------- */

export interface AminaTeaser {
  video: string;
  poster: string;
  narration: string;
  ctaText: string;
}

/* ---------- Game state machine ---------- */

export type GamePhase =
  | "griot_intro"
  | "name_capture"
  | "email_capture"
  | "personalization"
  | "scene"
  | "choice"
  | "branch"
  | "cinematic"
  | "portal_transition"
  | "act_interlude"
  | "legacy"
  | "ending"
  | "reflection"
  | "amina";

export interface HistoryEntry {
  sceneId: string;
  choiceKey: ChoiceKey;
}

export interface PendingBranch {
  sceneId: string;
  choiceKey: ChoiceKey;
}

export interface GameState {
  /** Save-format version. Mismatched saves are migrated/ignored on load. */
  version: 2;
  phase: GamePhase;
  /** Captured by the griot during the intro (optional). */
  playerName: string | null;
  /** Captured during onboarding (optional) — the cross-device resume key
   *  AND the Act-2 waitlist. Asked right after name, also re-prompted at
   *  the Amina teaser / Act Interlude in case the player skipped it. */
  playerEmail: string | null;
  playerTheme: PlayerTheme | null;
  /** Index into SCENE_ORDER. */
  sceneIndex: number;
  scores: VariableScores;
  tags: string[];
  history: HistoryEntry[];
  pendingBranch: PendingBranch | null;
  /** Drives the VariableVisualizer pulse. */
  lastIncreasedVar: Variable | null;
  /** Epoch ms set on START_INTRO — the playtime clock for the Choice 10 gate. */
  startedAt: number | null;
  /** Computed after Scene 9: playtime < 18 min. */
  showLegacy: boolean;
  legacyTag: string | null;
  endingId: EndingId | null;
  unlocksAmina: boolean;
}

/** A single recorded decision — shape kept backend-ready for later sync. */
export interface DecisionRecord {
  sceneId: string;
  choiceKey: ChoiceKey;
  impact: Partial<VariableScores>;
  tags: string[];
  at: number;
}
