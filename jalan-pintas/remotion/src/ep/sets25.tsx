// 2.5D sets: painted flat layers in 3D, unlit. SIDE = road along +x, camera looks -z. AXIS = road along -z (riders ride away from +z).
import React, { useMemo } from 'react';
import * as THREE from 'three';

export type V3 = [number, number, number];
export type Tex = Record<string, THREE.Texture>;
const aspect = (t: THREE.Texture) => { const im: any = t.image; return im.width / im.height; };

/** Flat sprite standing on the ground: p = bottom centre, h = height (m). */
export const Sprite: React.FC<{ tex: THREE.Texture; p: V3; h: number; color?: string; opacity?: number; ry?: number; fog?: boolean; order?: number }> =
  ({ tex, p, h, color = '#ffffff', opacity = 1, ry = 0, fog = true, order }) => {
    const w = h * aspect(tex);
    return (
      <group position={p} rotation={[0, ry, 0]}>
        <mesh position={[0, h / 2, 0]} renderOrder={order}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} alphaTest={0.02} fog={fog} toneMapped={false} />
        </mesh>
      </group>
    );
  };

/** Additive light (glow / pool / cone). r rotates the quad. */
export const Add: React.FC<{ tex: THREE.Texture; p: V3; s: [number, number]; color: string; opacity?: number; r?: V3 }> = ({ tex, p, s, color, opacity = 0.8, r = [0, 0, 0] }) => (
  <mesh position={p} rotation={r} renderOrder={20}>
    <planeGeometry args={s} />
    <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} side={THREE.DoubleSide} />
  </mesh>
);

/** Ground quad (lies flat). */
export const Flat: React.FC<{ tex: THREE.Texture; p: V3; s: [number, number]; color?: string; rep?: [number, number]; rz?: number }> = ({ tex, p, s, color = '#ffffff', rep, rz = 0 }) => {
  const t = useMemo(() => { if (!rep) return tex; const c = tex.clone(); c.repeat.set(rep[0], rep[1]); c.needsUpdate = true; return c; }, [tex, rep?.join()]);
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, rz]}>
      <planeGeometry args={s} />
      <meshBasicMaterial map={t} color={color} toneMapped={false} />
    </mesh>
  );
};

/** Vertical strip (walls), repeating texture. */
const Strip: React.FC<{ tex: THREE.Texture; p: V3; s: [number, number]; ry?: number; color?: string; rep?: number }> = ({ tex, p, s, ry = 0, color = '#ffffff', rep = 1 }) => {
  const t = useMemo(() => { const c = tex.clone(); c.repeat.set(rep, 1); c.needsUpdate = true; return c; }, [tex, rep]);
  return (
    <mesh position={p} rotation={[0, ry, 0]}>
      <planeGeometry args={s} /><meshBasicMaterial map={t} color={color} toneMapped={false} />
    </mesh>
  );
};

/** A big painted backdrop that always faces the camera direction it was built for (no fog). */
const Back: React.FC<{ tex: THREE.Texture; p: V3; h: number; ry?: number; color?: string }> = ({ tex, p, h, ry = 0, color }) => (
  <Sprite tex={tex} p={p} h={h} ry={ry} fog={false} color={color} />
);

const Lamp: React.FC<{ t: Tex; p: V3; ry?: number; lit?: boolean; pool?: boolean }> = ({ t, p, ry = 0, lit = true, pool = true }) => (
  <group>
    <Sprite tex={t.pole} p={p} h={9} color="#7a80a8" ry={ry} />
    {lit && <Add tex={t.glow} p={[p[0] - 0.5 * Math.cos(ry), 6.4, p[2] + 0.5 * Math.sin(ry)]} s={[2.6, 2.6]} color="#ffd6a0" opacity={0.9} />}
    {lit && pool && <Add tex={t.glow} p={[p[0], 0.03, p[2] + (ry ? 0 : 1.6)]} s={[7, 5]} color="#ffcf8f" opacity={0.45} r={[-Math.PI / 2, 0, 0]} />}
  </group>
);

// ---------------- SIDE layouts (road along x, camera on +z looking -z) ----------------
export const JalanSide: React.FC<{ t: Tex; x0: number; lamps?: boolean }> = ({ t, x0, lamps = true }) => {
  const X = Math.round(x0 / 18) * 18;
  return (
    <group>
      <color attach="background" args={['#090b20']} />
      <fog attach="fog" args={['#121438', 14, 70]} />
      <Back tex={t.sky} p={[x0 * 0.9, -14, -95]} h={80} />
      <Back tex={t.skyFar} p={[x0 * 0.6 - 6, -0.5, -46]} h={14} color="#8d88c8" />
      <Sprite tex={t.trees} p={[X - 30, 0, -12]} h={9} color="#2e3360" />
      <Sprite tex={t.trees2} p={[X + 12, 0, -14]} h={8} color="#2e3360" />
      <Flat tex={t.dirt} p={[X, -0.01, -10]} s={[220, 40]} rep={[40, 8]} color="#3a3a4a" />
      <Flat tex={t.asphalt} p={[X, 0, 0]} s={[5, 220]} rep={[1, 30]} color="#9a9ec0" rz={Math.PI / 2} />
      <Strip tex={t.wallL} p={[X, 0.75, -2.9]} s={[220, 1.5]} rep={22} color="#9aa0c6" />
      {[-36, -18, 0, 18, 36].map((dx) => <Lamp key={dx} t={t} p={[X + dx, 0, -3.3]} lit={lamps && ((X + dx) / 18) % 3 !== 1} />)}
      {/* foreground parallax: kerb + passing poles */}
      <Strip tex={t.kerb} p={[X, 0.09, 2.7]} s={[220, 0.18]} rep={44} color="#c0c4dc" />
      {[-25, 0, 25].map((dx) => <Sprite key={dx} tex={t.pole} p={[Math.round(x0 / 25) * 25 + dx + 9, 0, 4.2]} h={9} color="#3a3f58" order={30} />)}
    </group>
  );
};

export const TokoSide: React.FC<{ t: Tex }> = ({ t }) => (
  <group>
    <color attach="background" args={['#141634']} />
    <fog attach="fog" args={['#1c1d46', 16, 70]} />
    <Back tex={t.sky} p={[0, -10, -90]} h={80} />
    <Back tex={t.skyFar} p={[-4, -0.5, -42]} h={14} color="#8d88c8" />
    <Sprite tex={t.skyNear} p={[8, 0, -26]} h={9} color="#b3b0dd" />
    <Flat tex={t.asphalt} p={[0, 0, 0]} s={[5, 80]} rep={[1, 11]} color="#8c90ad" rz={Math.PI / 2} />
    <Flat tex={t.dirt} p={[0, -0.01, 4]} s={[80, 8]} rep={[16, 2]} color="#4a4a5a" />
    <Flat tex={t.paving} p={[0, 0.01, -6]} s={[40, 7]} rep={[8, 1]} color="#c9cde0" />
    <Sprite tex={t.toko} p={[0.6, 0, -8.6]} h={5.4} />
    <Add tex={t.glow} p={[0.6, 2.2, -8.0]} s={[16, 9]} color="#ffd8a8" opacity={0.5} />
    <Add tex={t.glow} p={[0.6, 4.1, -8.2]} s={[10, 3.5]} color="#ff8a2a" opacity={0.55} />
    <Add tex={t.glow} p={[0.6, 0.02, -5.0]} s={[14, 7]} color="#ffe6c4" opacity={0.45} r={[-Math.PI / 2, 0, 0]} />
    <Sprite tex={t.pole} p={[-4.6, 0, -5.4]} h={10} color="#9aa0c0" />
    <Add tex={t.glow} p={[-4.1, 6.9, -5.3]} s={[2.4, 2.4]} color="#ffd6a0" opacity={0.85} />
    {/* foreground: kerb, drain, puddle catching the shop light */}
    <Strip tex={t.kerb} p={[0, 0.09, 2.6]} s={[80, 0.18]} rep={16} color="#d0d4ea" />
    <Add tex={t.glow} p={[1.2, 0.02, 1.8]} s={[3.5, 1.2]} color="#ffb070" opacity={0.35} r={[-Math.PI / 2, 0, 0]} />
    <Sprite tex={t.pole} p={[-2.2, 0, 3.6]} h={10} color="#3a3f58" order={30} />
  </group>
);

export const RelSide: React.FC<{ t: Tex; x0: number }> = ({ t, x0 }) => {
  const X = Math.round(x0 / 30) * 30;
  return (
    <group>
      <color attach="background" args={['#1a0607']} />
      <fog attach="fog" args={['#2a0b0d', 9, 50]} />
      <Back tex={t.skyRed} p={[x0 * 0.9, -14, -95]} h={80} />
      <Sprite tex={t.trees3} p={[X - 20, 0, -16]} h={12} color="#5a1c1e" />
      <Sprite tex={t.trees3} p={[X + 14, 0, -12]} h={10} color="#3a1012" />
      <Flat tex={t.dirt} p={[X, -0.01, -10]} s={[220, 40]} rep={[44, 8]} color="#5a3632" />
      <Flat tex={t.rail} p={[X, 0, -2.4]} s={[2.4, 220]} rep={[1, 24]} color="#c98a7a" rz={Math.PI / 2} />
      {[-60, -30, 0, 30, 60].map((dx) => (
        <group key={dx}>
          <Sprite tex={t.signal} p={[X + dx + 6, 0, -4.4]} h={4.5} color="#d9b0b0" />
          <Add tex={t.glow} p={[X + dx + 6, 3.95, -4.3]} s={[3.2, 3.2]} color="#ff2a2a" opacity={0.9} />
        </group>
      ))}
      {[-24, 0, 24].map((dx) => <Sprite key={dx} tex={t.fog} p={[X + dx, 0, -6]} h={2.4} opacity={0.6} order={3} />)}
    </group>
  );
};

// ---------------- AXIS layouts (road along z, riders head -z) ----------------
export const JalanAxis: React.FC<{ t: Tex; z0: number; dark?: boolean }> = ({ t, z0, dark }) => {
  const Z = Math.round(z0 / 20) * 20;
  return (
    <group>
      <color attach="background" args={['#090b20']} />
      <fog attach="fog" args={['#0c0e2a', 6, 46]} />
      <Back tex={t.sky} p={[0, -12, z0 - 95]} h={80} />
      <Back tex={t.skyFar} p={[0, -0.5, z0 - 50]} h={14} color="#8d88c8" />
      <Back tex={t.sky} p={[0, -12, z0 + 95]} h={80} ry={Math.PI} />
      <Sprite tex={t.trees} p={[-7.5, 0, z0 - 26]} h={8} color="#2e3360" />
      <Sprite tex={t.trees2} p={[8.5, 0, z0 - 20]} h={7} color="#2e3360" />
      <Flat tex={t.dirt} p={[0, -0.01, Z]} s={[40, 200]} rep={[8, 40]} color="#2c2c38" />
      <Flat tex={t.asphalt2} p={[0, 0, Z]} s={[5, 200]} rep={[1, 26]} color="#a2a6c2" />
      {[-1, 1].map((s) => <Strip key={s} tex={s < 0 ? t.wallL : t.wallR} p={[s * 2.9, 0.75, Z]} s={[200, 1.5]} ry={-s * Math.PI / 2} rep={20} color="#9aa0c6" />)}
      {[-40, -20, 0, 20].map((dz) => <Lamp key={dz} t={t} p={[2.4, 0, Z + dz]} lit={!dark || Z + dz > z0 + 2} pool />)}
    </group>
  );
};

export const RelAxis: React.FC<{ t: Tex; z0: number }> = ({ t, z0 }) => {
  const Z = Math.round(z0 / 20) * 20;
  return (
    <group>
      <color attach="background" args={['#1a0607']} />
      <fog attach="fog" args={['#2a0b0d', 7, 44]} />
      <Back tex={t.skyRed} p={[0, -12, z0 - 95]} h={80} />
      <Back tex={t.skyRed} p={[0, -12, z0 + 95]} h={80} ry={Math.PI} />
      <Sprite tex={t.trees3} p={[-6, 0, z0 - 30]} h={12} color="#5a1c1e" />
      <Sprite tex={t.trees3} p={[9, 0, z0 - 22]} h={10} color="#3a1012" />
      <Sprite tex={t.trees3} p={[6, 0, z0 + 26]} h={11} color="#4a1416" ry={Math.PI} />
      <Flat tex={t.dirt} p={[0, -0.01, Z]} s={[40, 200]} rep={[8, 40]} color="#5a3632" />
      <Flat tex={t.rail} p={[-2.1, 0, Z]} s={[2.4, 200]} rep={[1, 22]} color="#c98a7a" />
      {[-48, -24, 0, 24].map((dz) => (
        <group key={dz}>
          <Sprite tex={t.signal} p={[-3.8, 0, Z + dz - 6]} h={4.5} color="#d9b0b0" />
          <Add tex={t.glow} p={[-3.8, 3.95, Z + dz - 5.9]} s={[3.4, 3.4]} color="#ff2a2a" opacity={0.9} />
        </group>
      ))}
      {[-6, -12, -20].map((dz, i) => <Sprite key={dz} tex={t.fog} p={[i % 2 ? 1.6 : -1.6, 0, z0 + dz]} h={2.6} opacity={0.65} order={3} />)}
    </group>
  );
};
