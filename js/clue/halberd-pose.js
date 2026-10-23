// Two-handed halberd handling shared by the carry pose and the kill cutscene.
// The haft lies in a swing plane through the bearer's forward axis: theta is
// the haft's elevation in that plane (0 = level forward, PI/2 = straight up)
// and tilt leans the plane toward the right shoulder (+) or left (-). The haft
// is placed relative to the shoulders, then both arms reach it with IK so each
// hand closes on its own leather wrap.
import * as THREE from "three";
import { HALBERD } from "./weapons3d.js";

export const HALBERD_CARRY = { theta: 1.36, tilt: 0.12 };
const READY = 0.85, RAISED = 2.4, STRUCK = -0.32, SETTLED = -0.44;
const ease = (a, z, t) => { const v = THREE.MathUtils.clamp((t - a) / (z - a), 0, 1); return v * v * (3 - 2 * v); };

// Lift from the carry into a guard, haul the head up over the right shoulder,
// hold, then a heavy accelerating diagonal chop that follows through.
export function halberdSwing(u) {
  const guard = ease(0, 0.08, u), wind = ease(0.08, 0.36, u), hold = ease(0.36, 0.42, u);
  const raw = THREE.MathUtils.clamp((u - 0.42) / 0.13, 0, 1), blow = raw * raw * raw * (raw * (raw * 6 - 15) + 10);
  const follow = ease(0.55, 0.72, u);
  let theta = HALBERD_CARRY.theta + (READY - HALBERD_CARRY.theta) * guard;
  theta += (RAISED - READY) * wind + 0.08 * hold;
  theta += (STRUCK - RAISED - 0.08) * blow + (SETTLED - STRUCK) * follow;
  const tilt = HALBERD_CARRY.tilt + (0.38 - HALBERD_CARRY.tilt) * ease(0.04, 0.3, u) - 0.12 * follow;
  return { theta, tilt, wind, blow, follow };
}

// Where the middle of the two grips sits, from the shoulders: [theta, down, forward, right].
const HOLD = [[SETTLED, -0.46, 0.5, -0.02], [STRUCK, -0.42, 0.5, 0], [READY, -0.3, 0.4, 0.02], [HALBERD_CARRY.theta, -0.34, 0.3, 0.14], [RAISED + 0.08, 0.16, 0.08, 0.16]];
function holdAt(theta) {
  if (theta <= HOLD[0][0]) return HOLD[0].slice(1);
  for (let i = 1; i < HOLD.length; i++) if (theta <= HOLD[i][0]) {
    const a = HOLD[i - 1], b = HOLD[i], f = (theta - a[0]) / (b[0] - a[0]);
    return [1, 2, 3].map((k) => a[k] + (b[k] - a[k]) * f);
  }
  return HOLD[HOLD.length - 1].slice(1);
}

const v = () => new THREE.Vector3();
// The haft direction (local +X), axe edge (local +Z) and grip midpoint.
export function halberdFrame(bones, root, theta, tilt) {
  const yaw = root.rotation.y, forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(-forward.z, 0, forward.x), up = new THREE.Vector3(0, 1, 0);
  const planeUp = up.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(right, Math.sin(tilt));
  const aim = forward.clone().multiplyScalar(Math.cos(theta)).addScaledVector(planeUp, Math.sin(theta)).normalize();
  const edge = forward.clone().multiplyScalar(Math.sin(theta)).addScaledVector(planeUp, -Math.cos(theta)).normalize();
  const shoulders = bones.RightArm && bones.LeftArm
    ? bones.RightArm.getWorldPosition(v()).add(bones.LeftArm.getWorldPosition(v())).multiplyScalar(0.5)
    : root.position.clone().add(new THREE.Vector3(0, 1.42, 0));
  const [down, fwd, side] = holdAt(theta);
  const mid = shoulders.addScaledVector(up, down).addScaledVector(forward, fwd).addScaledVector(right, side);
  return { aim, edge, mid };
}

// Analytic two-bone IK: swing the upper arm so the elbow bends toward the
// pole, then the forearm so the wrist meets the target.
const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
function rotateBoneWorld(bone, from, to) {
  const delta = qa.setFromUnitVectors(from.normalize(), to.normalize());
  const world = bone.getWorldQuaternion(qb).premultiply(delta);
  const parent = bone.parent.getWorldQuaternion(new THREE.Quaternion());
  bone.quaternion.copy(parent.invert().multiply(world));
  bone.updateMatrixWorld(true);
}
function reach(upper, lower, hand, target, pole) {
  if (!upper || !lower || !hand) return;
  const s = upper.getWorldPosition(v()), e = lower.getWorldPosition(v()), h = hand.getWorldPosition(v());
  const l1 = e.distanceTo(s), l2 = h.distanceTo(e);
  const toT = target.clone().sub(s), d = THREE.MathUtils.clamp(toT.length(), Math.abs(l1 - l2) + 1e-3, (l1 + l2) * 0.999);
  const dir = toT.normalize();
  const bend = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
  const cosA = THREE.MathUtils.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const elbow = s.clone().addScaledVector(dir, cosA * l1).addScaledVector(bend, Math.sqrt(1 - cosA * cosA) * l1);
  rotateBoneWorld(upper, e.clone().sub(s), elbow.clone().sub(s));
  const e2 = lower.getWorldPosition(v()), h2 = hand.getWorldPosition(v());
  rotateBoneWorld(lower, h2.sub(e2), s.addScaledVector(dir, d).sub(e2));
}

// Pose the bearer around the haft. torso (optional) carries the swing phases;
// weight below 1 lets the arms relax back toward the animation.
export function poseHalberd(b, root, theta, tilt, torso = null, weight = 1) {
  const arms = ["RightArm", "RightForeArm", "LeftArm", "LeftForeArm"].map((n) => b[n]).filter(Boolean);
  const rest = arms.map((bone) => bone.quaternion.clone());
  if (torso && b.Spine2) {
    // Coil the chest away on the haul, uncoil and drive down through the chop.
    b.Spine2.rotation.y += 0.32 * torso.wind - 0.5 * torso.blow;
    b.Spine2.rotation.x += 0.08 * torso.wind - 0.24 * torso.blow + 0.05 * torso.follow;
  }
  root.updateMatrixWorld(true);
  const { aim, mid } = halberdFrame(b, root, theta, tilt);
  const yaw = root.rotation.y, forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), right = new THREE.Vector3(-forward.z, 0, forward.x);
  const gripMid = (HALBERD.rightGrip + HALBERD.leftGrip) / 2;
  for (const [side, grip, sign] of [["Right", HALBERD.rightGrip, 1], ["Left", HALBERD.leftGrip, -1]]) {
    const upper = b[side + "Arm"], hand = b[side + "Hand"];
    if (!upper || !hand) continue;
    const gripPoint = mid.clone().addScaledVector(aim, grip - gripMid);
    // Aim the wrist a palm's width short of the haft so the fingers wrap it.
    const target = gripPoint.clone().add(upper.getWorldPosition(v()).sub(gripPoint).setLength(0.075));
    const pole = new THREE.Vector3(0, -1, 0).addScaledVector(right, sign * 0.7).addScaledVector(forward, -0.25);
    reach(upper, b[side + "ForeArm"], hand, target, pole);
  }
  if (weight < 1) { arms.forEach((bone, i) => bone.quaternion.slerp(rest[i], 1 - weight)); root.updateMatrixWorld(true); }
}

// Seat the prop so the grip midpoint lies on the frame's hold point.
export function placeHalberd(g, frame) {
  const { aim, edge, mid } = frame;
  const y = edge.clone().cross(aim).normalize();
  g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(aim, y, aim.clone().cross(y)));
  const inner = g.userData.inner, r = g.userData.p?.r ?? 0.13;
  const haftY = (inner?.position.y || 0) - r + 0.028;
  g.position.copy(mid).sub(new THREE.Vector3((HALBERD.rightGrip + HALBERD.leftGrip) / 2, haftY, 0).applyQuaternion(g.quaternion));
}
