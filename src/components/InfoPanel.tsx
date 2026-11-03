import { useState } from 'react';
import { PatchBody } from './PatchPanel';

/** Right panel, two tabs: translation patch (English / Spanish), about the game (from the box); starts collapsed where it would cover the box. */
export function InfoPanel() {
  const [open, setOpen] = useState(() => !matchMedia('(max-width: 1100px)').matches);
  const [tab, setTab] = useState<'patch' | 'info'>('patch');

  if (!open) {
    return (
      <button className="side-open right" onClick={() => setOpen(true)}>
        EN / ES Patch · Info
      </button>
    );
  }

  return (
    <aside className="side-panel right" aria-label="About the game">
      <header className="side-header">
        <div>
          <h2>偽典・女神転生</h2>
          <p>東京黙示録 · Tokyo Mokushiroku</p>
        </div>
        <button aria-label="Close info panel" title="Close" onClick={() => setOpen(false)}>
          ×
        </button>
      </header>
      <div className="panel-tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'patch'} onClick={() => setTab('patch')}>
          Patch EN / ES
        </button>
        <button role="tab" aria-selected={tab === 'info'} onClick={() => setTab('info')}>
          Info
        </button>
      </div>
      {tab === 'patch' ? <PatchBody /> : <div className="patch-body">
        <p>
          Tokyo after the great destruction, a city overflowing with demons. Atlus's Megami Tensei comes to the PC-98 with a
          new battle system.
        </p>
        <dl className="patch-applies">
          <dt>Publisher</dt>
          <dd>ASCII, April 1997</dd>
          <dt>Developer</dt>
          <dd>Atlus</dd>
          <dt>Composer</dt>
          <dd>Tsukasa Masuko</dd>
          <dt>Platform</dt>
          <dd>NEC PC-9801 / PC-9821</dd>
          <dt>Sound</dt>
          <dd>
            PC-9801-26 / -86, GS MIDI
            <br />
            These rips: YM2203
          </dd>
        </dl>
        <a className="patch-kofi" href="https://ko-fi.com/alammo" target="_blank" rel="noreferrer">
          ♥ Support on Ko-fi
        </a>
      </div>}
      <div className="panel-video">
        <iframe
          src="https://www.youtube-nocookie.com/embed/lPHxhj4hH3I"
          title="Giten Megami Tensei: Tokyo Mokushiroku — video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </aside>
  );
}
