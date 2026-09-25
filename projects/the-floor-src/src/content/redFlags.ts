/**
 * The "Red flags when hiring a developer" page. Edit here.
 */

export interface RedFlag {
  title: string;
  text: string;
}

export const RED_FLAGS: readonly RedFlag[] = [
  {
    title: "Their portfolio looks like this tool's output",
    text: "Go through their recent sites. If every one is a centred hero, three columns and a contact form, they're selling templates. That's fine, but it should cost what a template costs.",
  },
  {
    title: "They won't say who owns the domain",
    text: "Ask directly: will the domain be registered to me, in my account? A pause, a 'we handle that for you', or a monthly fee that includes the domain are all the same answer.",
  },
  {
    title: "Vague maintenance terms",
    text: "'Ongoing support included' means nothing. What's included, how many changes, how fast, and what happens after the first year should be written down.",
  },
  {
    title: "No questions about your business",
    text: "A quote that arrives before they've asked who your customers are, what you want the site to do, or what's not working now is a quote for a template.",
  },
  {
    title: "The price is a round number with no breakdown",
    text: "Two thousand dollars for 'a website' tells you nothing. Ask what the hours go to. Design, copy, build, setup and testing should each be a line.",
  },
  {
    title: "Everything is a monthly fee",
    text: "Some things cost monthly for real reasons: hosting, a form service, a booking tool. A monthly fee for 'the website' with no breakdown is rent on something you should own.",
  },
  {
    title: "You can't get the files",
    text: "Ask what you'd receive if you left tomorrow. If the answer isn't 'everything, in a form another developer can use', you're being locked in.",
  },
  {
    title: "They promise page one on Google",
    text: "Nobody can promise that. Anyone who does is either guessing or planning to buy ads with your money.",
  },
  {
    title: "No accessibility answer",
    text: "Ask what standard they build to. 'It works on mobile' isn't an answer. If they've never heard the question, they haven't thought about it.",
  },
  {
    title: "They talk about the tools more than your customers",
    text: "The framework, the platform, the builder. None of that is your problem. What your visitors do when they land is.",
  },
];
