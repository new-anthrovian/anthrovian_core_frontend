"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../play/game.css";

import { hasSave, clearSave } from "@/lib/persistence";
import { clearRecordedDecisions } from "@/lib/progress-sync";
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

  if (!ready) return <div className="anthro-game" />;

  return (
    <PortalScreen
      hasSave={saveExists}
      onBegin={handleBegin}
      onContinue={handleContinue}
    />
  );
}
