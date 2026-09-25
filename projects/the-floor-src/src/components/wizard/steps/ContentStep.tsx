import {
  enabledPages,
  MAX_GALLERY_IMAGES,
  MAX_SERVICES,
  MAX_TEAM,
  getBusinessType,
  type AboutContent,
  type ContactContent,
  type HomeContent,
  type ServicesContent,
} from "../../../lib/generator";
import { Explainer } from "../Explainer";
import { ImageUpload, MultiImageUpload } from "../ImageUpload";
import type { StepProps } from "../types";

export function ContentStep({ answers, setAnswers }: StepProps) {
  const pages = enabledPages(answers);
  const has = (id: string) => pages.some((p) => p.id === id);

  const setHome = (patch: Partial<HomeContent>) => setAnswers((a) => ({ ...a, home: { ...a.home, ...patch } }));
  const setAbout = (patch: Partial<AboutContent>) => setAnswers((a) => ({ ...a, about: { ...a.about, ...patch } }));
  const setServices = (patch: Partial<ServicesContent>) => setAnswers((a) => ({ ...a, services: { ...a.services, ...patch } }));
  const setContact = (patch: Partial<ContactContent>) => setAnswers((a) => ({ ...a, contact: { ...a.contact, ...patch } }));

  const typeName = getBusinessType(answers.businessType).name.toLowerCase();

  return (
    <>
      <h1>Your words</h1>
      <p className="lede">
        Every box is already filled with placeholder text for a {typeName}. Change what you like, or change nothing. The text goes in exactly as
        you type it. Nobody edits it. That's one of the things you'd pay for.
      </p>

      {/* ---------- Home ---------- */}
      <section className="content-page" aria-labelledby="content-home">
        <h2 id="content-home">Home page</h2>
        <ImageUpload
          id="hero-upload"
          label={
            <>
              Hero image <Explainer term="hero-image" />
            </>
          }
          hint="Optional. Wide and landscape, at least 1920 pixels across. If you skip it, the top of the page is a flat block of your main colour."
          value={answers.home.heroImage}
          onChange={(heroImage) => setHome({ heroImage })}
        />
        <div className="field">
          <div className="field-label">
            <label htmlFor="headline">Headline</label>
          </div>
          <input id="headline" className="input" type="text" value={answers.home.headline} onChange={(e) => setHome({ headline: e.target.value })} />
        </div>
        <div className="field">
          <div className="field-label">
            <label htmlFor="subtext">Text under the headline</label>
          </div>
          <textarea id="subtext" className="textarea" value={answers.home.subtext} onChange={(e) => setHome({ subtext: e.target.value })} />
        </div>
        <div className="field">
          <div className="field-label">
            <label htmlFor="cta-text">Button text</label>
            <Explainer term="call-to-action" />
          </div>
          <input id="cta-text" className="input" type="text" value={answers.home.ctaText} onChange={(e) => setHome({ ctaText: e.target.value })} />
          <span className="field-hint">
            The button goes to your Contact page if you have one, otherwise it opens an email to you.
          </span>
        </div>
        <div className="field">
          <div className="field-label">Three reasons to choose you</div>
          {answers.home.features.map((f, i) => (
            <div key={i} className="repeat-item">
              <div className="field">
                <div className="field-label">
                  <label htmlFor={`feature-title-${i}`}>Title {i + 1}</label>
                </div>
                <input
                  id={`feature-title-${i}`}
                  className="input"
                  type="text"
                  value={f.title}
                  onChange={(e) =>
                    setHome({ features: answers.home.features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })
                  }
                />
              </div>
              <div className="field">
                <div className="field-label">
                  <label htmlFor={`feature-text-${i}`}>One or two sentences</label>
                </div>
                <textarea
                  id={`feature-text-${i}`}
                  className="textarea"
                  style={{ minHeight: "4.5rem" }}
                  value={f.text}
                  onChange={(e) => setHome({ features: answers.home.features.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- About ---------- */}
      {has("about") && (
        <section className="content-page" aria-labelledby="content-about">
          <h2 id="content-about">About page</h2>
          <div className="field">
            <div className="field-label">
              <label htmlFor="story">Your story</label>
            </div>
            <textarea
              id="story"
              className="textarea"
              style={{ minHeight: "10rem" }}
              value={answers.about.story}
              onChange={(e) => setAbout({ story: e.target.value })}
            />
            <span className="field-hint">Leave a blank line between paragraphs.</span>
          </div>
          <div className="field">
            <div className="field-label">
              Team members <span className="muted small">optional, up to {MAX_TEAM}</span>
            </div>
            {answers.about.team.map((t, i) => (
              <div key={i} className="repeat-item">
                <button
                  type="button"
                  className="btn btn--quiet btn--danger repeat-remove"
                  onClick={() => setAbout({ team: answers.about.team.filter((_, j) => j !== i) })}
                >
                  Remove
                </button>
                <div className="field-row">
                  <div className="field">
                    <div className="field-label">
                      <label htmlFor={`team-name-${i}`}>Name</label>
                    </div>
                    <input
                      id={`team-name-${i}`}
                      className="input"
                      type="text"
                      value={t.name}
                      onChange={(e) => setAbout({ team: answers.about.team.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })}
                    />
                  </div>
                  <div className="field">
                    <div className="field-label">
                      <label htmlFor={`team-role-${i}`}>Role</label>
                    </div>
                    <input
                      id={`team-role-${i}`}
                      className="input"
                      type="text"
                      value={t.role}
                      onChange={(e) => setAbout({ team: answers.about.team.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)) })}
                    />
                  </div>
                </div>
              </div>
            ))}
            {answers.about.team.length < MAX_TEAM && (
              <button type="button" className="btn btn--ghost" onClick={() => setAbout({ team: [...answers.about.team, { name: "", role: "" }] })}>
                Add a team member
              </button>
            )}
          </div>
        </section>
      )}

      {/* ---------- Services ---------- */}
      {has("services") && (
        <section className="content-page" aria-labelledby="content-services">
          <h2 id="content-services">Services page</h2>
          <p className="muted">Up to {MAX_SERVICES}. Price is free text, so "From $40" and "Call for quote" both work. Leave it blank to hide it.</p>
          {answers.services.items.map((s, i) => (
            <div key={i} className="repeat-item">
              <button
                type="button"
                className="btn btn--quiet btn--danger repeat-remove"
                onClick={() => setServices({ items: answers.services.items.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
              <div className="field">
                <div className="field-label">
                  <label htmlFor={`service-name-${i}`}>Service {i + 1}</label>
                </div>
                <input
                  id={`service-name-${i}`}
                  className="input"
                  type="text"
                  value={s.name}
                  onChange={(e) => setServices({ items: answers.services.items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })}
                />
              </div>
              <div className="field-row field-row--3" style={{ gridTemplateColumns: "3fr 1fr" }}>
                <div className="field">
                  <div className="field-label">
                    <label htmlFor={`service-desc-${i}`}>Short description</label>
                  </div>
                  <input
                    id={`service-desc-${i}`}
                    className="input"
                    type="text"
                    value={s.description}
                    onChange={(e) =>
                      setServices({ items: answers.services.items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })
                    }
                  />
                </div>
                <div className="field">
                  <div className="field-label">
                    <label htmlFor={`service-price-${i}`}>Price</label>
                  </div>
                  <input
                    id={`service-price-${i}`}
                    className="input"
                    type="text"
                    value={s.price}
                    onChange={(e) => setServices({ items: answers.services.items.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)) })}
                  />
                </div>
              </div>
            </div>
          ))}
          {answers.services.items.length < MAX_SERVICES && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setServices({ items: [...answers.services.items, { name: "", description: "", price: "" }] })}
            >
              Add a service
            </button>
          )}
        </section>
      )}

      {/* ---------- Gallery ---------- */}
      {has("gallery") && (
        <section className="content-page" aria-labelledby="content-gallery">
          <h2 id="content-gallery">Gallery page</h2>
          <MultiImageUpload
            id="gallery-upload"
            label="Photos"
            hint="They go into the site exactly as uploaded, not resized or compressed. A phone photo can be five megabytes. That's what a template does, and it's on the Reality Check."
            images={answers.gallery.images}
            max={MAX_GALLERY_IMAGES}
            onChange={(images) => setAnswers((a) => ({ ...a, gallery: { images } }))}
          />
        </section>
      )}

      {/* ---------- Contact ---------- */}
      {has("contact") && (
        <section className="content-page" aria-labelledby="content-contact">
          <h2 id="content-contact">Contact page</h2>
          <p className="muted">
            The contact page also has a form. It doesn't send anything. <Explainer term="contact-form" />
          </p>
          <div className="field-row">
            <div className="field">
              <div className="field-label">
                <label htmlFor="address">Address</label>
              </div>
              <textarea id="address" className="textarea" style={{ minHeight: "5rem" }} value={answers.contact.address} onChange={(e) => setContact({ address: e.target.value })} />
            </div>
            <div className="field">
              <div className="field-label">
                <label htmlFor="hours">Hours</label>
              </div>
              <textarea id="hours" className="textarea" style={{ minHeight: "5rem" }} value={answers.contact.hours} onChange={(e) => setContact({ hours: e.target.value })} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <div className="field-label">
                <label htmlFor="phone">Phone</label>
              </div>
              <input id="phone" className="input" type="tel" autoComplete="tel" value={answers.contact.phone} onChange={(e) => setContact({ phone: e.target.value })} />
            </div>
            <div className="field">
              <div className="field-label">
                <label htmlFor="email">Email</label>
              </div>
              <input id="email" className="input" type="email" autoComplete="email" value={answers.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
