/**
 * The Reality Check cards. Edit here, not in components.
 *
 * Two tiers: the ones every business needs, then the ones that depend on
 * what the business does. Ten cards in a flat list is a wall; this isn't.
 */

export type Tier = "essential" | "depends";

export interface RealityCheckCard {
  id: string;
  tier: Tier;
  title: string;
  /** Two or three plain sentences on why it matters. */
  why: string;
  /** Questions to ask a developer. Two to four. */
  questions: string[];
}

export const TIERS: Record<Tier, { title: string; intro: string }> = {
  essential: {
    title: "For every business",
    intro: "If a quote doesn't cover these three, it isn't a website. It's this ZIP file with a markup.",
  },
  depends: {
    title: "Depends on what you do",
    intro: "Not every business needs all of these. A good developer tells you which ones you don't.",
  },
};

export const REALITY_CHECK: readonly RealityCheckCard[] = [
  {
    id: "messaging",
    tier: "essential",
    title: "Messaging and content",
    why:
      "Your text went in exactly as you typed it, or as the placeholder had it. Nobody asked who the site is for, what they're looking for, or what you want them to do. That's the work, and it's the part a template can't do.",
    questions: [
      "Who is this site for, and what should it get them to do?",
      "Will you write or edit the copy, or is that on me?",
      "What happens on the home page in the first five seconds?",
    ],
  },
  {
    id: "contact",
    tier: "essential",
    title: "A contact form that actually works",
    why:
      "The form on your contact page doesn't send anything. Making it work means a service behind it, spam filtering, and someone deciding where messages go and how fast you reply.",
    questions: [
      "Where do form submissions go, and what stops spam?",
      "Will I get a notification, and how quickly?",
      "What does it cost per month to keep the form working?",
    ],
  },
  {
    id: "ownership",
    tier: "essential",
    title: "Ownership and handoff",
    why:
      "The domain, the hosting account, and the code should be yours. Plenty of small businesses find out they don't own their own website when they try to leave a developer.",
    questions: [
      "Will the domain be registered in my name, in my account?",
      "If we part ways, what do I walk away with, and in what form?",
      "Do I get the source files, and can another developer pick them up?",
    ],
  },
  {
    id: "seo",
    tier: "depends",
    title: "Search visibility",
    why:
      "Your site has page titles and one description. That's it. Showing up when someone searches for what you do is a separate job: local search, a Google Business Profile, and knowing what people actually type.",
    questions: [
      "What will you do so people find me on Google?",
      "Will you set up my Google Business Profile and Search Console?",
      "How will I know if it's working?",
    ],
  },
  {
    id: "speed",
    tier: "depends",
    title: "Speed and image optimisation",
    why:
      "Your uploads went into the site exactly as they were. A phone photo can be five megabytes. Real sites resize and compress every image, and it's the difference between a page that loads in one second and one that loads in ten.",
    questions: [
      "Will you optimise my images, and what happens when I add new ones?",
      "What's the page load time on a phone?",
    ],
  },
  {
    id: "accessibility",
    tier: "depends",
    title: "Accessibility",
    why:
      "Can someone using a screen reader or only a keyboard use your site? This site has the basics that come free with plain HTML, and nothing more. In some places it's a legal requirement.",
    questions: [
      "What accessibility standard do you build to?",
      "Have you tested with a screen reader?",
    ],
  },
  {
    id: "functionality",
    tier: "depends",
    title: "Real functionality",
    why:
      "Booking, online payments, a menu that updates, inventory, memberships, a newsletter. Anything specific to how your business works. A template can't have it because a template doesn't know what you do.",
    questions: [
      "What does my business do that the site should do too?",
      "Which of those are built, and which are third-party services with their own fees?",
      "Who maintains them when they change?",
    ],
  },
  {
    id: "hosting",
    tier: "depends",
    title: "Hosting, security and backups",
    why:
      "A site like this one can be hosted for free and has almost nothing to hack. A site with a login, a database or a form service has something to protect and someone has to do it.",
    questions: [
      "Who hosts it, and what does that cost per month?",
      "Who updates it when there's a security patch?",
      "What happens when it goes down at 9pm on a Friday?",
    ],
  },
  {
    id: "analytics",
    tier: "depends",
    title: "Analytics and measurement",
    why:
      "Right now you'd have no idea whether anyone visits. Knowing how people find you and what they do tells you whether the site is worth what you paid.",
    questions: [
      "What will I be able to see about my visitors?",
      "Will you walk me through it once a quarter?",
    ],
  },
  {
    id: "support",
    tier: "depends",
    title: "Ongoing support",
    why:
      "Next month you'll want to change the hours, add a photo, or fix a typo. Who does that, how fast, and what it costs is the part of the quote most people forget to read.",
    questions: [
      "Who makes small changes, and what does a change cost?",
      "Can I make simple edits myself?",
      "Is there a monthly fee, and what does it cover?",
    ],
  },
];

export const CLOSING_LINE =
  "If a proposal doesn't clearly cover more than the left column, you're paying for something you can make here in five minutes.";
