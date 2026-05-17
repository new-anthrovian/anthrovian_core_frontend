import type { Metadata } from "next";
import AwakenPage from "./AwakenPage";

export const metadata: Metadata = {
  title: "Awaken the Lion Within | Anthrovian",
  description:
    "Before there was Mali, there was silence. Step through the portal and begin Sundiata's Rise.",
};

export default function Page() {
  return <AwakenPage />;
}
