import type { Metadata } from "next";
import PlayClient from "./PlayClient";

export const metadata: Metadata = {
  title: "Sundiata's Rise | Anthrovian",
  description:
    "Awaken the lion within. Make the choices that shape the legend of Sundiata Keita.",
};

export default function PlayPage() {
  return <PlayClient />;
}
