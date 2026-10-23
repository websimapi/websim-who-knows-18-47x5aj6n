// Title-screen manual. Rules are described here; full character lore is read
// from the same soul and memory files used by the AI.
import { SUSPECTS, CORE_WEAPONS, SECONDARY_WEAPONS, ROOM_LIST, ROOM_BY_ID, itemName } from "./data.js";
import { PROPS } from "./layout.js";
import { TASKS, TOOL_NAME } from "./tasks.js";
import {organizeManual} from "./manual-content.js";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const SPECIAL_ITEMS = [
  ["rag", "Killers can wipe nearby fresh blood once. The rag becomes bloodied and can be found or disposed of. A rag also works for the bathroom chore."],
  ["bleach", "Killers can pour while holding it to leave a wet trail. Its contents are limited, and the trail can be noticed."],
  ["towel", "Killers can dry nearby wet bleach marks. The towel becomes damp."],
  ["lens", "Hold the Lens of Truth to see blood wiped with a rag or water mop. Bleach removes the trace; pocketing the Lens stops the effect."],
  ["coin", "Keep it in a pocket: on a killing night it crumbles and walks you to the safest room. The butler covets it. A used or given-away coin turns up again the day after a killing night."],
  ["torch", "Lights the tunnels. Relight it at a burning fireplace or stove; water puts it out."],
  ["bandage", "Use while bleeding to close a wound before the next night ends. Found in the kitchen and office."]
];
const displayName = (kind) => ({ watering: "Watering Can", cue: "Billiard Cue" })[kind] || (itemName(kind) === kind ? kind[0].toUpperCase() + kind.slice(1) : itemName(kind));
const LOOSE_KINDS = [...new Set(PROPS.map((p) => p.kind))].sort((a, b) => displayName(a).localeCompare(displayName(b)));
const assetImage = (kind) => "<span class='manual-object-image'><img data-manual-visual='prop:" + kind + "' alt='' loading='lazy'></span>";
const itemRow = (kind, description) => "<tr><td><span class='manual-object-name'>" + assetImage(kind) + "<strong>" + esc(displayName(kind)) + "</strong></span></td><td>" + description + "</td></tr>";
const roomCard = (room) => "<div class='manual-room-card'><span class='manual-room-image'><img data-manual-visual='room:" + room.id + "' alt='Floor plan of the " + esc(room.name) + "' loading='lazy'></span><b>" + esc(room.name) + "</b>" + (["kitchen", "bathroom", "lounge", "office"].includes(room.id) ? "<small>Trapdoor to the tunnels</small>" : "<small>Murder location</small>") + "</div>";

const PAGES = organizeManual([
  {id:'core-cards',label:'Core thoughts',title:'Core Cards & Character Beliefs',html:"<p>Today’s Story is your character’s hand of Core Cards. Portrait cards show room-specific icons, companion markers and a short category label; hover or focus a card for its detail, or tap to reveal it on mobile. There are three slots by default; Notes → Core Cards allows a fourth. Direct questions in conversation still take priority. Unused slots remain inactive card backs until useful information supports a card. Brief sightings of yourself and routine lingering stay in Notes. Sustained room visits, remembered company and potential corroboration can become opening memories.</p><p>A Room visit records your own account. Company means you remember someone nearby; a potential Alibi identifies someone who may corroborate part of your account, not guaranteed innocence. You never gain knowledge of another character’s private memories from these cards.</p><p>Notes are weighted by source, visibility, trust, persuasion, skepticism, observation and memory. Belief percentages are character judgments, not guaranteed probabilities of guilt. Repeated gossip does not become independent proof. Conflicting direct observations reduce support.</p><p>Accusation cards name a person, room and weapon and require greater than 75% support. A verified, clear line-of-sight murder observation receives a Witness tag and 100%; merely sharing the room, hearing an account or seeing a body does not qualify.</p><p>Cards first become eligible after one minute of active day-one play, and only when useful evidence or sustained memories support them. They update periodically as new notes arrive after that and compile at day end in the background. Opening-day updates are staggered and pause for a guest while they are in conversation. Manual slot selections remain in place during those automatic opening-day updates until you explicitly recompile or a new daily compilation occurs. Recompile early in Notes (10-second cooldown), inspect supporting notes, and restore any still-valid archived card into a chosen slot. AI ranking can choose existing cards but cannot invent evidence or change confidence. It falls back to deterministic ranking if unavailable.</p><p>Finish your task early and efficiently to improve the automatic room-investigation roll. Measured quality and your observation/curiosity stats affect the check. Missing attempt telemetry uses neutral quality. A success can reveal a real point of interest; hidden contents still require opening or searching. Failure provides no invented discovery.</p><p><b>A staged scene can fool you.</b> A Location theory names a possible killing room, not a proven one. Discovery location, observed blood, dragging, cleaning items and soul traits affect belief. Only an actual, sufficiently covered search can supply a negative blood finding. Using the Lens makes that finding more informative but never conclusive; bleach and missed areas remain possible. Knowing about the Lens without using it grants no search result. A nearby weapon may have been planted. A body finder learns only what is actually visible near the body, not the engine’s hidden murder weapon. You can discuss a Core theory as an uncertain explanation.</p><p>Before a discovered body or witnessed attack, conversations stay social: guests chat about the house, why they came and its old legend, each with their own view of it. A guest nobody has seen for too long makes people uneasy and they start asking after them, but nobody talks about murder until a body is found. Opening recollections are not spoken as claims of innocence. Flicker observations receive priority and cards recompile when that phase ends: only actual visible company and weapons count, gaps remain unknown, and a later watch cannot clear an earlier killing.</p><p>Killers receive private cover-story and framing objectives. An NPC killer prioritizes a witness next time a kill is legal only if it actually knows who witnessed it. Verified firsthand murder witnesses gain +3 on persuasion rolls, not deception or physical pocket checks.</p><p>Voting strikes out self, dead and conclusively ruled-out choices. A diamond highlights your strongest supported choice; killers instead see a framing recommendation that protects their partner. Belief is not certainty, and a failed full combination does not disprove each individual component.</p><p>Darkness affects noticing clues, not whether a person physically exists on screen. People around hallway corners and open doorways remain rendered behind normal wall and door occlusion. Lights follow their switches and flicker state rather than your viewing direction.</p><p>Diagnostic reporting stores game-generated dialogue, offered choices, Core Card decisions, observed flicker coverage, rolls and match outcomes in an owner-readable database archive. Pending reports retry when connectivity returns. Reports are partial and client-reported; they do not authorize game actions. Microphone audio and account credentials are not collected.</p><p>Exact event times require your character’s own watch or an accurate clock they could see. Ivo carries a pocket watch. The dining clock is not reliable until set. Without a reading, characters recall events without an exact timestamp.</p>"},
  {id:'hair-permission',label:'Haircut permission',title:'Ask Before the Trim',html:"<p>Hold the Kitchen Knife and speak with a living human avatar who has usable hair. Share your haircut task in dialogue. Your request is spoken before the share-task roll. A human recipient chooses Allow or Refuse; an NPC can decline according to the roll, trust and personality. Success never removes the right to refuse.</p><p>The reply is spoken in the recipient's own voice. Only after an affirmative reply finishes do both characters walk to the bathroom barber chair. Refusing ends the exchange without moving anyone. At the chair, cut 15% of the starting groom to finish the task; either person may leave. Sneak cutting still uses a separate stealth contest. Robots have no hair, and a haircut task is waived when fewer than two living human avatars with usable hair remain.</p>"},
  {id:'pockets',label:'Pockets & D Rolls',title:'Asking to Check Pockets',html:"<p>Look directly at an available guest within talking distance for a moment to let your opening choices prepare. If you initiate, your character speaks the first greeting; an NPC who approaches you speaks first. Guests may excuse themselves according to their temperament and the conversation; after their farewell finishes, the exchange ends automatically. Direct accounts use you/your when referring to the person being addressed, while third-party accounts retain names. Greetings and direct address can naturally use a name, such as “Thanks, Tomas” or “Sera, can we talk?” without replacing it with “you.” Up to eight choices are ranked by the current question and your actual knowledge. Direct answers and witnessed murders get priority; hearsay stays attributed, and you can say you cannot confirm something or decline to answer. While anyone waits on dialogue AI, the shared round countdown runs at one-tenth speed; background preparation and spoken playback do not slow it. Private inner thoughts are labelled and do not animate mouths; actual spoken dialogue animates the speaker. Speech captions appear on the left, with responses at the bottom only when speech finishes. D Rolls appear at the lower right. Ask during conversation. The request finishes speaking before the recipient chooses <b>Allow</b>, <b>Refuse</b>, or another conversational reply. Each guest has their own way of saying yes or no.</p><p><b>Allow:</b> after the reply finishes speaking, the pockets are shown freely. There is <b>no D Roll</b>.</p><p><b>Refuse or change the subject:</b> after the reply finishes speaking, both guests roll a d20. The requester uses observation, stealth and persuasion; the responder uses observation, skepticism and boldness. Soul strengths and weaknesses add bonuses or penalties. A weighted score of 0.75 or higher grants advantage (roll twice, keep higher); 0.35 or lower gives disadvantage (keep lower). Compare the adjusted totals. The requester must be strictly higher; a tie preserves the refusal.</p><p>If the requester wins against refusal, they privately glimpse what looks like the pocket contents. The responder remains unaware and gains no suspicion from this exchange. If the responder wins, their pockets stay private and they become suspicious of the asker. The requester learns no contents and gets no imagined item thought. Only pocket items are checked, not objects held openly in hands. Shared rendering snapshots do not include pocket contents; an authorized successful check reveals them privately to the requester. A resolved check is limited to once per requester and recipient each night.</p><p>Private thoughts use the character's soul voice. The conversation ends after the check so both guests can continue investigating. If speech is unavailable, the displayed line is given reading time before resolution; an interrupted exchange reveals nothing. A speech failure or timeout safely closes the exchange; you can ask again.</p>"},
  {id:'conversation',label:'Talk & voices',title:'Conversation and Character Voices',html:"<p>Conversation partners stop walking and turn toward one another. <b>Chat</b> choices are available even when you have no useful evidence to share. Questions about a specific action keep that action as their topic, rather than being replaced by an unrelated sighting or alibi.</p><p>Open <b>Settings → Character voices</b> to enable sound, choose Automatic, Generated voice or Device voice, select installed male/female device voices, and test a sample. Automatic falls back to generated audio when a device voice fails. Availability still depends on the browser and speech service. Mouths follow spoken dialogue; private thoughts do not move lips.</p><p>Moving human hair reacts to walking, turning and wind. Short grooms retain their styled support; long locks keep their lengths after collision or cutting. NPCs plan around furniture and open door leaves, recover from obstructed corners, open clear doors as needed, and close them only when the crossing is clear. Barricaded doors remain blocked.</p>"},

  {id:'avatars',label:'Bodies & hair',title:'Human and Robot Guests',html:"<p>Avatar settings change appearances, not who controls a seat. The default <b>Humans</b> button gives every seat a human body, including AI guests. The <b>Mixed</b> button shows human players as humans and AI guests as hairless solid-color robots. <b>Robots</b> makes everyone a hairless robot. The icon buttons change appearances only; AI still fills empty seats.</p><p>Online: only the host changes this below Killer settings. Local: choose below Back.</p><p>Each human has their own face, clothes, footwear and moving strand hair. Portraits here use the actual human game model. Press <b>Ctrl + backtick</b> for the character studio. Inspect shoes, outfits, face angles, mouth poses, movement, blinking or speech, and experiment with haircuts. The title background always showcases human guest bodies. Preview cuts do not change a match.</p>"},
  {id:'barber',label:'Cut Hair',title:'The Bathroom Barber Chair',html:"<p>Hold the <b>Kitchen Knife</b> and share your haircut task in conversation. A d20 uses your stealth and persuasion against their attention and trust. A human recipient still chooses Accept or Decline.</p><p>With permission, both guests walk to the bathroom barber chair. Drag across the hair in the cutting view. Remove <b>15% of its original total length</b> to complete the task; Leave cancels.</p><p>Alternatively, aim at a living human-form guest with the knife and use <b>T / Use</b> for a stealth roll against their observation. If successful, you have a brief manual cutting opportunity. Being seen makes the roll harder.</p><p>Robots and dead guests cannot be haircut targets. Assignments stop when fewer than two eligible living human-form guests remain. An impossible task is waived without penalty.</p><p>A killer may win permission, lead the guest to the chair, then use the private betrayal option. Normal kill-day and one-kill rules still apply.</p>"},
  {id:'lighting',label:'Light & darkness',title:'Switches, Lamps and Sight',html:"<p><b>Flashlight travel:</b> holding the Flashlight lets you use halls, doors and basement ladders during the flicker. A mutually accepted team-up extends this to a living, conscious partner within five metres and a clear path. Being near an unrelated light carrier does not count. Dropped, pocketed or gone flashlights grant no protection; torches do not grant this travel permission. When protection ends, your character runs to the nearest reachable refuge, then closes its doors. If already sheltered, they close the doors and stay. Paired ladder travel has a three-second hand-off at the same hatch so a partner can follow between floors. The light carrier must remain beside the other end. Separating beyond that protection triggers retreat.</p><p>Look for a wall switch beside each room entrance. Use the normal interact key to turn ceiling lights on or off. Floor lamps and the portable desk lamp have separate switches; aim at the lamp to toggle it.</p><p>Dark rooms are much harder to see into. Your guest also has less range and confidence when noticing people, evidence and events. A nearby silhouette may still be noticed. Hearing does not improve with light.</p><p>Fires, torches and lamps can provide local pools of light. The murder-phase blackout can override normal fixtures. Human mouths move with spoken audio; private inner thoughts do not move their lips.</p>"},
  {
    id: "start", label: "Start here", title: "How to Play",
    html: [
      "<p class='manual-lead'>Eight guests enter the mansion. One or two are secretly killers. Explore, listen, and decide whose story the evidence supports.</p>",
      "<div class='manual-facts'><div class='manual-fact'><b>Explore</b><span>Move through rooms, handle objects, and learn who was where.</span></div><div class='manual-fact'><b>Survive</b><span>A killer can strike on any day; unmet deadlines force a flicker.</span></div><div class='manual-fact'><b>Accuse</b><span>Name the killer, the weapon, and the room at the table.</span></div></div>",
      "<h3>The rhythm of a match</h3>",
      "<ol><li>You receive a secret role: Killer or Savior. AI guests fill seats without human players.</li><li>Each night has an exploration period. Rooms, people, and weapons you encounter become part of your story. The notes book records facts you learned.</li><li>Killers may strike on any exploration day. A kill is first required by day 2 with one killer or day 3 with two. An early kill satisfies that deadline and moves the next required slot to day 4 or 6. An unmet deadline triggers the mandatory flicker.</li><li>After a murder, the halls reopen for a body search. The accusation table only convenes once a body has been found; until then the weekend stays social, though a guest unseen for too long makes everyone uneasy. After the first discovery, the table meets at the end of every later night. If no body is ever found by the final night, the killer leaves undetected.</li><li>The table hears proposals and rebuttals, then votes. A correct killer, weapon, and room catches the killer.</li></ol>",
      "<p class='manual-note'>Each exploration night lasts about two minutes. After a murder the killer gets a short dark period, then the living have two minutes to find the body. The murderer is assigned anew each match; character history never reveals the current answer.</p>"
    ].join("")
  },
  {
    id: "saviors", label: "Saviors", title: "Playing a Savior",
    html: [
      "<p class='manual-lead'>Stay alive long enough to prove what happened. A good accusation connects a person, a weapon, and a room to an actual murder.</p>",
      "<h3>Gather a reliable account</h3>",
      "<ul><li>Visit rooms, notice which weapons are present or missing, and watch who carries what.</li><li>Talk with guests, compare their accounts, and ask to search pockets when the conversation offers that choice.</li><li>Open cupboards, wardrobes, chests, and search bins. A body may be concealed in large storage or an unlit fireplace away from the trapdoors.</li><li>Look for blood, cleaning, damp marks, and bodies. Inspecting a body reveals evidence and can trigger the table.</li><li>Use the Lens of Truth in your hand to reveal blood wiped with a rag or the butler's water mop. Bleach removes that trace. Your notes book separates your observations from things another guest told you.</li><li>After the spoken line and options are ready, a guest waits for your answer. Calm, warm guests and guests who trust you wait longer, up to about 30 seconds. When their patience runs out, a d20 decides whether they wait again or get annoyed and leave, which costs a little trust.</li><li>A <b>Share</b> choice tells something you saw yourself. A <b>Pass on</b> choice repeats what someone told you or what you overheard, and names that person.</li><li>The storage chests in the game room and the library can be pushed along the wall in front of a door. A barricaded door can't be opened from either side until someone pushes the chest back, and guests go around through another door.</li><li>During a blackout, you are kept inside a room. Remember who could reach that room when the lights return.</li></ul>",
      "<h3>At the table</h3>",
      "<p>Choose Who, With what, and Where. Listen to proposals, offer a rebuttal when your own evidence disproves one, then cast your vote. A tie causes another vote. All three parts must match the same murder. In a two-killer match, catching one killer leaves the other in play.</p>",
      "<p>One killer faces a final table by night seven; two killers play as far as night ten. Do not treat a character's biography as proof. The current round's sightings, objects, testimony, and physical evidence are what matter.</p>"
    ].join("")
  },
  {
    id: "killer", label: "Killer", title: "Playing the Killer",
    html: [
      "<p class='manual-lead'>Keep your role hidden, isolate a guest, and survive the accusation table. Other guests are watching your movements and your hands.</p>",
      "<h3>Before the lights fail</h3>",
      "<ul><li>Find a weapon, learn the rooms, and notice where other guests travel. One handed weapons leave a wound on the first strike and kill on the second. You can carry two one handed weapons at once.</li><li>A first strike commits you to that victim for the night. If they survive, they leave small blood drops until they use a bandage. An untreated wound is fatal after the following night.</li><li>Speak naturally, but remember that witnesses can compare your claims with their own sightings. Deceit can sound like ordinary testimony or practical cooperation; its category is private to the player choosing it. Evidence wording preserves its source, certainty and time.</li><li>During a flicker, look at a closed door or up from a tunnel trapdoor and use the alternate action to peek. A stealth d20 roll can reveal who is inside without exposing you. Fail, and you are spotted and rush inside; if someone is there, you must kill them even with a witness present. A witness remembers the murder and will keep accusing you.</li><li>A target in the same room may be attacked on any exploration day. At most one completed murder can occur per day, shared by both killers. Required slots are days 2, 4, 6 and so on with one killer, or 3, 6, 9 with two. An early completed kill satisfies the upcoming slot and advances the requirement to the next slot; merely wounding someone does not. The HUD shows the next required day.</li></ul>",
      "<h3>After a murder</h3>",
      "<p>You get a short period before the halls reopen. With both hands free, you can drag an unfound body toward a trapdoor and down to the tunnels, or into a large wardrobe, chest, cellar barrel, or unlit fireplace in a room without a trapdoor. Body dragging has a limited daily strength budget and leaves a trail. Hold a small object and use a cupboard to hide it in one step. Two fresh rags arrive every night, and killing nights bring an extra bleach spray bottle. Near a water-cleaned bloodstain, you see an outline that other guests cannot see without the Lens of Truth. Bleach removes the hidden trace. Each action can leave clues or be witnessed.</p>",
      "<p>In the tunnels you can knock a guest unconscious and drag them, but you cannot murder them there. A found body may be reported; the killer can also make a false report about another living guest if the game offers that choice.</p>",
      "<h3>Winning and losing</h3>",
      "<p>The killer wins if only one Savior remains or the final accusation fails. In a two-killer match both killers must have made a kill for a failed final accusation to count as their victory. A correct accusation catches a killer; catch both and the Saviors win.</p>"
    ].join("")
  },
  {
    id: "tasks", label: "Tasks", title: "Daily Tasks",
    html: [
      "<p class='manual-lead'>Each morning every Savior is handed one chore. Walk to the station, press the action key, and finish its little mini-game.</p>",
      "<div class='manual-facts'><div class='manual-fact'><b>Finish it</b><span>+1 trust with every other Savior.</span></div><div class='manual-fact'><b>Skip it</b><span>When the day ends, roll 1d4 and lose that much trust with each Savior.</span></div><div class='manual-fact'><b>No Task</b><span>One morning in five you get the day off. No penalty.</span></div></div>",
      "<h3>The chores</h3><table class='manual-table'><thead><tr><th>Task</th><th>Where</th><th>How</th></tr></thead><tbody>",
      TASKS.map((t) => "<tr><td><strong>" + t.icon + " " + esc(t.title) + "</strong>" + (t.tool ? "<br><small>Needs " + esc(TOOL_NAME[t.tool]) + "</small>" : "") + "</td><td>" + esc(t.room ? ROOM_BY_ID[t.room]?.name || t.room : "A random room") + "</td><td>" + esc(t.how) + "</td></tr>").join(""),
      "</tbody></table>",
      "<h3>Good to know</h3>",
      "<ul><li>Your task shows in the corner of the screen. Its station is marked ★ when you look at it.</li><li>You can play any station, but only your own task earns trust.</li><li>Walking away, a conversation, or the lights failing closes the mini-game. Start it again when you are back.</li><li>Other guests see the work happen: chopped lettuce, darts in the board, a new painting on the easel, a clean bathroom, a defragmented screen.</li><li>The killer's card reads <b>Kill required</b> when the deadline is due. Otherwise it shows an optional early kill / cleanup and the next required day. Killers can play stations too, to look busy.</li><li>The butler has his own chores on quiet nights: trash, floors and restocking the bathroom.</li></ul>"
    ].join("")
  },
  {
    id: "butler", label: "The butler", title: "The Butler",
    html: [
      "<div class='manual-character-head'><span class='manual-avatar-image'><img data-manual-visual='guest:butler' alt='Mr. Grimsby human game model' loading='lazy'></span><div><h3>Mr. Grimsby</h3><p>A lean, lined face, receding silver hair, charcoal livery, white gloves and polished black derbies. He appears human in Only Human Avatars mode.</p></div></div>",
      "<p class='manual-lead'>On nights without a murder the butler walks the house doing his chores. He sees a lot. He tells the truth very rarely.</p>",
      "<ul><li>Talk to him to ask what he has seen. Getting a straight answer takes a roll of 18 to 20 on a d20.</li><li>Fail the roll and he lies to you. The lie goes into your notes as something he told you, and you may well believe it.</li><li>He remembers whoever pried at him and failed. He will spread lies about that guest to the others.</li><li>If you carry the Lucky Coin he will ask for it. Hand it over and he answers one question truthfully, stops lying about you, and will tell you why the coin matters if you ask.</li><li>He doesn't care about blood. He mops with water in his assigned rooms and wherever he sees hallway stains. The blood disappears from ordinary sight, but the Lens of Truth still reveals it until a killer uses bleach. He takes bin bags outside, bloody rags and all, and restocks the bathroom with bleach and towels. He stays out of the cellar and tunnels.</li><li>The other guests use him too, each in their own way. Curious, trusting guests seek him out more often. Skeptics doubt what he tells them. A guest who catches him in a lie avoids him afterwards. A guest who isn't superstitious may trade the coin for the truth.</li><li>He stays away on days with an outstanding required kill.</li></ul>"
    ].join("")
  },
  {
    id: "evidence", label: "Evidence & votes", title: "Follow the Evidence",
    html: [
      "<p class='manual-lead'>The game records what a guest could know. A clue heard from someone else is not the same as a clue you observed yourself.</p>",
      "<h3>Your notes book</h3>",
      "<p>Today’s Story contains your Core Cards rather than a touch-to-collect checklist. Observations and accounts feed your character’s changing beliefs; the card faces use icons and reveal details on hover, focus or tap. Open Notes for the Who / What / Where sheet and the Investigation Log. Mark possibilities with a cross, check, or question mark. These marks are your own working notes; they do not change the match. The Investigation Log tab lists facts you learned and identifies their source.</p>",
      "<h3>What can leave a trail?</h3>",
      "<ul><li><strong>Sightings:</strong> a guest in a room at a time, someone carrying a weapon, or someone near a body. You only see what is in front of you. A close, direct look keeps detail, a far or sidelong glimpse keeps only that someone was there, and a guest behind you goes unseen.</li><li><strong>Physical traces:</strong> fresh blood, the smaller drops left by a bleeding guest, wiped blood revealed by a lens, bleach marks, a bloodied rag, a damp towel, or items found in a bin.</li><li><strong>Conversation:</strong> direct statements, overheard claims, contradictions, and a search that exposes what someone carries.</li><li><strong>Body evidence:</strong> its discovery, nearby weapon, room, and an approximate time of death.</li></ul>",
      "<h3>How the table works</h3>",
      "<ol><li><strong>Propose:</strong> each living guest selects another living guest, weapon, and room. You cannot accuse yourself, murdered guests, or caught killers.</li><li><strong>Rebut:</strong> use a fact you know to challenge an incompatible proposal, or stay silent.</li><li><strong>Vote:</strong> choose the final triple. The table tallies each category; tied categories are voted on again.</li><li><strong>Reveal:</strong> only a triple matching an actual murder catches a living killer.</li></ol><p>A wrong person/weapon/room combination is remembered and cannot be submitted again until a new body is discovered. A new day alone does not clear it. NPCs avoid it too. If separate category majorities recreate a disproved triple, the table reopens voting; a repeated deadlock uses its most supported eligible complete ballot. When a locked person choice is yourself, you abstain on that category.</p>"
    ].join("")
  },
  {
    id: "objects", label: "Objects & tools", title: "Objects in the House",
    html: [
      "<p class='manual-lead'>These are the actual objects you will see in the mansion. Look at one within reach to see its action prompt. You have two hands and two pockets; large objects use both hands.</p>",
      "<h3>Tools and special items</h3><table class='manual-table manual-object-table'><thead><tr><th>Object</th><th>What it does</th></tr></thead><tbody>",
      ...SPECIAL_ITEMS.map(([kind, description]) => itemRow(kind, description)),
      "</tbody></table>",
      "<h3>Core weapons</h3><p>These five weapons begin in fitting rooms of the mansion. The label shows how many hands each needs.</p>",
      "<div class='manual-object-grid manual-weapon-grid'>" + CORE_WEAPONS.map((w) => "<div class='manual-object-tile manual-weapon-tile'>" + assetImage(w.id) + "<strong>" + esc(w.name) + "</strong><small>" + w.hands + " hand" + (w.hands === 2 ? "s" : "") + "</small></div>").join("") + "</div>",
      "<h3>Secondary weapons</h3><p>Find the kitchen knife on a kitchen counter, rope in the tunnels, a two handed sword at a knight statue at the end of a hallway, and a halberd held by the knight near the lounge. They can also be used in an accusation.</p>",
      "<div class='manual-object-grid manual-weapon-grid'>" + SECONDARY_WEAPONS.map((w) => "<div class='manual-object-tile manual-weapon-tile'>" + assetImage(w.id) + "<strong>" + esc(w.name) + "</strong><small>" + w.hands + " hand" + (w.hands === 2 ? "s" : "") + "</small></div>").join("") + "</div>",
      "<h3>Loose props</h3><p>Pick up, carry, place, drop, or throw these objects. Most have no special Use action.</p>",
      "<div class='manual-object-grid'>" + LOOSE_KINDS.map((kind) => "<div class='manual-object-tile'>" + assetImage(kind) + "<strong>" + esc(displayName(kind)) + "</strong></div>").join("") + "</div>",
      "<h3>Furniture and routes</h3><p>Open cupboards, pantry storage, drawers, bookshelves, wardrobes, chests, cellar barrels, and filing furniture to find stashed items. Hold a small item and use a cupboard to hide it; opening the cupboard reveals its contents. Opening large storage or a closed barrel can reveal a body. Check unlit fireplaces too. Search bins or place small items in them. Doors open and close; trapdoors and ladders connect the house to the tunnels. Seats, fireplaces, the stove, and the billiard table have their own actions. Furniture also shapes movement and sightlines.</p>"
    ].join("")
  },
  {
    id: "mansion", label: "The mansion", title: "Rooms & Hidden Routes",
    html: [
      "<p class='manual-lead'>These overhead plans use the current room layout, furniture, doors, and trapdoors. Nine rooms can be murder locations. The cellar holds the accusation table.</p>",
      "<div class='manual-room-grid'>" + ROOM_LIST.map(roomCard).join("") + roomCard(ROOM_BY_ID.cellar) + "</div>",
      "<h3>The hidden routes</h3>",
      "<div class='manual-route-card'><span class='manual-room-image'><img data-manual-visual='room:tunnels' alt='Floor plan of the underground tunnels and ladders' loading='lazy'></span><div><strong>Underground tunnels</strong><p>Four trapdoors, in the kitchen, bathroom, lounge, and office, lead to ladders below. The tunnels are dark. Carry a lit torch to find your way. A killer can hide a body or knock someone unconscious here, but murders happen in rooms above.</p></div></div>",
      "<p>Rooms open onto shared halls. During lights out, doors slam shut and Saviors stay in refuge unless holding a flashlight or staying with a nearby flashlight-bearing teammate. Look for the center prompt to use a door, trapdoor, ladder, cupboard, seat, fireplace, stove, bin, or billiard table.</p>"
    ].join("")
  },
  {
    id: "controls", label: "Controls", title: "Controls",
    html: [
      "<p class='manual-lead'>The prompt at the center of the screen names the action available where you are looking. Click the game view during play to capture the mouse.</p>",
      "<table class='manual-table'><thead><tr><th>Action</th><th>Keyboard + mouse</th><th>Second keyboard</th><th>Controller</th></tr></thead><tbody>",
      "<tr><td>Move / look</td><td>WASD / mouse</td><td>Arrow up/down to move; left/right to turn</td><td>Left / right sticks</td></tr>",
      "<tr><td>Use, talk, pick up</td><td>E or left click</td><td>Enter</td><td>A</td></tr>",
      "<tr><td>Act / attack</td><td>F or right click</td><td>Right Shift</td><td>X</td></tr>",
      "<tr><td>Use held tool</td><td>T</td><td>Page Up</td><td>RB</td></tr>",
      "<tr><td>Pocket / take out</td><td>G</td><td>Delete</td><td>R3</td></tr>",
      "<tr><td>Drop / back</td><td>Q</td><td>Backspace</td><td>B</td></tr>",
      "<tr><td>Throw</td><td>R</td><td>Page Down</td><td>LB</td></tr>",
      "<tr><td>Notes</td><td>Tab or N</td><td>Numpad +</td><td>Y</td></tr>",
      "<tr><td>Run</td><td>Left Shift</td><td>Right Ctrl</td><td>RT</td></tr>",
      "<tr><td>Toggle crouch</td><td>X</td><td>Numpad ÷</td><td>LT / L2</td></tr>",
      "<tr><td>Camera</td><td>V</td><td>End</td><td>L3</td></tr>",
      "<tr><td>Check secret role</td><td>Hold C</td><td>Hold Home</td><td>Back replays the role buzz</td></tr>",
      "<tr><td>Pause</td><td>Esc or P</td><td>Numpad *</td><td>Start</td></tr>",
      "</tbody></table>",
      "<h3>Dialogue and voting with a controller</h3><p>Visible dialogue choices show direct buttons: A/B/X/Y, LB/RB and LT/RT for choices 1–8. PlayStation shows Cross/Circle/Square/Triangle, L1/R1 and L2/R2. D-pad or stick can still move the highlight; D-pad right selects it. These shortcuts do nothing while speech hides the options. At the voting table, use LB/RB for columns, A/Cross to select and Y/Triangle to submit.</p>",
      "<h3>Touch and VR</h3>",
      "<p>Press crouch once to lower your stance and walk at half speed; press it again to stand. On mobile, tap Crouch or Stand up above the movement stick. Sprinting resumes after you stand. Sitting, dialogue, tasks and forced movement return you to standing. VR uses your headset posture.</p>",
      "<p>On touch screens, use the left stick to move, swipe the scene to look, and tap the on-screen actions. If your browser offers VR, use headset direction to look and move, the right trigger to act, and the right grip to grab or release an object. A quick release can throw it.</p>",
      "<p class='manual-note'>In split screen, each player joins with a separate control set: keyboard and mouse, the arrow-key layout, or a controller. The game displays the relevant prompt for each player.</p>"
    ].join("")
  },
  {
    id: "ghosts", label: "After death", title: "After Death",
    html: [
      "<p class='manual-lead'>Death does not remove you from the mansion. You return as a ghost who can still observe and interfere.</p>",
      "<h3>What a ghost can do</h3>",
      "<ul><li>Move through the house and watch the living. A caught killer in a two-killer match also becomes a ghost.</li><li>Once each night, lift a loose object and carry it for up to 15 seconds. Drop or throw it before it slips away. The ordinary item prompts show what you can lift; murder weapons are unavailable.</li><li>Living guests may see an object move by itself. A thrown object can frighten someone and become part of their account.</li></ul>",
      "<div class='manual-after-death'><span class='manual-ghost-image'><img data-manual-visual='ghost:blue' alt='The game's translucent blue ghost avatar' loading='lazy'></span><div><h3>What you look like</h3><p>Ghosts use the same translucent, faintly glowing character model seen in the mansion. Their color still hints at which guest they were.</p></div></div>",
      "<h3>Movement and stamina</h3><p>Living guests can run, but sprinting drains stamina. Slow down to recover before a chase or a long trip through the house. This is the same movement bar shown during play:</p>",
      "<div class='manual-stamina-examples'><div><span>Ready to run</span><div class='stamina'><span class='stamina-fill' style='width:85%'></span><small>STAMINA</small></div></div><div><span>Exhausted</span><div class='stamina exhausted'><span class='stamina-fill' style='width:18%'></span><small>EXHAUSTED</small></div></div></div>",
      "<p class='manual-note'>A ghost cannot make an accusation or perform the living guests' ordinary inventory and conversation actions.</p>"
    ].join("")
  },
  {
    id: "modes", label: "Play modes", title: "Solo, Co-op & Online",
    html: [
      "<h3>Solo</h3><p>Choose a guest under Play Local. You face seven AI guests and can use keyboard, mouse, touch, or a connected controller.</p>",
      "<h3>Local split screen</h3><p>Choose Co-op split screen. Each of two players joins with their own control set and picks a different guest; six AI guests fill the rest. The two local players always share a role. If either would be the killer, both become killers, and the round uses the two-killer rules. Keep your role hidden from anyone else watching.</p>",
      "<h3>Online</h3><ol><li>Choose Play Online, then host a lobby or enter a four-character lobby code.</li><li>Each human player chooses an available guest. The host may select one or two killers.</li><li>When everyone has chosen, the host starts. Empty seats become AI guests. Up to six people can join one online lobby.</li></ol>",
      "<p>The host's game runs the shared match; other players receive its updates. The title screen may also show a live match or an AI demonstration while you decide how to play.</p>"
    ].join("")
  },
  {
    id: "characters", label: "Characters", title: "The Guests",
    html: ""
  }
]);

const titleCase = (value) => value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const byId = Object.fromEntries(SUSPECTS.map((s) => [s.id, s]));
const traitNames = ["observation", "memory", "deception", "boldness", "sociability", "curiosity", "tidiness", "superstition", "restlessness"];

function parseSoul(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { fields: {}, prose: raw };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pos = line.indexOf(":");
    if (pos > 0) fields[line.slice(0, pos).trim()] = line.slice(pos + 1).trim();
  }
  return { fields, prose: match[2] };
}
function renderProse(raw) {
  return raw.trim().split(/\n\s*\n/).filter(Boolean).map((block) => {
    if (block.startsWith("# ")) return "";
    const safe = esc(block).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
    return "<p>" + safe.replace(/\n/g, "<br>") + "</p>";
  }).join("");
}

export function setupManual() {
  const dialog = document.querySelector("#gameManual");
  const article = document.querySelector("#manualPage");
  const nav = document.querySelector("#manualNav");
  const count = document.querySelector("#manualCount");
  const prevButton = document.querySelector("#manualPrev");
  const nextButton = document.querySelector("#manualNext");
  let current = 0;
  let selectedCharacter = SUSPECTS[0].id;
  let isOpen = false;
  let priorFocus = null;
  let lore = null;
  let lorePromise = null;
  let visualRun = 0;

  async function hydrateVisuals() {
    const run = ++visualRun;
    const images = [...article.querySelectorAll("img[data-manual-visual]")].filter(img=>!img.getAttribute("src")&&!img.closest("details:not([open])"));
    if (!images.length) return;
    let manualImage;
    try { ({ manualImage } = await import("./manual-visuals.js")); }
    catch (error) {
      console.warn("Manual previews unavailable", error);
      if (run === visualRun) images.forEach((img) => { img.parentElement.classList.add("manual-image-unavailable"); });
      return;
    }
    for (const img of images) {
      if (run !== visualRun || !isOpen) return;
      // Give the page a frame between snapshots so navigation remains responsive.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (run !== visualRun || !isOpen) return;
      try {
        const src = await manualImage(img.dataset.manualVisual);
        if (src) img.src = src;
        else throw new Error(`No preview for ${img.dataset.manualVisual}`);
      } catch (error) {
        console.warn("Manual preview unavailable", img.dataset.manualVisual, error);
        img.parentElement.classList.add("manual-image-unavailable");
      }
    }
  }

  async function loadLore() {
    if (lorePromise) return lorePromise;
    lorePromise = Promise.all(SUSPECTS.map(async (suspect) => {
      try {
        const [soulResponse, memoryResponse] = await Promise.all([
          fetch("./npc/" + suspect.id + "/soul.md"),
          fetch("./npc/" + suspect.id + "/Memory.json")
        ]);
        if (!soulResponse.ok || !memoryResponse.ok) throw new Error("Character files unavailable");
        return [suspect.id, { soul: parseSoul(await soulResponse.text()), memory: await memoryResponse.json() }];
      } catch {
        return [suspect.id, { soul: { fields: {}, prose: suspect.soul }, memory: null }];
      }
    })).then((entries) => {
      lore = Object.fromEntries(entries);
      if (isOpen && PAGES[current].id === "characters") render(false);
      return lore;
    });
    return lorePromise;
  }

  function characterHtml() {
    const selector = "<div class='manual-cast' role='group' aria-label='Choose a guest'>" +
      SUSPECTS.map((s) => "<button type='button' data-character='" + s.id + "' style='--c:" + s.color + "' aria-current='" + (s.id === selectedCharacter) + "'>" + esc(s.name) + "</button>").join("") + "</div>";
    const s = byId[selectedCharacter];
    const record = lore?.[s.id];
    if (!record) return "<h2>The Guests</h2><p class='manual-lead'>Choose a guest to see their portrait and learn about their personality.</p>" + selector + "<p>Opening the character files…</p>";
    const fields = record.soul.fields;
    const memories = record.memory;
    const traits = traitNames.filter((key) => fields[key] !== undefined).map((key) =>
      "<span>" + esc(titleCase(key)) + " " + Math.round(Number(fields[key]) * 100) + "%</span>").join("");
    const voice = ["calmGreeting", "greeting", "legendLine", "farewell", "searchLine"].filter((key) => fields[key]).map((key) =>
      "<div class='manual-quote'><strong>" + esc(titleCase(key)) + ":</strong> " + esc(fields[key].replaceAll("{name}", "a guest")) + "</div>").join("");
    const relationships = Object.entries(memories?.relationships || {}).map(([id, entry]) =>
      "<li><strong>" + esc(byId[id]?.name || id) + ":</strong> " + esc(entry.note || "") + "</li>").join("");
    return "<h2>The Guests</h2><p class='manual-lead'>Each guest’s personality shapes what they notice, where they wander, and how they speak. These are character histories, not clues to the randomly assigned killer.</p>" +
      selector +
      "<div class='manual-character-head'><span class='manual-avatar-image'><img data-manual-visual='guest:" + s.id + "' alt='3D game model of " + esc(s.name) + "' loading='lazy'></span><div><span class='manual-subtitle'>" + esc(titleCase(s.id)) + " guest</span><h3>" + esc(s.name) + "</h3><p>Game character model in " + esc(titleCase(s.id)) + (s.id === "red" ? ": dark flowing hair, burgundy archive jacket, interview recorder and folio" : s.id === "yellow" ? ": textured ginger curls, ochre tailoring, pocket watch and timing notebook" : s.id === "copper" ? ": short auburn coily hair, utility belt, key ring and repair tools" : s.id === "teal" ? ": dark ash textured fringe, teal weather coat, barometer and field notebook" : s.id === "green" ? ": long dark natural curls, moss-green coat, folded field map and measuring tools" : s.id === "white" ? ": receding silver hair, wire spectacles, ivory coat and sage waistcoat" : s.id === "violet" ? ": black low bun, violet jacket, ivory blouse and archive notebook" : s.id === "blue" ? ": swept chestnut hair, blue jacket, press badge and recorder" : "") + ".</p></div></div>" +
      "<details class='manual-details'><summary>Details <span>Personality, habits & starting memories</span></summary><div class='manual-reference'><div class='manual-soul'>" + renderProse(record.soul.prose) + "</div>" +
      (traits ? "<h3>Behavior profile</h3><div class='manual-traits'>" + traits + "</div>" : "") +
      (fields.favorites ? "<p><strong>Favorite rooms:</strong> " + esc(fields.favorites) + ".</p>" : "") +
      (voice ? "<h3>How " + esc(s.short) + " speaks</h3>" + voice : "") +
      (memories ? "<h3>Starting memories</h3><p><strong>First impression:</strong> " + esc(memories.impression || "") + "</p><ul>" + memories.memories.map((line) => "<li>" + esc(line) + "</li>").join("") + "</ul>" +
        "<h3>Habits</h3><ul>" + (memories.habits || []).map((line) => "<li>" + esc(line) + "</li>").join("") + "</ul>" +
        "<h3>Starting opinions</h3><ul>" + relationships + "</ul>" : "") + "</div></details>";
  }

  function render(resetScroll = true) {
    const page = PAGES[current];
    document.querySelector("#manualTitle").textContent = page.title;
    let lastGroup='';
    nav.innerHTML = `<label class="manual-mobile-picker">Help section<select aria-label="Choose a help section">${PAGES.map((p,i)=>`<option value="${i}" ${i===current?'selected':''}>${esc(p.group)} · ${esc(p.label)}</option>`).join('')}</select></label>`+PAGES.map((item,index)=>{const heading=item.group!==lastGroup?`<span class="manual-nav-group">${esc(item.group)}</span>`:'';lastGroup=item.group;return heading+`<button type="button" data-page="${index}" aria-current="${index===current?'page':'false'}">${esc(item.label)}</button>`;}).join('');
    nav.querySelector('select').addEventListener('change',event=>setPage(Number(event.target.value)));

    article.innerHTML = page.id === "characters" ? characterHtml() : "<h2>" + esc(page.title) + "</h2>" + page.html;
    hydrateVisuals();
    count.textContent = (current + 1) + " / " + PAGES.length;
    prevButton.setAttribute('aria-label',current?'Previous: '+PAGES[current-1].title:'Previous section');
    nextButton.setAttribute('aria-label',current<PAGES.length-1?'Next: '+PAGES[current+1].title:'Next section');
    article.querySelectorAll('[data-help-page]').forEach(button=>button.addEventListener('click',()=>setPage(PAGES.findIndex(p=>p.id===button.dataset.helpPage))));
    article.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)hydrateVisuals();}));
    prevButton.disabled = current === 0;
    nextButton.disabled = current === PAGES.length - 1;
    if (resetScroll) article.scrollTop = 0;
    nav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPage(Number(button.dataset.page))));
    article.querySelectorAll("[data-character]").forEach((button) => button.addEventListener("click", () => {
      selectedCharacter = button.dataset.character;
      render();
      article.querySelector("[data-character='" + selectedCharacter + "']")?.focus();
    }));
  }
  function setPage(index) {
    current = Math.max(0, Math.min(PAGES.length - 1, index));
    render();
    article.focus({ preventScroll: true });
    if (PAGES[current].id === "characters") loadLore();
  }
  function open() {
    if (isOpen) return;
    priorFocus = document.activeElement;
    isOpen = true;
    dialog.classList.remove("hidden");
    setPage(0);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    visualRun++;
    dialog.classList.add("hidden");
    priorFocus?.focus?.();
  }

  document.querySelector("#titleHelpButton").addEventListener("click", open);
  document.querySelector("#manualClose").addEventListener("click", close);
  prevButton.addEventListener("click", () => setPage(current - 1));
  nextButton.addEventListener("click", () => setPage(current + 1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button:not([disabled]), summary, select, a[href], article[tabindex='0']")].filter(el=>el.getClientRects().length>0);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  return {
    get isOpen() { return isOpen; },
    close,
    previous: () => setPage(current - 1),
    next: () => setPage(current + 1)
  };
}
