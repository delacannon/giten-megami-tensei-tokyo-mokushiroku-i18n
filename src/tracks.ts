export interface Track {
  name: string;
  url: string;
}

export type DownloadFormat = 'vgz' | 'mml';

export interface SongFiles {
  name: string;
  files: Record<DownloadFormat, { url: string; file: string; size: number }>;
}

const base = import.meta.env.BASE_URL;
const entry = (dir: string, file: string, size: number) => ({ url: `${base}${dir}/${encodeURIComponent(file)}`, file, size });

// name, then byte sizes of the VGZ and the MML
const SONGS: [name: string, vgz: number, mml: number][] = [
  ["01 Decadence", 1893, 4326],
  ["02 Everyday Shelter", 3320, 19530],
  ["03 Virtual 3D", 3309, 16865],
  ["04 Battle Heavy Metal", 5032, 26925],
  ["05 Level Up", 1542, 5000],
  ["06 Mid Boss Battle", 3657, 23105],
  ["07 Oops!", 5141, 58830],
  ["08 Boss Battle", 5894, 50781],
  ["09 Misty", 3190, 15698],
  ["10 Little Bossa Nova", 5299, 35820],
  ["11 Dark Road", 2014, 5367],
  ["12 Long Time Way", 1797, 9706],
  ["13 Challenge", 3862, 15134],
  ["14 I Go The Broken City", 2313, 8506],
  ["15 Jakyou", 2781, 9841],
  ["16 Sticky Grease", 2431, 15106],
  ["17 Dark Side", 1594, 3183],
  ["18 Resistance", 4069, 24146],
  ["19 Millennium After The Fall", 3177, 18475],
  ["20 Cyberpunk", 4436, 21064],
  ["21 Magic Box, Fountain, Vision of Yuuka", 863, 1101],
  ["22 Tin Pan", 3919, 26168],
  ["23 Bael Castle Top Floor", 1260, 2355],
  ["24 Servant of The Ishtar", 2228, 7771],
];

export const songs: SongFiles[] = SONGS.map(([name, vgz, mml]) => ({
  name,
  files: {
    vgz: entry('music', `${name}.vgz`, vgz),
    mml: entry('mml', `${name}.mml`, mml),
  },
}));

export const tracks: Track[] = songs.map(({ name, files }) => ({ name, url: files.vgz.url }));
