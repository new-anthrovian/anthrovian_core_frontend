"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../play/game.css";

import { hasSave, clearSave, saveGame } from "@/lib/persistence";
import { clearRecordedDecisions } from "@/lib/progress-sync";
import { setDeviceToken } from "@/lib/device-token";
import type { GameState } from "@/lib/types";
import PortalScreen from "../play/components/PortalScreen";

/**
 * /awaken — the portal. The Begin tap is the user gesture that unlocks
 * audible video for the session, so the griot intro can play with
 * sound the instant /play mounts.
 */
export default function AwakenPage() {
  const router = useRouter();
  const [saveExists, setSaveExists] = useState(false);
  const [ready, setReady] = useState(false);
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  useEffect(() => {
    setSaveExists(hasSave());
    setReady(true);
  }, []);

  const handleBegin = () => {
    clearSave();
    clearRecordedDecisions();
    router.push("/play");
  };

  const handleContinue = () => {
    router.push("/play");
  };

  // Cross-device restore: look up the latest playthrough by email, adopt
  // its device token, write its state locally, then resume via /play.
  const handleRestore = async (email: string) => {
    setRestoreBusy(true);
    setRestoreError(null);
    try {
      const res = await fetch("/api/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.found && data.state) {
        clearSave();
        clearRecordedDecisions();
        if (data.deviceToken) setDeviceToken(data.deviceToken);
        // loadGame() on /play mount migrates the state version if needed.
        saveGame(data.state as GameState);
        router.push("/play");
        return;
      }
      if (data?.ok && !data.found) {
        setRestoreError("No tale found for that email. Begin anew, perhaps?");
      } else {
        setRestoreError("The griot could not reach the ancestors. Try again.");
      }
    } catch {
      setRestoreError("The griot could not reach the ancestors. Try again.");
    } finally {
      setRestoreBusy(false);
    }
  };

  if (!ready) return <div className="anthro-game" />;

  return (
    <PortalScreen
      hasSave={saveExists}
      onBegin={handleBegin}
      onContinue={handleContinue}
      onRestore={handleRestore}
      restoreBusy={restoreBusy}
      restoreError={restoreError}
    />
  );
}
