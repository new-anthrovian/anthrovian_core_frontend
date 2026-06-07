/* =============================================================
   ANTHROVIAN — "Sundiata's Rise" content
   Transcribed verbatim from Sundiata_Rise_Full_Script_v1.docx.

   Setup narration is baked into each scene video (VO + kora + SFX),
   so only rendered text lives here: prompts, choice labels, branch
   narration (the griot's "↳ PATH X" response), endings, reflections.

   VIDEO MAPPING IS PROVISIONAL — see plan's mapping table. Swap the
   filenames here once the 27 source mp4s are confirmed scene-by-scene.
   ============================================================= */

import type {
  Scene,
  Personalization,
  LegacyChoice,
  Ending,
  EndingId,
  AminaTeaser,
} from "./types";

/**
 * Where video/poster assets live. In production we set
 * NEXT_PUBLIC_VIDEO_BASE to a CDN root (e.g. an R2.dev public URL); in
 * local dev the fallback reads from public/videos/ so the game still
 * runs without internet. Trailing slash is stripped for safety.
 */
const RAW_VIDEO_BASE = process.env.NEXT_PUBLIC_VIDEO_BASE ?? "/videos";
export const VIDEO_BASE = RAW_VIDEO_BASE.replace(/\/+$/, "");

/**
 * Cache-bust query string appended to every asset URL. CDN cache headers
 * on R2 are `immutable, max-age=1y`, so when we re-encode/re-upload
 * videos to the same key we need a new query string to force browsers
 * and the edge cache to refetch. Bump this whenever videos are
 * re-encoded or replaced at the same key.
 */
const ASSET_VERSION = "4";

const v = (name: string) => `${VIDEO_BASE}/${name}?v=${ASSET_VERSION}`;
const poster = (name: string) => `${VIDEO_BASE}/posters/${name}?v=${ASSET_VERSION}`;

/* ---------- Portal (the /awaken entry video) ---------- */

export const PORTAL_VIDEO = v("portal-awaken.mp4");
export const PORTAL_POSTER = poster("portal-awaken.jpg");

/* ---------- Griot intro ---------- */

export const GRIOT_INTRO = {
  video: v("scene-00-griot-intro.mp4"),
  poster: poster("scene-00-griot-intro.jpg"),
};

/* ---------- Personalization micro-choice (flavor tag, no score) ---------- */

export const PERSONALIZATION: Personalization = {
  prompt:
    "Before we begin — tell me, young lion…\nWhat weighs on your spirit today?",
  options: [
    {
      key: "A",
      text: "I carry the weight of others — family, responsibility, my people.",
      theme: "BADENYA_THEME",
      symbol: "leaf",
    },
    {
      key: "B",
      text: "I carry the fire of ambition — something in me is desperate to rise.",
      theme: "FADENYA_THEME",
      symbol: "fist",
    },
    {
      key: "C",
      text: "I carry questions I cannot answer — I am searching for meaning.",
      theme: "NYAMA_THEME",
      symbol: "spiral",
    },
    {
      key: "D",
      text: "I carry nothing. I simply want to see what the story holds.",
      theme: "NEUTRAL",
      symbol: "none",
    },
  ],
};

/* ---------- Scenes ---------- */

export const SCENES: Scene[] = [
  /* ----- SCENE 1 — THE HUNTER'S PROPHECY ----- */
  {
    id: "hunters_prophecy",
    act: 1,
    index: 1,
    title: "The Hunter's Prophecy",
    setupVideo: v("scene-01-hunters-prophecy.mp4"),
    poster: poster("scene-01-hunters-prophecy.jpg"),
    scored: true,
    prompt:
      "Now. Before I tell you what came next — I ask you something, young lion.\n\nWhen you heard the word ‘prophecy’… what moved inside you?",
    choices: [
      {
        key: "A",
        text: "I want to find my mother. To ask her what she knows.",
        impact: { badenya: 1 },
        tags: ["BADENYA_SEED_PLANTED"],
        branchVideo: v("branch-01-a.mp4"),
        branchNarration:
          "Yes. Sogolon — your mother. She arrived as the hunter foretold.\n\nThey said she was ugly. They said her back was hunched and her eyes were too still. What they did not say was this: she carried the nyama of the buffalo spirit in her blood. She was power that had chosen humility as its disguise.\n\nYour father saw through the disguise. He married her. And from their union — from patience and prophecy bound together — you were born.",
      },
      {
        key: "B",
        text: "I feel something close to fury. A fire that has no target yet.",
        impact: { fadenya: 1 },
        tags: ["FADENYA_SEED_PLANTED"],
        branchVideo: v("branch-01-b.mp4"),
        branchNarration:
          "That fire is ancient in you, Sundiata. It is Fadenya — the rivalry of half-brothers, the hunger of those who were told they had no place at the table.\n\nEven before you could speak, Sassouma Bérété looked at you with calculating eyes. Her son was first-born. Her son was heir. And yet the hunter’s prophecy said your name — not his.\n\nThe fire you feel? It was lit before your birth.",
      },
      {
        key: "C",
        text: "I feel the presence of something older than the words being spoken.",
        impact: { nyama: 1 },
        tags: ["NYAMA_SEED_PLANTED"],
        branchVideo: v("branch-01-c.mp4"),
        branchNarration:
          "You feel it already. The Nyama that moved the hunter’s tongue.\n\nThe invisible force that chose your mother — Sogolon, the Buffalo Woman — not despite her ugliness but because of it. Because Nyama does not wear beautiful faces. It wears truth.\n\nYour mother carried the spirit of Do Kamissa — the great buffalo of Do — in her very being. You were not just born. You were summoned.",
      },
    ],
  },

  /* ----- SCENE 2 — MOCKERY IN THE COURTYARD ----- */
  {
    id: "mockery",
    act: 1,
    index: 2,
    title: "Mockery in the Courtyard",
    setupVideo: v("scene-02-mockery.mp4"),
    poster: poster("scene-02-mockery.jpg"),
    scored: true,
    // Script: "No text — just the image and the choices below."
    choices: [
      {
        key: "A",
        text: "I call out — my voice breaks the silence. “She is the queen. You will not speak to her this way.”",
        impact: { fadenya: 1 },
        tags: ["DEFIANT_CHILD"],
        branchVideo: v("branch-02-a.mp4"),
        branchNarration:
          "The words came out of you before you could stop them.\n\nThe courtyard went still. Sassouma’s smile froze. Even the servants stopped. Because the boy on the ground — the boy who could not walk — had spoken with the voice of a man.\n\nShe turned away first. And your mother came back to you slowly, knelt beside you, and pressed her forehead to yours. She did not thank you. She simply said, in a voice only you could hear: “Not yet. But soon.”\n\nThe fire in you burned brighter.",
      },
      {
        key: "B",
        text: "I say nothing. I watch my mother walk away. And I make a silent promise to every ancestor listening.",
        impact: { badenya: 1 },
        tags: ["PATIENT_CHILD"],
        branchVideo: v("branch-02-b.mp4"),
        branchNarration:
          "You watched her walk away.\n\nAnd in the watching — something older than anger rose in your chest. Not fury. Not pride. Something heavier. Something that said: not for me. For her.\n\nThat night, Sogolon came to you when the compound was quiet. She sat beside you and did not speak for a long time. Then she said: “The baobab is the oldest tree in the forest. And even it must wait to grow.”\n\nYou did not fully understand. But you felt it in your bones. And you started to wait — the way the baobab waits.",
      },
      {
        key: "C",
        text: "I press my palms deeper into the earth. I feel something answer — a vibration, ancient and low.",
        impact: { nyama: 1 },
        tags: ["SPIRIT_CHILD"],
        branchVideo: v("branch-02-c.mp4"),
        branchNarration:
          "The earth beneath your hands — it pulsed.\n\nNot loudly. Not clearly. Just once — like a heartbeat below a heartbeat. Later you would understand this as Nyama — the spirit force woven into the living world, present in blacksmiths, in hunters, in sacred blood.\n\nIt was not the earth greeting you. It was the earth recognizing you.\n\nThat night you dreamed of a great buffalo — your mother’s face inside its eyes. When you woke, your hands were still warm.",
      },
    ],
  },

  /* ----- SCENE 3 — THE IRON ROD (myth-defining) ----- */
  {
    id: "iron_rod",
    act: 1,
    index: 3,
    title: "The Iron Rod",
    // No video delivered for the Iron Rod yet — renders as griot text.
    setupNarration:
      "Seven years passed. Seven years of dust and dragging. Seven years of your mother’s tears she thought you never saw.\n\nAnd then — your father, the king, fell ill. Before he died he summoned Balla Fasséké, your griot, and made a final decree: “The throne is Sundiata’s. This I say before the ancestors.” And then he was gone.\n\nSassouma moved quickly. She placed her son Dankaran Touman on the throne. The elders said nothing. And you still sat in the dust.\n\nThen Balla Fasséké knelt beside you: “The griots have gathered. The elders have gathered. Sassouma intends to send you and your mother away from Niani forever. The blacksmiths have brought the iron rod — the test of royal strength. If you cannot stand today, the case is closed.”\n\nHe did not say: ‘Get up.’ He said: “The kora is tuned. What would you like me to play?”\n\nThe crowd was assembled — all of Niani in a circle. The iron rod lay on the ground like a sleeping serpent. Sogolon stood at the edge of the crowd. Sassouma smiled from the shade. The griot played the first note.",
    poster: poster("scene-03-iron-rod.jpg"),
    scored: true,
    prompt:
      "And the note said: who are you, Sundiata?\nWho. Are. You.\n\nNow. This is the moment, young lion. Not mine to decide. Yours.\n\nHow do you rise?",
    optionPreDelayMs: 2000,
    optionRevealDelayMs: 1000,
    choices: [
      {
        key: "A",
        text: "I seize the rod with both hands — I will stand or I will break it trying.",
        impact: { fadenya: 2 },
        tags: ["WARRIOR_ORIGIN"],
        branchNarration:
          "You did not look at the crowd. You did not look at Sassouma. You did not even look at the iron.\n\nYou grabbed it. Both hands. Knuckles white as moon-bone. And you pulled.\n\nThe sound that came out of you — it was not a scream. It was deeper than a scream. It was older. It was the sound of seven years pressing outward.\n\nThe iron BENT. Not slowly. Like a living thing — like it had been waiting for your hands. The rod bent into the shape of a bow. And you — Sundiata — you stood.\n\nThe earth shook as your feet found it for the first time. And Balla Fasséké — weeping openly now — began to play. The Hymn to the Bow. He composed it right there. For you.\n\nThen you walked — for the first time in your life — to your mother. You placed the iron bow at her feet. You said nothing. You didn’t have to.",
      },
      {
        key: "B",
        text: "I look to my mother first. I will not rise for the crowd. I rise for her.",
        impact: { badenya: 2 },
        tags: ["COVENANT_ORIGIN"],
        branchNarration:
          "You did not touch the rod first. You looked for your mother.\n\nShe was at the edge of the crowd — trying not to be seen. You locked eyes with her. And she — who had not wept in public since the day of your birth — pressed one hand over her mouth. You nodded.\n\nThen you turned to the iron rod. You did not grab it. You placed both palms against it — gently — the way you had seen your mother lay her hands on a sick child. With love as a force, not a feeling. And you said, quiet enough that only the ancestors could hear: “This is not for me.”\n\nThe iron bent. Slowly. Deliberately. And you rose. Like a tree rises — like something that was always meant to be standing finally stopped apologizing for its height.\n\nAnd Sogolon walked to you through the parting crowd. She took the iron bow and held it against her chest. And she said: “I always knew. I simply had to wait for you to know it too.”",
      },
      {
        key: "C",
        text: "I close my eyes. I call on the blacksmith spirits, the ancestors, the Nyama in the iron itself.",
        impact: { nyama: 2 },
        tags: ["SPIRIT_ORIGIN"],
        branchNarration:
          "You closed your eyes. In the quiet of your own darkness — you listened.\n\nThe blacksmiths have a name for what lives inside iron. It is part of Nyama — the unseen force that moves through the world in the hands of those who know how to call it. You called it. Not with words. With recognition.\n\nYou heard the smith who smelted the ore. You heard the ancestors of the Kouyaté griot line singing your name before you were born. You heard your mother’s buffalo spirit — Do Kamissa — breathing slow and steady like a river.\n\nAnd then the iron grew warm under your palms. A faint light moved through it. Only you saw it. Only you needed to. You stood.\n\nThe iron bent into a bow without force — as if it had been asking permission this whole time and you had finally said yes. You stood. Eyes open now. The world looked different from up here. Not larger. Just true.",
      },
    ],
  },

  /* ----- SCENE 4 — UPROOTING THE BAOBAB (cinematic, no choice) ----- */
  {
    id: "baobab",
    act: 1,
    index: 4,
    title: "Uprooting the Baobab",
    setupVideo: v("scene-04-baobab.mp4"),
    poster: poster("scene-04-baobab.jpg"),
    scored: false,
    isCinematic: true,
  },

  /* ----- SCENE 5 — THE ROAD OF EXILE ----- */
  {
    id: "exile",
    act: 2,
    index: 5,
    title: "The Road of Exile",
    setupVideo: v("scene-05-exile.mp4"),
    poster: poster("scene-05-exile.jpg"),
    scored: true,
    prompt:
      "As you left the gates of Niani behind you, I ask you — what did you carry in your chest?",
    choices: [
      {
        key: "A",
        text: "Defiance. I called out into the dark as we left — “I will return. And Niani will know my name.”",
        impact: { fadenya: 1 },
        tags: ["OPEN_EXILE"],
        branchVideo: v("branch-05-a.mp4"),
        branchNarration:
          "Your voice rang out in the dark of Niani. No one answered. But the night heard you. And the night does not forget.\n\nTwo of your father’s old generals — men who had watched Sassouma’s cruelty with quiet disgust — stepped out of the shadows and fell in beside you without a word.\n\nYou had called out expecting nothing. You received everything. Because courage, announced into the dark, has a sound that certain people have been waiting all their lives to hear.",
      },
      {
        key: "B",
        text: "Silence and resolve. I looked at my mother’s profile in the moonlight and swore silently — she will never suffer for me again.",
        impact: { badenya: 1 },
        tags: ["QUIET_EXILE"],
        // Multi-part — the filmmaker delivered this Path B response as two
        // back-to-back clips. Player sees them play seamlessly.
        branchVideos: [v("branch-05-b-1.mp4"), v("branch-05-b-2.mp4")],
        branchNarration:
          "You said nothing. But Sogolon felt it anyway — the way mothers feel the things you decide not to say.\n\nShe reached out and took your hand. She held it for three steps. And then she let go — because she knew you needed both hands free for what was coming.\n\nYour sisters pressed close to you as you walked. Your little brother Manding Bory stumbled on a root and you caught him without looking. You were already the center of a world, Sundiata. Even in exile. Even walking away.",
      },
      {
        key: "C",
        text: "A question. I stopped at the edge of the city and touched the ground — asking the earth to remember me.",
        impact: { nyama: 1 },
        tags: ["SPIRIT_EXILE"],
        // No branch video delivered — renders as griot text over the poster.
        branchNarration:
          "You pressed your hand to the red earth of Niani one last time. And the earth pressed back.\n\nNot in anger. Not in sorrow. In recognition — the way a beloved face turns toward you in a crowd.\n\nYou rose and walked. But somewhere in the bones of the Manden, the earth noted your footsteps. And the direction they were going. And it began, in its slow geological patience, to wait for your return.",
      },
    ],
  },

  /* ----- SCENE 6 — AT THE COURT OF MEMA ----- */
  {
    id: "mema",
    act: 2,
    index: 6,
    title: "At the Court of Mema",
    setupVideo: v("scene-06-mema.mp4"),
    poster: poster("scene-06-mema.jpg"),
    scored: true,
    prompt: "Three years in Mema. Tell me — how did you spend them?",
    choices: [
      {
        key: "A",
        text: "In the training ground. Every day until my hands bled and my body forgot what weakness was.",
        impact: { fadenya: 1 },
        branchVideo: v("branch-06-a.mp4"),
        branchNarration:
          "The soldiers of Mema would tell the story for decades. That the prince of Niani trained through sickness, through heat, through the long months of rain. That he asked for harder opponents until the trainers ran out of harder.\n\nBy the third year — you were not a man to be trained anymore. You were the one they watched. You were the one who made Moussa Tounkara’s best generals feel, for the first time in years, appropriately humble.\n\nYour body had become an argument no one could refute.",
      },
      {
        key: "B",
        text: "Learning the court — and protecting those the court ignored. I became the prince Mema needed, not just the warrior I wanted to be.",
        impact: { badenya: 1 },
        // Multi-part — delivered as two back-to-back clips.
        branchVideos: [v("branch-06-b-1.mp4"), v("branch-06-b-2.mp4")],
        branchNarration:
          "The soldiers would remember your speed and strength. The people of Mema would remember something else.\n\nThey would remember the morning you stopped a soldier from taking a farmer’s last grain. The way you ate with the lowest-ranked soldiers — not to perform humility, but because you genuinely preferred their company.\n\nMoussa Tounkara watched all of this. And at the end of the third year, he told you his strategy for every battle he had ever fought. He said: “A king who earns loyalty never has to demand it. Remember that.” You did.",
      },
      {
        key: "C",
        text: "At the feet of Mema’s elders at night. Battle strategies, jinn lore, the language of signs. I prepared the mind before the body.",
        impact: { nyama: 1 },
        branchVideo: v("branch-06-c.mp4"),
        branchNarration:
          "The elders of Mema had knowledge most had stopped seeking. Jinn lore — the systematic understanding of forces moving beneath the visible world. Battle proverbs that contained tactical genius in their poetry.\n\nYou drank it all. By the third year — you could read the mood of a battle before it began.\n\nYou understood why Soumaoro the Sorcerer was truly dangerous — not because of his power alone, but because he had made power synonymous with himself. That understanding would be the weapon that defeated him. Not iron. Not armies. Understanding.",
      },
    ],
  },

  /* ----- SCENE 7 — THE CALL TO RETURN ----- */
  {
    id: "return",
    act: 2,
    index: 7,
    title: "The Call to Return",
    setupVideo: v("scene-07-return.mp4"),
    poster: poster("scene-07-return.jpg"),
    scored: true,
    prompt:
      "Sogolon is gone. The people are calling. The road is open.\n\nHow do you answer?",
    choices: [
      {
        key: "A",
        text: "I leave within the hour. Alone if no one will follow. The Manden will not wait for me to prepare.",
        impact: { fadenya: 1 },
        branchNarration:
          "You left within the hour. Moussa Tounkara tried to give you a cavalry escort. You said: “Let them come if they choose to. I will not wait.”\n\nTwelve men followed you out of the gate that evening. By the time you had walked three days west — the news of your return traveling ahead of you like fire through dry grass — you had three hundred.\n\nBy the time you reached the borderlands of the Manden — twelve kings had sent messengers. Not because you had asked them. Because no one wanted to be standing on the wrong side of the road when the lion passed.",
      },
      {
        key: "B",
        text: "I grieve three days — as my mother deserves. Then I send messengers to every allied king before I move. I return with an army of allies, not just a warrior.",
        impact: { badenya: 1 },
        branchNarration:
          "Three days you grieved. Properly. Completely. You washed your mother’s body yourself, with your own hands. You sat at her grave until the morning of the fourth day.\n\nAnd then — dry-eyed and clear — you began to work. You sent thirty messengers in thirty directions. Your message to each was the same single sentence: “Sogolon’s son is coming home.” That was enough.\n\nSoumaoro had soldiers. You had conviction. And conviction, in the mathematics of destiny, outweighs iron.",
      },
      {
        key: "C",
        text: "Before I leave Mema, I perform the proper ritual. I ask the earth, I consult the soothsayer at the river. I return when the signs align — and they do, within the week.",
        impact: { nyama: 1 },
        branchNarration:
          "You went to the river soothsayer — an old woman who had been reading the Manden’s future for forty years in patterns of river foam. She looked at you for a long time. Then she said: “Not yet. Three days.”\n\nOn the third day — a delegation arrived from the twelve kings. They brought your father’s griot Balla Fasséké, escaped from Soumaoro. And he brought the secret of Soumaoro’s power: a cock’s spur on an arrow.\n\nThe soothsayer’s three days had found you the weapon no army could have captured. And the war would be decided by wisdom.",
      },
    ],
  },

  /* ----- SCENE 8 — STRATEGY AGAINST SOUMAORO ----- */
  {
    id: "krina",
    act: 3,
    index: 8,
    title: "Strategy Against Soumaoro",
    setupVideo: v("scene-08-krina.mp4"),
    poster: poster("scene-08-krina.jpg"),
    scored: true,
    prompt:
      "The army of Sosso comes over the horizon. Twelve kings look to you.\n\nAnd you made a choice.",
    choices: [
      {
        key: "A",
        text: "We charge. Direct assault — full cavalry, wave after wave. Break their center. Give Soumaoro no time to breathe.",
        impact: { fadenya: 1 },
        branchNarration:
          "The charge was like thunder answering itself. Your cavalry split three ways — left flank, right flank, and you — directly through the center.\n\nSoumaoro’s sorcery was real. The first wave hit a wall of invisible force. But you kept riding. Because you understood something about fear: it depends on you stopping. Keep moving, and fear becomes wind.\n\nYou cut through the center. Soumaoro saw you coming. And for the first time in a decade of unopposed conquest — he hesitated. That hesitation cost him everything.",
      },
      {
        key: "B",
        text: "I speak first. Before any sword is drawn — I address the twelve kings in council. Bind their loyalty with words and covenant so that no man breaks ranks when the sorcery hits.",
        impact: { badenya: 1 },
        branchNarration:
          "Before anyone drew a sword, you called the twelve kings together. They came — suspicious of each other, their old rivalries like live coals under the surface.\n\nYou said: “I am not asking you to fight for me. I am asking you to fight for the Manden. When we win — none of you will bow to me. We will build a covenant. Together. The Manden Charter.”\n\nSilence. Then the eldest of the twelve kings stood: “I follow the Maghan.” One by one, the others rose. When Soumaoro’s army saw twelve kings advancing as a single force — the sorcery faltered. Because Nyama draws on the fractures between people. And you had sealed every fracture.",
      },
      {
        key: "C",
        text: "We use Nana Triban’s arrow. I position our archers, choose the moment of spiritual vulnerability — and neutralize his Nyama before the armies even meet.",
        impact: { nyama: 1 },
        branchNarration:
          "Your sister Nana Triban — held in Soumaoro’s court — had escaped to you carrying the secret she had spent years learning. A cock’s spur on an arrow, fired in the moment of Soumaoro’s ritual vulnerability.\n\nYou watched the battle’s opening movements from the ridge. Not from fear — from calculation. You waited. And then — between his fourth and fifth steps — you saw it. The gap. The exhale between his power and his protection.\n\n“Now,” you said. The arrow flew. It struck. And Soumaoro Kanté — the unconquered Sorcerer-King — understood that he had an enemy who had studied him more carefully than he had studied himself. The battle was over by afternoon.",
      },
    ],
  },

  /* ----- SCENE 9 — THE FINAL MORAL CHOICE ----- */
  {
    id: "final_moral",
    act: 3,
    index: 9,
    title: "The Final Moral Choice",
    setupVideo: v("scene-09-final-moral.mp4"),
    poster: poster("scene-09-final-moral.jpg"),
    scored: true,
    prompt:
      "You stand before the conquered city. The choice is yours. It has always been yours.\n\nHow does the Lion of Mali choose?",
    optionPreDelayMs: 2000,
    optionRevealDelayMs: 1000,
    choices: [
      {
        key: "A",
        text: "No mercy. Let the city burn. Let history see what happens to those who serve tyranny.",
        impact: { fadenya: 2 },
        branchNarration:
          "The city burned. You let it burn. Not from cruelty — or not only from cruelty. From a calculation that the cost of mercy, in this moment, might be a weakness future tyrants would test.\n\nThe walls of Sosso fell. Soumaoro’s tower — the one with the sixty kings’ skins — you had leveled. You stood in the ashes and felt, for a moment, the satisfaction of a finished thing. The twelve kings cheered.\n\nBut later — in the quiet — you would think of the families. The merchants. The children who had done nothing. You would build Mali great. But the honest griots would always add one careful line about Sosso. And you would know what that line cost.",
      },
      {
        key: "B",
        text: "Open the gates. Free every prisoner. Let Soumaoro’s people return to their families. The war is over — let the peace begin.",
        impact: { badenya: 2 },
        branchNarration:
          "You opened the gates. Every prisoner — every man, woman, child held in Soumaoro’s compounds — walked free. You stood at the gate as they passed. You did not make a speech. You simply stood there — so that each person could see who opened the gate.\n\nThen you called the soldiers of Sosso together: “Swear to the new Mali — and go home to your families with your dignity intact. Or walk away now, and never return.” Ninety percent of them swore.\n\nOne of the twelve kings said: “You are either the wisest king alive — or the most dangerous fool.” You smiled. “Ask me again in ten years,” you said. The griots would answer that question for eight centuries. And the answer was always the same.",
      },
      {
        key: "C",
        text: "I go to the sacred pool first. Justice must be aligned with the deeper forces. Then I decide.",
        impact: { nyama: 2 },
        branchNarration:
          "You walked alone to the sacred pool of Krina. In the pool’s surface — still and dark despite the fires — you asked: “Am I doing this right?” The answer came not in words. In images. You saw Sosso’s people — not as enemies. You saw the twelve kings waiting for your model of power. You saw your mother’s face.\n\nYou came back and made two decrees at once: the tower would be dismantled stone by stone. But the people would be freed. And you would build a courthouse — right where the tower had stood — administered by a council of elders from all twelve kingdoms.\n\n“What kind of justice is this?” one king asked. “The only kind that lasts,” you said.",
      },
    ],
  },
];

export const SCENE_ORDER: string[] = SCENES.map((s) => s.id);

/* ---------- Choice 10 — Legacy moment (optional, no score impact) ---------- */

export const LEGACY_CHOICE: LegacyChoice = {
  prompt:
    "As your first decree was written, the scribe asked one final question: “To whom, Great Maghan, shall the first recognition of the new Mali be dedicated?”\n\nHow do you honor Sogolon — your mother — in the first act of your reign?",
  options: [
    {
      key: "A",
      text: "Name the great square of Niani after her. Let every market day begin with her name.",
      tag: "LEGACY_PUBLIC",
    },
    {
      key: "B",
      text: "Order the replanting of the baobab I uprooted. Let it grow at her grave, tended by the state forever.",
      tag: "LEGACY_SACRED",
    },
    {
      key: "C",
      text: "Add a law to the Manden Charter — no woman of the Manden shall ever be made to beg at another’s door. In her name, specifically.",
      tag: "LEGACY_LIVING",
    },
  ],
};

/* ---------- Endings ---------- */

export const ENDINGS: Record<EndingId, Ending> = {
  true_lion_king: {
    id: "true_lion_king",
    title: "The True Lion King",
    subtitle: "The Maghan of Mali",
    endingVideo: v("ending-true-lion-king.mp4"),
    poster: poster("ending-true-lion-king.jpg"),
    narration:
      "This is the ending the griots return to when they want to remind the Manden what it is capable of.\n\nYou built it. Not alone — you were never alone. But you were the center that held. The Manden Charter — the covenant you forged with the twelve kings — became the foundation. The belief that power is only legitimate when it serves the people it holds.\n\nMali flourished. Trade routes opened like rivers finding the sea. Your mother’s grave stood beneath the great replanted baobab. Children played in its roots. They did not know they were playing in a legend. That is how the best legends work.\n\nThe griots would sing your name for eight hundred years. They are singing it now. Do you hear it?",
    reflection: {
      proverb:
        "The lion has two ears to hear the people, but one heart to lead them.",
      soulsMirror:
        "You have mastered the balance between your own ambition and the needs of your community. In your world today — where must you hold that balance?",
    },
    unlocksAmina: true,
  },

  iron_lion: {
    id: "iron_lion",
    title: "The Iron Lion",
    subtitle: "The Warrior Without Mercy",
    endingVideo: v("ending-iron-lion.mp4"),
    poster: poster("ending-iron-lion.jpg"),
    narration:
      "You won. That is not a small thing. Mali exists because you would not be stopped. You rose when no one believed you would stand. You charged when strategy said wait. You burned what needed to be burned.\n\nBut. The Manden Charter — you wrote it. The twelve kings signed it. And then they watched you govern. What they saw was a king of extraordinary power and compressed patience. Who sometimes burned what could have been bent.\n\nThe griots will call you The Iron Lion. They will say your name with respect — and with a certain careful distance. Because fire that has no memory of warmth is still fire. But it forgets, sometimes, what it was burning for.\n\nYou built Mali. You protected it. And somewhere, in the long quiet of a successful reign — you would ask yourself a question you couldn’t answer: Is victory enough?",
    reflection: {
      proverb:
        "A fire that devours the forest leaves nothing but ashes to sleep on.",
      soulsMirror:
        "You conquered every obstacle through sheer will. But victory can be lonely. Are you winning your battles at the cost of your peace?",
    },
    unlocksAmina: true,
  },

  wise_builder: {
    id: "wise_builder",
    title: "The Wise Builder",
    subtitle: "The Custodian of the Covenant",
    endingVideo: v("ending-wise-builder.mp4"),
    poster: poster("ending-wise-builder.jpg"),
    narration:
      "The covenant. That is what they will remember first. Not the battles — though the battles were real. The covenant.\n\nThe Manden Charter — which you insisted upon, which you protected over the protests of generals who wanted simpler power — it became the document that changed what the Manden believed was possible. Rights for the ordinary people. Limits on what kings could demand. Protection for strangers, for women, for those without weapons.\n\nScholars in the twenty-first century will call it one of the first human rights declarations in recorded history. And they will trace it back to a decision you made after a battle when you could have done anything. And you chose to write down what was right.\n\nThe griots will call you The Custodian of the Covenant. You built something that outlasted you. That is the only real victory.",
    reflection: {
      proverb:
        "One finger cannot lift a stone; it takes the whole hand to build a kingdom.",
      soulsMirror:
        "You chose the path of unity and tradition. Your strength comes from those who stand with you. Who are the ‘ancestors’ in your life you need to thank today?",
    },
    unlocksAmina: true,
  },

  sorcerer_king: {
    id: "sorcerer_king",
    title: "The Sorcerer-King",
    subtitle: "The Master of Nyama",
    endingVideo: v("ending-sorcerer-king.mp4"),
    poster: poster("ending-sorcerer-king.jpg"),
    narration:
      "They said you were otherworldly. And they were not wrong — but they misunderstood what that meant. You did not deal in fear-magic. You were nothing like Soumaoro.\n\nWhat you had — what you cultivated across every year of exile, every careful consultation — was understanding. Deep understanding. The kind that takes lifetimes to accumulate. The jinn of the Manden respected you. Not because you commanded them. Because you listened.\n\nYour reign was quiet in the way that deep wells are quiet — all the activity hidden. You ended conflicts before they became wars. You chose allies not by their declarations but by the quality of their silences.\n\nThe griots call you The Master of Nyama. In a world that shouts to be heard — you learned to listen your way to wisdom. And the ancestors whisper your name to each other. Even now.",
    reflection: {
      proverb: "The hunter who knows the secrets of the woods never needs to run.",
      soulsMirror:
        "You see what others miss. You win through wisdom and hidden truths. Are you trusting your intuition — or are you overthinking the path ahead?",
    },
    unlocksAmina: false,
  },

  seeking_son: {
    id: "seeking_son",
    title: "The Seeking Son",
    subtitle: "The Unready Heir",
    endingVideo: v("ending-seeking-son.mp4"),
    poster: poster("ending-seeking-son.jpg"),
    narration:
      "You are not ready. And that is not a failure.\n\nThe iron is still straight in your hands. The baobab still stands. The road is still open. But something — fear, or uncertainty, or the weight of choosing — kept you between the paths.\n\nHere is what the griots know that they do not always say: Sundiata did not rise in a single day. He fell many times on the road to standing. He doubted. He grieved. He sat in dust while the world moved around him.\n\nThe legend is not about a man who was always ready. It is about a man who, eventually, chose to become ready. Come back. Take a different path. Let yourself choose more completely.\n\nThe lion is in you. He is simply waiting for you to stop being afraid of him.",
    reflection: {
      proverb: "The sun does not wait for the traveler to wake up.",
      soulsMirror:
        "Your legend is still being written, but the iron is cooling. What is holding you back from standing up and claiming your destiny right now?",
    },
    unlocksAmina: false,
  },

  mothers_hidden_lion: {
    id: "mothers_hidden_lion",
    title: "The Mother's Hidden Lion",
    subtitle: "The Heart of Sogolon",
    endingVideo: v("ending-mothers-hidden-lion.mp4"),
    poster: poster("ending-mothers-hidden-lion.jpg"),
    isSecret: true,
    narration:
      "This is the ending the griots only share with those who earned it. Not through strength. Not through sorcery. Not even through wisdom. Through love.\n\nYou chose — at every moment the story offered you a choice — to honor the one who held you when no one else would. You chose Sogolon. Again and again. When defiance would have been easier. When the world offered you other things to want. You chose her. And in doing so — you chose the source.\n\nThe griots say there is a pool — deep in the sacred grove of the Manden — where you can see the face of the ancestor who loved you before you were lovable. If you look into that pool — you see Sogolon. And she sees you. And the two of you look so much alike that the water cannot decide which reflection to show.\n\nYou are not separate, Sundiata. You are the continuation of her love. Every just decree, every gate opened, every prisoner freed — it was her hands, still working. Through yours.\n\nThe river flows far. But it never forgets its source.",
    reflection: {
      proverb: "The river flows far, but it never forgets its source.",
      soulsMirror:
        "You understand that true power is not taken — it is inherited through love and sacrifice. How can you honor your roots while still growing your own branches?",
    },
    unlocksAmina: true,
  },
};

/* ---------- Amina teaser ---------- */

export const AMINA: AminaTeaser = {
  video: v("amina-teaser.mp4"),
  poster: poster("amina-teaser.jpg"),
  narration:
    "Eight hundred years after the lion of Niani walked… far to the north — in a kingdom called Zazzau, in the land you would one day call Nigeria — a girl was born.\n\nThey said she was born with a war fetish clutched in her infant hand. Her grandmother named her after the grandmother that came before — a name that meant: ‘one who has her own.’\n\nShe would grow to become: Queen. Warrior. Conqueror of fourteen years of continuous victory. Builder of the walls they still call by her name. Queen Amina of Zazzau.\n\nAnd on the night before her greatest battle — her griot would sing her the story of the boy who could not walk — who stood — who roared — who built a world — and she would say, very quietly: “Good. I have something to prove worthy of.”\n\nHer story is coming. But tonight — you carried the first one. And the Manden thanks you for it.",
  ctaText: "Queen Amina of Zazzau — Her story comes next. Join the waiting list ➜",
};

/* ---------- Lookups ---------- */

export const SCENE_MAP: Map<string, Scene> = new Map(
  SCENES.map((s) => [s.id, s])
);

export function getScene(id: string): Scene | undefined {
  return SCENE_MAP.get(id);
}

export function isScoredScene(id: string): boolean {
  return SCENE_MAP.get(id)?.scored ?? false;
}

export function getActLabel(act: 1 | 2 | 3): string {
  return {
    1: "Act I — The Child Who Could Not Walk",
    2: "Act II — Exile and Becoming",
    3: "Act III — The Lion Rises",
  }[act];
}
