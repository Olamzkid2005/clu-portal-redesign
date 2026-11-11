/* A tiny, hand-authored Lottie scene: three soft colour fields drifting behind
   the student illustration. Kept local so there is no external asset or licence
   dependency. */

const ease = {
  i: { x: [0.42], y: [1] },
  o: { x: [0.58], y: [0] },
};

const orbLayer = (
  ind: number,
  name: string,
  color: [number, number, number],
  size: number,
  start: [number, number],
  end: [number, number],
  opacity: [number, number]
) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm: name,
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [opacity[0]], e: [opacity[1]], ...ease },
        { t: 180, s: [opacity[1]], e: [opacity[0]], ...ease },
        { t: 360, s: [opacity[0]] },
      ],
    },
    r: { a: 0, k: 0 },
    p: {
      a: 1,
      k: [
        { t: 0, s: [start[0], start[1], 0], e: [end[0], end[1], 0], ...ease },
        { t: 180, s: [end[0], end[1], 0], e: [start[0], start[1], 0], ...ease },
        { t: 360, s: [start[0], start[1], 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: {
      a: 1,
      k: [
        { t: 0, s: [100, 100, 100], e: [114, 114, 100], ...ease },
        { t: 180, s: [114, 114, 100], e: [100, 100, 100], ...ease },
        { t: 360, s: [100, 100, 100] },
      ],
    },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [size, size] },
        },
        {
          ty: "fl",
          c: { a: 0, k: [color[0], color[1], color[2], 1] },
          o: { a: 0, k: 100 },
        },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
    },
  ],
  ip: 0,
  op: 360,
  st: 0,
  bm: 0,
});

export const heroAmbient = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 360,
  w: 640,
  h: 520,
  nm: "Hero ambient",
  ddd: 0,
  assets: [],
  layers: [
    orbLayer(1, "rose", [0.827, 0.655, 0.639], 300, [180, 170], [238, 128], [22, 40]),
    orbLayer(2, "sage", [0.682, 0.78, 0.714], 250, [470, 150], [412, 226], [18, 34]),
    orbLayer(3, "plum", [0.706, 0.494, 0.533], 190, [500, 400], [444, 340], [14, 28]),
  ],
};
