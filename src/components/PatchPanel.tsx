import { useRef, useState, type DragEvent } from 'react';
import { patchDisk, type PatchManifest, type PatchResult } from './patcher';

const VERSION = '2026.11.03';
type Lang = 'en' | 'es';
const LANGS: { id: Lang; label: string; intro: string }[] = [
  { id: 'en', label: 'English', intro: 'Play Giten Megami Tensei in English.' },
  { id: 'es', label: 'Español', intro: 'Juega a Giten Megami Tensei en español.' },
];
/** Picture labels shortened to fit the status / battle panels (kanji → abbreviation): shown under the patch for the chosen language. */
const ABBR: Record<Lang, { title: string; rows: [string, string, string][] }> = {
  en: {
    title: 'Status abbreviations',
    rows: [
      ['直', 'ITN', 'Intuition'], ['魔', 'MAG', 'Magic'], ['体', 'VIT', 'Vitality'], ['器', 'DEX', 'Dexterity'], ['命', 'LUK', 'Luck'],
      ['精', 'WIL', 'Willpower'], ['知', 'INT', 'Intelligence'], ['敏', 'AGI', 'Agility'], ['魅', 'CHA', 'Charm'],
      ['攻撃', 'Atk', 'Attack'], ['命中', 'Hit', 'Accuracy'], ['防御', 'Def', 'Defense'], ['回避', 'Eva', 'Evasion'],
    ],
  },
  es: {
    title: 'Abreviaturas de estado',
    rows: [
      ['直', 'INT', 'Intuición'], ['魔', 'MAG', 'Magia'], ['体', 'VIT', 'Vitalidad'], ['器', 'DES', 'Destreza'], ['命', 'SUE', 'Suerte'],
      ['精', 'ESP', 'Espíritu'], ['知', 'SAB', 'Sabiduría'], ['敏', 'AGI', 'Agilidad'], ['魅', 'CAR', 'Carisma'],
      ['攻撃', 'Atq', 'Ataque'], ['命中', 'Pre', 'Precisión'], ['防御', 'Def', 'Defensa'], ['回避', 'Eva', 'Evasión'],
    ],
  },
};
const baseOf = (lang: Lang) => `${import.meta.env.BASE_URL}patch/${lang}/`;
const IMAGE = /\.(hdi|nhd|hdm|xdf)$/i;

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; name: string }
  | { kind: 'done'; name: string; results: PatchResult[] }
  | { kind: 'already'; results: PatchResult[] }
  | { kind: 'failed'; message: string; results: PatchResult[] };

async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cannot load ${url}`);
  return new Uint8Array(await res.arrayBuffer());
}

function save(data: Uint8Array, name: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data as BlobPart]));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}

async function run(file: File, lang: Lang): Promise<Status> {
  const base = baseOf(lang);
  const manifest = (await (await fetch(`${base}manifest.json`)).json()) as PatchManifest;
  const entries = await Promise.all(
    manifest.files.map(async (f) => [f.patch, await fetchBytes(`${base}${f.patch}`)] as const),
  );
  const { disk, results } = patchDisk(manifest, new Uint8Array(await file.arrayBuffer()), new Map(entries));
  if (!disk) return { kind: 'failed', message: 'Nothing was written: this is not the original disk (an image already patched to the other language does not work: start from the original).', results };
  if (results.every((r) => r.status === 'already')) return { kind: 'already', results };
  const name = file.name.replace(/(\.[^.]+)$/, `-${manifest.lang}$1`);
  save(disk, name);
  return { kind: 'done', name, results };
}

function ResultList({ results }: { results: PatchResult[] }) {
  return (
    <ul className="patch-results">
      {results.map(({ path, status, error }) => (
        <li key={path} className={status}>
          {path.split('/').pop()}
          <span>{status === 'error' ? error : status === 'already' ? 'already patched' : 'patched'}</span>
        </li>
      ))}
    </ul>
  );
}

/** The translation patch (English or Spanish): one tab of the right panel. */
export function PatchBody() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('es') ? 'es' : 'en'));
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const patch = async (file: File | undefined) => {
    if (!file) return;
    if (!IMAGE.test(file.name)) {
      setStatus({ kind: 'failed', message: `${file.name} is not a .hdi, .nhd or .hdm disk image.`, results: [] });
      return;
    }
    setStatus({ kind: 'working', name: file.name });
    await new Promise((resolve) => setTimeout(resolve, 20)); // let "Patching…" paint
    try {
      setStatus(await run(file, lang));
    } catch (e) {
      setStatus({ kind: 'failed', message: (e as Error).message, results: [] });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void patch(e.dataTransfer.files[0]);
  };

  const working = status.kind === 'working';
  return (
    <div className="patch-body">
      <div className="patch-langs" role="radiogroup" aria-label="Language">
        {LANGS.map((l) => (
          <button
            key={l.id}
            role="radio"
            aria-checked={lang === l.id}
            disabled={working}
            onClick={() => {
              setLang(l.id);
              setStatus({ kind: 'idle' });
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <p>{LANGS.find((l) => l.id === lang)!.intro} You need your own copy of the game, installed on a hard disk.</p>
      <dl className="patch-applies">
        <dt>Patch</dt>
        <dd>Version {VERSION}</dd>
        <dt>Applies to</dt>
        <dd>
          Giten Megami Tensei: Tokyo Mokushiroku
          <br />
          ASCII / Atlus, April 1997, PC-98 retail release
        </dd>
        <dt>Needs</dt>
        <dd>
          Unmodified install in a DDS98 folder
          <br />
          DDS98.EXE: 480,710 bytes, CRC32 2E4FA3C2
        </dd>
        <dt>Tested</dt>
        <dd>On emulator only</dd>
      </dl>
      <button
        className={over ? 'patch-drop over' : 'patch-drop'}
        disabled={working}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        {working ? `Patching ${status.name}…` : 'Drop disk image here'}
        <small>{working ? 'Please wait' : '.hdi / .nhd / .hdm, or click to choose'}</small>
      </button>
      <input
        ref={input}
        type="file"
        accept=".hdi,.nhd,.hdm,.xdf"
        hidden
        onChange={(e) => {
          void patch(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <p className="patch-note">Stays on your computer: nothing is uploaded. Your original image is not changed.</p>

      {status.kind === 'done' && (
        <div className="patch-status done" role="status">
          <b>Patched</b> {status.name} saved to your downloads.
          <ResultList results={status.results} />
        </div>
      )}
      {status.kind === 'already' && (
        <div className="patch-status" role="status">
          <b>Already patched</b> Mount this image as it is.
          <ResultList results={status.results} />
        </div>
      )}
      {status.kind === 'failed' && (
        <div className="patch-status failed" role="alert">
          {status.message}
          <ResultList results={status.results} />
        </div>
      )}

      <h3>{ABBR[lang].title}</h3>
      <table className="patch-abbr">
        <tbody>
          {ABBR[lang].rows.map(([ja, ab, full]) => (
            <tr key={ja}>
              <td lang="ja">{ja}</td>
              <td><b>{ab}</b></td>
              <td>{full}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Then mount it</h3>
      <ul>
        <li><b>np21w:</b> HardDisk → IDE #0 → Open…, then Emulate → Reset</li>
        <li><b>T98-Next:</b> mount as first hard disk (.nhd), then reset</li>
      </ul>

      <p className="patch-note">
        Too fast? Map and battle speed follow the CPU clock: limit it to about 50 MHz. Start a new
        game. The title logo stays in Japanese.
      </p>

      <a className="patch-kofi" href="https://ko-fi.com/alammo" target="_blank" rel="noreferrer">
        ♥ Support on Ko-fi
      </a>
    </div>
  );
}
