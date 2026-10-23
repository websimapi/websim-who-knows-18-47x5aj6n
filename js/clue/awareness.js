import {SUSPECTS} from './data.js';
import {BODY_HIDES} from './layout.js';
import {trait} from './souls.js';
// Concern is character knowledge, never the hidden alive/role table.
// Three conversational states follow from it (see legend.js convoPhase):
// arrival (nothing known), uneasy (someone unseen too long), investigation
// (a body has been found or a violent act was witnessed).
const MISSING_AFTER=70; // seconds a guest can go unseen before an observer worries
const MORNING_GRACE=40; // a new day gives everyone time to come downstairs first
const VIOLENT=['body','kill','wound'];
const activeMissing=(c,f)=>f.kind==='personMissing'&&(c.lastContactSeen?.get(f.about)??-1)<f.reportAt;
export const AwarenessMethods={
 investigating(c){
  if(this.bodies.some(b=>b.found))return true;
  return [...(this.notes.get(c.id)?.facts.values()||[])].some(f=>VIOLENT.includes(f.kind)&&!(c.isKiller&&f.src==='self'));
 },
 hasConcern(c){
  if(this.investigating(c))return true;
  return [...(this.notes.get(c.id)?.facts.values()||[])].some(f=>activeMissing(c,f));
 },
 // Guests this character currently cannot account for.
 missingFor(c){
  const out=new Set();for(const f of this.notes.get(c.id)?.facts.values()||[])if(activeMissing(c,f))out.add(f.about);
  return [...out].filter(id=>!this.bodies.some(b=>b.found&&b.victim===id));
 },
 // The round table only convenes once someone has actually been found dead.
 tableNeeded(){return this.day>=2&&this.bodies.some(b=>b.found);},
 houseLastSeen(id){
  let last=-Infinity;for(const o of this.living())if(o.id!==id)last=Math.max(last,o.lastContactSeen?.get(id)??-Infinity);return last;
 },
 // An uneasy guest goes looking: a cupboard, chest or barrel they have not
 // opened today, favouring the room where they last saw the missing guest.
 // They choose among ordinary hiding places, never the true one.
 searchForMissing(c,goTo,openHide){
  const gone=this.missingFor(c)[0];if(!gone)return false;
  if(c.searchedDay!==this.day){c.searchedDay=this.day;c.searchedHides=new Set();}
  const lastRoom=[...this.notes.get(c.id).facts.values()].filter(f=>f.kind==='saw'&&f.about===gone).at(-1)?.room;
  const options=BODY_HIDES.filter(f=>f.cab&&!this.cabs.has(f.id)&&!c.searchedHides.has(f.id));
  if(!options.length)return false;
  const near=options.filter(f=>f.room===lastRoom||f.room==='cellar');
  const pool=near.length&&Math.random()<.6?near:options,f=pool[Math.floor(Math.random()*pool.length)];
  c.searchedHides.add(f.id);
  goTo(f.x+Math.sin(f.rot)*(f.fd/2+.7),f.z+Math.cos(f.rot)*(f.fd/2+.7),{arrive:()=>openHide(f.id)});
  return true;
 },
 checkMissingContacts(){
  if(this.time-(this.missingCheckedAt??-99)<5||this.overtime)return;this.missingCheckedAt=this.time;
  const dayStart=this.dayStartedAt??0;
  for(const c of this.living()){
   for(const [partner,formed]of c.expectedContacts||[]){
    const last=c.lastContactSeen?.get(partner)??formed;if(this.time-last<45)continue;
    this.learn(c.id,{kind:'personMissing',about:partner,day:this.day,reportAt:this.time,room:c.room},'self');
   }
   // A guest nobody in the house has seen for too long starts to worry this
   // guest (the absence is common talk, not hidden state). Sociable, observant
   // guests pick up on it sooner than solitary ones.
   const after=MISSING_AFTER*(1.35-trait(c.id,'sociability')*.35-trait(c.id,'observation')*.25);
   c.missingNoted??=new Map();
   for(const s of SUSPECTS){
    if(s.id===c.id)continue;
    const p=this.chars.get(s.id);if(!p||this.bodies.some(b=>b.found&&b.victim===s.id)||(!p.alive&&!this.bodies.some(b=>b.victim===s.id)))continue;
    const seen=c.lastContactSeen?.get(s.id)??-Infinity,last=Math.max(this.houseLastSeen(s.id),dayStart-after+MORNING_GRACE);
    if(this.time-last<after||(c.missingNoted.get(s.id)??-1)>seen)continue;
    c.missingNoted.set(s.id,this.time);
    this.learn(c.id,{kind:'personMissing',about:s.id,day:this.day,reportAt:this.time,room:c.room},'self');
   }
  }
 }
};
