"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./game.css";

import {
  gameReducer,
  initialGameState,
  ACTIVE_SCENE_COUNT,
} from "@/lib/story-engine";
import {
  GRIOT_INTRO,
  PERSONALIZATION,
  SCENES,
  ENDINGS,
  getScene,
} from "@/lib/story-data";
import { loadGame, saveGame, clearSave } from "@/lib/persistence";
import {
  recordDecision,
  syncProgress,
  clearRecordedDecisions,
  linkIdentity,
} from "@/lib/progress-sync";
import type { ChoiceKey, PlayerTheme, GameState } from "@/lib/types";

import VideoStage from "./components/VideoStage";
import PortalTransition from "./components/PortalTransition";
import ChoiceLayer from "./components/ChoiceLayer";
import GriotTextOverlay from "./components/GriotTextOverlay";
import CinematicScene from "./components/CinematicScene";
import VariableVisualizer from "./components/VariableVisualizer";
import LegacyChoice from "./components/LegacyChoice";
import EndingScreen from "./components/EndingScreen";
import AminaTeaser from "./components/AminaTeaser";
import ActInterlude from "./components/ActInterlude";
import PauseMenu from "./components/PauseMenu";
import InscriptionInput from "./components/InscriptionInput";
import SpeedControl, { type PlaybackRate } from "./components/SpeedControl";
import OrientationHint from "./components/OrientationHint";

const RATE_KEY = "anthrovian-playback-rate";

/**
 * The whole game. Single-page state machine: griot intro ->
 * personalization -> 9 scenes -> (Choice 10) -> ending -> Amina.
 * The reducer is pure; localStorage + decision-sync side effects live
 * here, in effects/handlers.
 */
export default function PlayClient() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Bumped to remount the current video component for "Replay this scene".
  const [replayNonce, setReplayNonce] = useState(0);
  // Griot voice playback speed (videos have baked-in audio).
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  // For multi-part branches (`option.branchVideos`): which clip in the
  // sequence we're currently playing. Resets every time we enter a new
  // branch phase. Single-clip branches (`option.branchVideo`) ignore this.
  const [branchClipIndex, setBranchClipIndex] = useState(0);
  // For multi-part setups (`scene.setupVideos`): same idea — which setup
  // clip we're currently on. Resets every time we enter a new `scene`
  // phase for a new scene index. Single-clip setups ignore this.
  const [setupClipIndex, setSetupClipIndex] = useState(0);
  const choiceLock = useRef(false);

  const handleSetRate = useCallback((r: PlaybackRate) => {
    setPlaybackRate(r);
    try {
      window.localStorage.setItem(RATE_KEY, String(r));
    } catch {
      /* ignore */
    }
  }, []);

  // Dev/QA only: a snapshot stack so testers can step back through the
  // state machine. Gated by NODE_ENV or a localStorage flag — never
  // visible to real players.
  const [devMode, setDevMode] = useState(false);
  const historyStack = useRef<GameState[]>([]);
  const prevStateRef = useRef<GameState | null>(null);
  const restoringRef = useRef(false);

  /* ---- hydrate: resume a save, or start fresh ---- */
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: "LOAD_SAVE", state: saved });
    } else {
      dispatch({ type: "START_INTRO" });
    }
    setDevMode(
      process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
          window.localStorage.getItem("anthro-dev") === "1")
    );
    try {
      const stored = Number(window.localStorage.getItem(RATE_KEY));
      if (stored && stored >= 1 && stored <= 2.5) setPlaybackRate(stored);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  /* ---- dev: snapshot every transition so testers can step back ---- */
  useEffect(() => {
    if (restoringRef.current) {
      restoringRef.current = false;
      prevStateRef.current = state;
      return;
    }
    if (prevStateRef.current && prevStateRef.current !== state) {
      historyStack.current.push(prevStateRef.current);
      if (historyStack.current.length > 80) historyStack.current.shift();
    }
    prevStateRef.current = state;
  }, [state]);

  /* ---- autosave every state change once hydrated ---- */
  useEffect(() => {
    if (!hydrated) return;
    saveGame(state);
    syncProgress(state);
  }, [state, hydrated]);

  /* ---- reset multi-part branch clip index whenever we re-enter the
        branch phase or the branch target changes. Single-clip branches
        ignore this; multi-part branches start from clip 0 every time. ---- */
  useEffect(() => {
    if (state.phase === "branch") setBranchClipIndex(0);
  }, [state.phase, state.pendingBranch?.sceneId, state.pendingBranch?.choiceKey]);

  /* ---- same for multi-part setups: reset whenever we enter `scene`
        for a new scene index. Replays via REWATCH_SETUP also drop back
        to clip 0 because the scene index hasn't changed but the phase
        toggles choice → scene. ---- */
  useEffect(() => {
    if (state.phase === "scene") setSetupClipIndex(0);
  }, [state.phase, state.sceneIndex]);

  /* ---- browser back opens the pause menu instead of leaving ---- */
  useEffect(() => {
    window.history.pushState({ anthroGuard: true }, "");
    const onPop = () => {
      setMenuOpen(true);
      // re-arm the guard so the player stays on /play
      window.history.pushState({ anthroGuard: true }, "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* ---- handlers ---- */

  const handleChoose = useCallback(
    (choiceKey: ChoiceKey) => {
      if (choiceLock.current) return;
      choiceLock.current = true;
      const scene = SCENES[state.sceneIndex];
      const option = scene?.choices?.find((c) => c.key === choiceKey);
      if (scene && option) {
        recordDecision({
          sceneId: scene.id,
          choiceKey,
          impact: option.impact,
          tags: option.tags ?? [],
          at: Date.now(),
        });
      }
      dispatch({ type: "MAKE_CHOICE", choiceKey });
      // release the lock once we've left the choice phase
      setTimeout(() => {
        choiceLock.current = false;
      }, 400);
    },
    [state.sceneIndex]
  );

  const handleReplay = useCallback(() => {
    clearSave();
    clearRecordedDecisions();
    router.push("/awaken");
  }, [router]);

  const handleHome = useCallback(() => {
    clearSave();
    clearRecordedDecisions();
    router.push("/");
  }, [router]);

  // Replay the current beat. From the choice screen this re-watches the
  // setup video (lossless — scores/tags/history untouched); elsewhere it
  // just remounts the current video component.
  const handleReplayScene = useCallback(() => {
    setMenuOpen(false);
    if (state.phase === "choice") {
      dispatch({ type: "REWATCH_SETUP" });
    } else {
      setReplayNonce((n) => n + 1);
    }
  }, [state.phase]);

  // Dev/QA only: pop the snapshot stack and restore the prior state.
  const handleStepBack = useCallback(() => {
    const prev = historyStack.current.pop();
    if (!prev) return;
    restoringRef.current = true;
    setMenuOpen(false);
    dispatch({ type: "LOAD_SAVE", state: prev });
  }, []);

  // Dev/QA only: advance the state machine by dispatching whatever action
  // the current phase's UI would fire on natural completion. Choices
  // default to option "A". Skips video waits, portal transitions, etc.
  const handleStepForward = useCallback(() => {
    setMenuOpen(false);
    switch (state.phase) {
      case "griot_intro":
        dispatch({ type: "INTRO_VIDEO_ENDED" });
        break;
      case "name_capture":
        dispatch({ type: "NAME_CAPTURE_DONE" });
        break;
      case "email_capture":
        dispatch({ type: "EMAIL_CAPTURE_DONE" });
        break;
      case "personalization":
        dispatch({ type: "SELECT_THEME", theme: "NEUTRAL" });
        break;
      case "portal_transition":
        dispatch({ type: "PORTAL_DONE" });
        break;
      case "scene":
        dispatch({ type: "SCENE_VIDEO_ENDED" });
        break;
      case "choice":
        dispatch({ type: "MAKE_CHOICE", choiceKey: "A" });
        break;
      case "branch":
        dispatch({ type: "BRANCH_ENDED" });
        break;
      case "cinematic":
        dispatch({ type: "CINEMATIC_TAP" });
        break;
      case "legacy":
        dispatch({ type: "MAKE_LEGACY_CHOICE", choiceKey: "A" });
        break;
      case "ending":
      case "reflection":
        if (state.unlocksAmina) dispatch({ type: "SHOW_AMINA" });
        break;
      default:
        break; // act_interlude / amina are terminal
    }
  }, [state.phase, state.unlocksAmina]);

  /* ---- render ---- */

  if (!hydrated) {
    return <div className="anthro-game" />;
  }

  const scene = SCENES[state.sceneIndex];
  const nextSceneVideo = SCENES[state.sceneIndex + 1]?.setupVideo;

  let body: React.ReactNode = null;

  switch (state.phase) {
    case "griot_intro":
      body = (
        <VideoStage
          key={`intro-${replayNonce}`}
          src={GRIOT_INTRO.video}
          poster={GRIOT_INTRO.poster}
          nextSrc={SCENES[0]?.setupVideo}
          paused={menuOpen}
          playbackRate={playbackRate}
          onEnded={() => dispatch({ type: "INTRO_VIDEO_ENDED" })}
        />
      );
      break;

    case "name_capture":
      body = (
        <InscriptionInput
          prompt={"Before the tale begins —\nby what name will the griots sing you?"}
          placeholder="Your name"
          type="text"
          submitLabel="Continue"
          optional
          poster={GRIOT_INTRO.poster}
          onSubmit={(name) => {
            dispatch({ type: "SET_PLAYER_NAME", name });
            linkIdentity({ name });
            dispatch({ type: "NAME_CAPTURE_DONE" });
          }}
          onSkip={() => dispatch({ type: "NAME_CAPTURE_DONE" })}
        />
      );
      break;

    case "email_capture":
      // Asked right after the name so cross-device resume works from the
      // very start of Act I (server keys on lowercased email). Optional
      // — players who skip can still play; they'll just have no way to
      // pick up on another device until they enter an email later at the
      // Act Interlude / Amina teaser.
      body = (
        <InscriptionInput
          prompt={"And by what email may the griot find you again,\nshould the tale carry across many moons?"}
          placeholder="your@email"
          type="email"
          submitLabel="Continue"
          optional
          poster={GRIOT_INTRO.poster}
          onSubmit={(email) => {
            dispatch({ type: "SET_PLAYER_EMAIL", email });
            linkIdentity({
              email,
              name: state.playerName ?? undefined,
            });
            dispatch({ type: "EMAIL_CAPTURE_DONE" });
          }}
          onSkip={() => dispatch({ type: "EMAIL_CAPTURE_DONE" })}
        />
      );
      break;

    case "personalization":
      body = (
        <ChoiceLayer
          prompt={PERSONALIZATION.prompt}
          poster={GRIOT_INTRO.poster}
          options={PERSONALIZATION.options.map((o) => ({
            key: o.key,
            label: o.text,
          }))}
          preDelayMs={900}
          revealStaggerMs={900}
          onChoose={(key) => {
            const opt = PERSONALIZATION.options.find((o) => o.key === key);
            const theme: PlayerTheme = opt?.theme ?? "NEUTRAL";
            dispatch({ type: "SELECT_THEME", theme });
          }}
        />
      );
      break;

    case "portal_transition":
      body = (
        <PortalTransition onDone={() => dispatch({ type: "PORTAL_DONE" })} />
      );
      break;

    case "scene":
      // Multi-part setup — play each clip in `setupVideos` back-to-back,
      // dispatch SCENE_VIDEO_ENDED only when the last clip finishes.
      if (scene?.setupVideos && scene.setupVideos.length > 0) {
        const setupClips = scene.setupVideos;
        const safeIdx = Math.min(setupClipIndex, setupClips.length - 1);
        const isLast = safeIdx === setupClips.length - 1;
        body = (
          <VideoStage
            key={`scene-${state.sceneIndex}-${safeIdx}-${replayNonce}`}
            src={setupClips[safeIdx]}
            poster={scene.poster}
            // Mid-sequence: prime the next clip. On the final clip: prime
            // the next SCENE's setup video so the choice-then-portal beat
            // has its asset warm.
            nextSrc={isLast ? nextSceneVideo : setupClips[safeIdx + 1]}
            paused={menuOpen}
            playbackRate={playbackRate}
            onEnded={() => {
              if (isLast) {
                dispatch({ type: "SCENE_VIDEO_ENDED" });
              } else {
                setSetupClipIndex((i) => i + 1);
              }
            }}
          />
        );
      } else if (scene?.setupVideo) {
        body = (
          <VideoStage
            key={`scene-${state.sceneIndex}-${replayNonce}`}
            src={scene.setupVideo}
            poster={scene.poster}
            nextSrc={nextSceneVideo}
            paused={menuOpen}
            playbackRate={playbackRate}
            onEnded={() => dispatch({ type: "SCENE_VIDEO_ENDED" })}
          />
        );
      } else if (scene?.setupNarration) {
        // Text-narration fallback for scenes without a delivered video.
        body = (
          <GriotTextOverlay
            key={`scene-text-${state.sceneIndex}-${replayNonce}`}
            text={scene.setupNarration}
            poster={scene.poster}
            advanceLabel="The kora plays…"
            onAdvance={() => dispatch({ type: "SCENE_VIDEO_ENDED" })}
          />
        );
      }
      break;

    case "cinematic":
      body = scene?.setupVideo ? (
        <CinematicScene
          key={`cin-${state.sceneIndex}-${replayNonce}`}
          src={scene.setupVideo}
          poster={scene.poster}
          nextSrc={nextSceneVideo}
          paused={menuOpen}
          playbackRate={playbackRate}
          onAdvance={() => dispatch({ type: "CINEMATIC_TAP" })}
        />
      ) : null;
      break;

    case "choice":
      body = scene?.choices ? (
        <ChoiceLayer
          prompt={scene.prompt}
          poster={scene.poster}
          variant={scene.id === "iron_rod" ? "iron" : "wood"}
          options={scene.choices.map((c) => ({ key: c.key, label: c.text }))}
          preDelayMs={scene.optionPreDelayMs ?? 900}
          revealStaggerMs={scene.optionRevealDelayMs ?? 900}
          onChoose={(key) => handleChoose(key as ChoiceKey)}
        />
      ) : null;
      break;

    case "branch": {
      const pb = state.pendingBranch;
      const branchScene = pb ? getScene(pb.sceneId) : undefined;
      const option = branchScene?.choices?.find(
        (c) => c.key === pb?.choiceKey
      );

      // Multi-part branch — play each clip in `branchVideos` back-to-back.
      // When the last clip ends, dispatch BRANCH_ENDED. Mid-sequence end
      // events just advance the index, which (via the `key` prop) remounts
      // VideoStage on the next URL.
      if (option?.branchVideos && option.branchVideos.length > 0) {
        const clips = option.branchVideos;
        const safeIdx = Math.min(branchClipIndex, clips.length - 1);
        const isLast = safeIdx === clips.length - 1;
        body = (
          <VideoStage
            key={`branch-${state.sceneIndex}-${safeIdx}-${replayNonce}`}
            src={clips[safeIdx]}
            poster={branchScene?.poster}
            // Prime the buffer for the next clip in the sequence; once on
            // the final clip, prime the next SCENE's setup video instead.
            nextSrc={isLast ? nextSceneVideo : clips[safeIdx + 1]}
            paused={menuOpen}
            playbackRate={playbackRate}
            onEnded={() => {
              if (isLast) {
                dispatch({ type: "BRANCH_ENDED" });
              } else {
                setBranchClipIndex((i) => i + 1);
              }
            }}
          />
        );
      } else if (option?.branchVideo) {
        body = (
          <VideoStage
            key={`branch-${state.sceneIndex}-${replayNonce}`}
            src={option.branchVideo}
            poster={branchScene?.poster}
            nextSrc={nextSceneVideo}
            paused={menuOpen}
            playbackRate={playbackRate}
            onEnded={() => dispatch({ type: "BRANCH_ENDED" })}
          />
        );
      } else if (option) {
        body = (
          <GriotTextOverlay
            key={`branch-text-${state.sceneIndex}-${replayNonce}`}
            text={option.branchNarration}
            poster={branchScene?.poster}
            onAdvance={() => dispatch({ type: "BRANCH_ENDED" })}
          />
        );
      }
      break;
    }

    case "act_interlude": {
      // Which act just finished — derived from the last playable scene.
      // The reducer sends us here only when nextIndex >= ACTIVE_SCENE_COUNT,
      // so SCENES[ACTIVE_SCENE_COUNT - 1] is the final scene of the current
      // playable range. Today: ACTIVE_SCENE_COUNT = 7, last scene = "return"
      // (act 2). Bumps to 10 will resolve to act 3 automatically.
      const finishedScene = SCENES[ACTIVE_SCENE_COUNT - 1];
      const finishedAct = (finishedScene?.act ?? 1) as 1 | 2 | 3;
      body = (
        <ActInterlude
          act={finishedAct}
          onReplay={handleReplay}
          onHome={handleHome}
          savedEmail={state.playerEmail}
          onCaptureEmail={(email) => {
            dispatch({ type: "SET_PLAYER_EMAIL", email });
            linkIdentity({ email, name: state.playerName ?? undefined });
          }}
        />
      );
      break;
    }

    case "legacy":
      body = (
        <LegacyChoice
          onChoose={(key) =>
            dispatch({ type: "MAKE_LEGACY_CHOICE", choiceKey: key })
          }
        />
      );
      break;

    case "ending":
    case "reflection": {
      const ending = state.endingId ? ENDINGS[state.endingId] : null;
      body = ending ? (
        <EndingScreen
          ending={ending}
          lastIncreasedVar={state.lastIncreasedVar}
          pulseKey={state.history.length}
          onShowAmina={() => dispatch({ type: "SHOW_AMINA" })}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      ) : null;
      break;
    }

    case "amina":
      body = (
        <AminaTeaser
          onHome={handleHome}
          onReplay={handleReplay}
          playbackRate={playbackRate}
          savedEmail={state.playerEmail}
          onCaptureEmail={(email) => {
            dispatch({ type: "SET_PLAYER_EMAIL", email });
            linkIdentity({ email, name: state.playerName ?? undefined });
          }}
        />
      );
      break;

    default:
      body = null;
  }

  // The variable visualizer rides above scene / choice / branch phases.
  const showVisualizer =
    state.phase === "scene" ||
    state.phase === "choice" ||
    state.phase === "branch";

  // Speed control shows whenever a baked-audio video is on screen.
  const branchOpt =
    state.phase === "branch" && state.pendingBranch
      ? getScene(state.pendingBranch.sceneId)?.choices?.find(
          (c) => c.key === state.pendingBranch!.choiceKey
        )
      : undefined;
  const showSpeed =
    state.phase === "griot_intro" ||
    state.phase === "amina" ||
    state.phase === "cinematic" ||
    (state.phase === "scene" && !!scene?.setupVideo) ||
    (state.phase === "branch" && !!branchOpt?.branchVideo);

  // The pause glyph is hidden on screens that already carry their own
  // navigation (the interlude / ending / Amina screens).
  const showMenuButton = !["act_interlude", "ending", "reflection", "amina"].includes(
    state.phase
  );
  const canReplay = ["griot_intro", "scene", "cinematic", "branch", "choice"].includes(
    state.phase
  );

  return (
    <main className="anthro-game">
      {body}

      {showVisualizer && (
        <div className="absolute right-4 top-4 z-30">
          <VariableVisualizer
            lastIncreasedVar={state.lastIncreasedVar}
            pulseKey={state.history.length}
          />
        </div>
      )}

      {/* Google-Meet-style control cluster, bottom-right. */}
      {(showSpeed || showMenuButton) && !menuOpen && (
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2.5">
          {showSpeed && (
            <SpeedControl rate={playbackRate} onChange={handleSetRate} />
          )}
          {showMenuButton && (
            <button
              type="button"
              aria-label="Pause"
              onClick={() => setMenuOpen(true)}
              className="game-ctrl"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            </button>
          )}
        </div>
      )}

      <PauseMenu
        open={menuOpen}
        canReplay={canReplay}
        onResume={() => setMenuOpen(false)}
        onReplayScene={handleReplayScene}
        onRestart={handleReplay}
        onHome={handleHome}
      />

      {/* Dev/QA only — never rendered for real players. */}
      {devMode && (
        <div className="absolute bottom-3 left-3 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={handleStepBack}
            disabled={historyStack.current.length === 0}
            className="rounded border border-[rgba(96,165,250,0.5)] bg-black/75 px-2.5 py-1 font-mono text-[11px] text-[#60a5fa] transition-colors hover:bg-black/95 disabled:opacity-40"
          >
            ← back
          </button>
          <button
            type="button"
            onClick={handleStepForward}
            disabled={state.phase === "act_interlude" || state.phase === "amina"}
            className="rounded border border-[rgba(96,165,250,0.5)] bg-black/75 px-2.5 py-1 font-mono text-[11px] text-[#60a5fa] transition-colors hover:bg-black/95 disabled:opacity-40"
          >
            fwd →
          </button>
          <span className="font-mono text-[10px] text-[#60a5fa]/70">
            {state.phase} · s{state.sceneIndex} · b{state.scores.badenya} f
            {state.scores.fadenya} n{state.scores.nyama}
          </span>
        </div>
      )}

      {/* Mobile-only nudge to rotate; self-gates + auto-hides on landscape. */}
      <OrientationHint />
    </main>
  );
}
