/**
 * Choosing an opponent, in two beats: who, then how hard.
 *
 * Splitting it this way is what lets a 900-rated player face Kaiba and still
 * get a real game. The roster sells the character; the tier screen sets the
 * strength, with the character's canon rating marked so the "correct" answer
 * is still visible for anyone who wants it.
 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../../anim/gsapSetup';
import {
  CHARACTERS,
  portraitAsset,
  ratingBand,
  type Character,
} from '../characters';

type RosterProps = {
  onPick: (id: string) => void;
  onBack: () => void;
};

export function OpponentSelect({ onPick, onBack }: RosterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.roster-card', {
        opacity: 0,
        y: 26,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
      });
      gsap.from('.roster-heading', { opacity: 0, y: -10, duration: 0.5, ease: 'power2.out' });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div className="roster" ref={ref}>
      <div className="roster-heading">
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h1>Choose your opponent</h1>
        <p>Every duelist plays at any strength. Pick a face — you set the difficulty next.</p>
      </div>

      <div className="roster-grid">
        {CHARACTERS.map((c) => (
          <RosterCard key={c.id} character={c} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

function RosterCard({
  character,
  onPick,
}: {
  character: Character;
  onPick: (id: string) => void;
}) {
  const lo = character.tiers[0].rating;
  const hi = character.tiers[character.tiers.length - 1].rating;
  return (
    <button
      className="roster-card"
      style={{ ['--accent' as string]: character.accent }}
      onClick={() => onPick(character.id)}
    >
      <div className="roster-portrait">
        <img
          src={portraitAsset(character.portrait, 'body.png')}
          alt=""
          aria-hidden
          draggable={false}
        />
      </div>
      <div className="roster-body">
        <div className="roster-name">{character.name}</div>
        <div className="roster-epithet">{character.epithet}</div>
        <div className="roster-rating">
          <span className="roster-elo">
            {lo}–{hi}
          </span>
          <span className="roster-band">{character.tiers.length} levels</span>
        </div>
        <p className="roster-blurb">{character.blurb}</p>
      </div>
    </button>
  );
}

type TierProps = {
  character: Character;
  onStart: (tier: number) => void;
  onBack: () => void;
};

export function TierSelect({ character, onStart, onBack }: TierProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.tier-row', {
        opacity: 0,
        x: -18,
        duration: 0.42,
        stagger: 0.06,
        ease: 'power2.out',
      });
      gsap.from('.tier-portrait', { opacity: 0, scale: 0.94, duration: 0.5, ease: 'power2.out' });
    },
    { scope: ref, dependencies: [character.id] }
  );

  return (
    <div className="tier-screen" ref={ref} style={{ ['--accent' as string]: character.accent }}>
      <div className="roster-heading">
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h1>How hard should {character.name.split(' ')[0]} play?</h1>
        <p>{character.blurb}</p>
      </div>

      <div className="tier-layout">
        <div className="tier-portrait">
          <img
            src={portraitAsset(character.portrait, 'body.png')}
            alt=""
            aria-hidden
            draggable={false}
          />
          <div className="tier-portrait-name">{character.name}</div>
        </div>

        <div className="tier-list">
          {character.tiers.map((t, i) => (
            <button key={t.label} className="tier-row" onClick={() => onStart(i)}>
              <span className="tier-step" aria-hidden>
                {'▮'.repeat(i + 1)}
                <span className="tier-step-dim">{'▯'.repeat(character.tiers.length - i - 1)}</span>
              </span>
              <span className="tier-text">
                <span className="tier-label">{t.label}</span>
                <span className="tier-meta">
                  {t.rating} · {ratingBand(t.rating)}
                </span>
              </span>
              {i === character.signature && <span className="tier-canon">their true strength</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
