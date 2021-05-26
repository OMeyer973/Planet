import { makeNoise2D, makeNoise3D } from "fast-simplex-noise";
export const simplex2 = makeNoise2D();
export const simplex3 = makeNoise3D();

export declare type Noise1Fn = (x: number) => number;
export declare type Noise2Fn = (x: number, y: number) => number;
export declare type Noise3Fn = (x: number, y: number, z: number) => number;
export declare type Noise4Fn = (
  x: number,
  y: number,
  z: number,
  w: number
) => number;

export interface Options {
  amplitude?: number;
  frequency?: number;
  octaves?: number;
  persistence?: number;
}

function processOptions(options: Options) {
  return {
    amplitude: typeof options.amplitude === "number" ? options.amplitude : 1.0,
    frequency: typeof options.frequency === "number" ? options.frequency : 1.0,
    octaves:
      typeof options.octaves === "number" ? Math.floor(options.octaves) : 1,
    persistence:
      typeof options.persistence === "number" ? options.persistence : 0.5,
  };
}

export const ridge3 = (x: number, y: number, z: number) => {
  const v = 1 - Math.abs(simplex3(x, y, z));
  return v * v;
};

export function fractalNoise3(
  x: number,
  y: number,
  z: number,
  noise3: Noise3Fn,
  options?: Options
) {
  if (options === void 0) {
    options = {};
  }
  var _a = processOptions(options),
    amplitude = _a.amplitude,
    frequency = _a.frequency,
    octaves = _a.octaves,
    persistence = _a.persistence;
  var value = 0.0;
  for (var octave = 0; octave < octaves; octave++) {
    var freq = frequency * Math.pow(2, octave);
    value +=
      noise3(x * freq, y * freq, z * freq) *
      (amplitude * Math.pow(persistence, octave));
  }
  return value / (2 - 1 / Math.pow(2, octaves - 1));
}
