# Giten Megami Tensei: Tokyo Mokushiroku — English & Spanish translation

偽典・女神転生 東京黙示録 (ASCII / Atlus, PC-98, April 1997)

**▶ Open the page: https://delacannon.github.io/giten-megami-tensei-tokyo-mokushiroku-i18n/**

The page shows the game's box in 3D. It has a soundtrack player, and it patches your own copy of the game to **English** or
**Spanish** in the browser.

> The box art shows nudity: the page asks you to confirm you are 18 or older.

## What is here

- **3D box viewer**: front, back and side of the retail box (three.js / react-three-fiber).
- **Soundtrack**: 24 tracks rendered from the game's FM music (YM2203). Each one can be downloaded as VGZ or MML, or opened
  in OPNAvoid.
- **Translation patch (EN / ES)**: choose English or Español, then drop your hard-disk image (.hdi / .nhd / .hdm). The page
  writes a patched copy.
  - Everything runs on your computer: nothing is uploaded, and your original image is not changed.
  - Every file is checked (size + CRC32) before anything is written, so a disk is never half patched.
  - The patch holds no game data, only BPS differences against the original files.

## The translation

| | English | Español |
|---|---|---|
| Script, menus, items, demons, names | ✓ | ✓ (45,475 lines) |
| Accented letters á é í ó ú ü ñ ¿ ¡ | — | ✓ drawn into the game's own font |
| Status / battle panel pictures | ✓ | ✓ |
| Title menu | NEW GAME / CONTINUE (original) | NUEVA PARTIDA / CONTINUAR |

The status and battle panels had room for only a few letters, so their labels are abbreviated:

| Kanji | English | Español |
|---|---|---|
| 直 | ITN Intuition | INT Intuición |
| 魔 | MAG Magic | MAG Magia |
| 体 | VIT Vitality | VIT Vitalidad |
| 器 | DEX Dexterity | DES Destreza |
| 命 | LUK Luck | SUE Suerte |
| 精 | WIL Willpower | ESP Espíritu |
| 知 | INT Intelligence | SAB Sabiduría |
| 敏 | AGI Agility | AGI Agilidad |
| 魅 | CHA Charm | CAR Carisma |
| 攻撃 / 命中 / 防御 / 回避 | Atk / Hit / Def / Eva | Atq / Pre / Def / Eva |

### What you need

- Your own copy of *Giten Megami Tensei: Tokyo Mokushiroku* (ASCII / Atlus, April 1997, PC-98 retail release), installed on a
  hard-disk image in a `DDS98` folder.
- The installed files must be unmodified: `DDS98.EXE` is 480,710 bytes, CRC32 `2E4FA3C2`.
- To go from one language to the other, patch the original image again: an image already patched to English cannot take the
  Spanish patch, and the other way round.

### Play

1. **Neko Project 21/W (np21w)**: HardDisk → IDE #0 → Open… → choose the patched image, then Emulate → Reset.
2. **T98-Next** (.nhd images): mount the patched image as the first hard disk, then reset.
3. **Start a new game**: saves from the Japanese version can resume at the wrong line.
4. **Too fast?** Map and battle speed follow the CPU clock: limit the emulated CPU to about 50 MHz.

The title logo stays in Japanese. Tested on emulators only.

### Offline patch

The [Releases](https://github.com/delacannon/giten-megami-tensei-tokyo-mokushiroku-i18n/releases) page has a zip for
each language. Each zip holds the same patch as the page, plus three other ways to apply it:

- `patch.html`: the same patcher, works offline.
- `apply.mjs`: patch from the command line (Node.js).
- The `.bps` files, for any BPS patcher.

## Develop

```sh
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # dist/, deployed to GitHub Pages by .github/workflows/pages.yml
```

`public/patch/en` and `public/patch/es` hold the BPS patches and `manifest.json` (file paths, sizes, CRC32) for each
language. `src/components/patcher.ts` applies them to the disk image's FAT partition in the browser.

## Credits

- Original game © 1997 Atlus / ASCII / Fumito Nishitani / SHIPS. Music by Tsukasa Masuko.
- Translation made with Kizuato Studio.
- Music playback: VGMPlay through Jürgen Wothke's WebAudio player.

This is an unofficial fan translation, not affiliated with Atlus or ASCII. It contains no game files.

♥ [Support on Ko-fi](https://ko-fi.com/alammo)
