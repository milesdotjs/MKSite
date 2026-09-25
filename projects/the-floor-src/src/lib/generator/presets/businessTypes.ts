/**
 * Placeholder copy per business type. This is what fills every field when the
 * user skips it, so skipping everything still produces a complete, plausible
 * site with nothing but their name in it. That is the honest demo.
 *
 * The copy is meant to be generic. Fine at a glance, forgettable immediately.
 */

import type { BusinessType, Feature, Service } from "../types";

export interface BusinessTypePreset {
  id: BusinessType;
  name: string;
  /** Default tagline. */
  tagline: string;
  headline: string;
  subtext: string;
  ctaText: string;
  features: Feature[];
  story: string;
  /** Roles only. Names are drawn from the world chess champion list at placeholder time. */
  teamRoles: string[];
  services: Service[];
  hours: string;
  /** Shown in the gallery placeholder tiles when nothing is uploaded. */
  galleryHint: string;
}

export const BUSINESS_TYPES: readonly BusinessTypePreset[] = [
  {
    id: "restaurant",
    name: "Restaurant or café",
    tagline: "Good food, made fresh daily",
    headline: "Fresh, local, made from scratch",
    subtext:
      "We serve honest food in a warm, welcoming space. Whether you're stopping in for a quick lunch or settling in for dinner, there's always a seat for you.",
    ctaText: "View our menu",
    features: [
      { icon: "utensils", title: "Seasonal menu", text: "Our dishes change with the seasons, using ingredients from local farms and suppliers." },
      { icon: "clock", title: "Open seven days", text: "Breakfast, lunch and dinner, every day of the week. No reservation needed." },
      { icon: "heart", title: "Family owned", text: "Run by the same family for years, and we still greet regulars by name." },
    ],
    story:
      "We opened our doors with a simple idea: serve the kind of food we'd want to eat ourselves. That means real ingredients, recipes we're proud of, and a room where people feel at home.\n\nToday we're still cooking the same way. Our team arrives early to prep everything by hand, and we work with local growers and producers wherever we can. Thank you for being part of it.",
    teamRoles: ["Owner and head chef", "Front of house manager"],
    services: [
      { name: "Dine in", description: "Full table service for breakfast, lunch and dinner.", price: "" },
      { name: "Takeaway", description: "Order at the counter or by phone and collect when it suits you.", price: "" },
      { name: "Catering", description: "Platters and set menus for events, meetings and parties.", price: "From $15 per head" },
      { name: "Private hire", description: "Book the whole room for a celebration or a work function.", price: "Contact us" },
    ],
    hours: "Mon to Fri: 7am to 9pm\nSat and Sun: 8am to 10pm",
    galleryHint: "Photos of your dishes and dining room",
  },
  {
    id: "salon",
    name: "Salon, barber or beauty",
    tagline: "Look good, feel great",
    headline: "Your look, in expert hands",
    subtext:
      "From a quick trim to a full colour transformation, our stylists take the time to understand what you want and make it happen.",
    ctaText: "Book an appointment",
    features: [
      { icon: "scissors", title: "Skilled stylists", text: "Our team trains constantly to keep up with the latest cuts, colours and techniques." },
      { icon: "sparkle", title: "Quality products", text: "We use professional products that care for your hair and skin, and stock them for you to take home." },
      { icon: "calendar", title: "Easy booking", text: "Walk in or call ahead. Evening and weekend appointments available." },
    ],
    story:
      "We started with one chair and a belief that everyone deserves to leave feeling like the best version of themselves. That belief hasn't changed, even as the team has grown.\n\nEvery appointment starts with a conversation. We listen, we advise, and we never rush. Come in and see the difference.",
    teamRoles: ["Owner and senior stylist", "Colour specialist"],
    services: [
      { name: "Cut and style", description: "A consultation, wash, precision cut and blow dry.", price: "From $45" },
      { name: "Colour", description: "Full colour, highlights, balayage and toning.", price: "From $90" },
      { name: "Beard trim", description: "Shape, trim and hot towel finish.", price: "$25" },
      { name: "Treatments", description: "Deep conditioning and repair treatments for tired hair.", price: "From $35" },
    ],
    hours: "Tue to Fri: 9am to 7pm\nSat: 9am to 5pm\nSun and Mon: Closed",
    galleryHint: "Before-and-after photos and your salon interior",
  },
  {
    id: "trades",
    name: "Trades or contractor",
    tagline: "Reliable work, done right",
    headline: "Quality workmanship you can rely on",
    subtext:
      "Licensed, insured and local. We turn up when we say we will, quote fairly, and leave the site cleaner than we found it.",
    ctaText: "Get a free quote",
    features: [
      { icon: "shield", title: "Licensed and insured", text: "Fully qualified and covered, so you have peace of mind from the first visit to the final inspection." },
      { icon: "clock", title: "On time, every time", text: "We respect your schedule. If we say Tuesday morning, we mean Tuesday morning." },
      { icon: "check", title: "Honest pricing", text: "Clear written quotes with no surprises. The price we agree is the price you pay." },
    ],
    story:
      "We've been serving homes and businesses in the local area for years. What started as one van and a toolbox is now a small, tight-knit team who take pride in every job, big or small.\n\nWe believe good work speaks for itself. Most of our customers come from word of mouth, and we intend to keep it that way.",
    teamRoles: ["Owner and lead tradesperson", "Apprentice"],
    services: [
      { name: "Repairs and maintenance", description: "Fast, tidy fixes for the things that stop working.", price: "Call for quote" },
      { name: "Installations", description: "New fittings and systems, installed to code and tested.", price: "Call for quote" },
      { name: "Renovations", description: "Kitchens, bathrooms and full refits, managed from start to finish.", price: "Free quote" },
      { name: "Emergency call-outs", description: "Same-day response for urgent problems.", price: "From $120" },
    ],
    hours: "Mon to Fri: 7am to 5pm\nSat: 8am to 12pm\nEmergencies: 24 hours",
    galleryHint: "Photos of finished jobs",
  },
  {
    id: "professional",
    name: "Professional services",
    tagline: "Advice you can trust",
    headline: "Clear advice for complicated decisions",
    subtext:
      "We help individuals and businesses navigate the details with confidence. Straightforward guidance, delivered by people who know the field.",
    ctaText: "Book a consultation",
    features: [
      { icon: "briefcase", title: "Experienced team", text: "Years of combined experience across a wide range of clients and situations." },
      { icon: "users", title: "Personal service", text: "You'll work with the same person throughout, someone who knows your situation." },
      { icon: "award", title: "Trusted locally", text: "A reputation built on referrals from clients who keep coming back." },
    ],
    story:
      "We founded the practice on a simple principle: good advice should be clear, practical and delivered by someone who takes the time to understand you.\n\nOver the years we've grown, but the approach hasn't changed. Every client gets a dedicated point of contact, straightforward explanations, and a plan that fits.",
    teamRoles: ["Principal", "Senior associate"],
    services: [
      { name: "Initial consultation", description: "A conversation about your situation and what we can do to help.", price: "Free" },
      { name: "Ongoing advice", description: "Regular support and a direct line to your adviser.", price: "From $150 per month" },
      { name: "Project work", description: "Fixed-scope engagements with a clear brief and a fixed fee.", price: "Quoted" },
      { name: "Reviews and audits", description: "A thorough look at where you are and what could be improved.", price: "From $500" },
    ],
    hours: "Mon to Fri: 9am to 5:30pm\nWeekends: By appointment",
    galleryHint: "Photos of your office and team",
  },
  {
    id: "retail",
    name: "Retail shop",
    tagline: "Something for everyone",
    headline: "Handpicked products, friendly service",
    subtext:
      "Browse a carefully chosen range you won't find in the big chains. Pop in, have a look around, and say hello.",
    ctaText: "See what's new",
    features: [
      { icon: "bag", title: "Curated range", text: "Every product on our shelves is chosen because we'd buy it ourselves." },
      { icon: "star", title: "Local favourites", text: "We stock makers and brands from the area alongside a few finds from further afield." },
      { icon: "heart", title: "Here to help", text: "Not sure what you're after? Ask. We know our products inside out." },
    ],
    story:
      "We opened because we wanted a shop we'd enjoy visiting: somewhere with a considered selection, staff who care, and no pressure to buy.\n\nWe're proud to be part of the neighbourhood. Thank you for shopping small.",
    teamRoles: ["Owner", "Shop manager"],
    services: [
      { name: "In-store shopping", description: "Visit us and browse the full range in person.", price: "" },
      { name: "Gift wrapping", description: "Complimentary wrapping on any purchase.", price: "Free" },
      { name: "Gift vouchers", description: "Available in any amount, in store or by phone.", price: "" },
      { name: "Special orders", description: "Can't find what you need? We can usually order it in.", price: "" },
    ],
    hours: "Mon to Sat: 9:30am to 5:30pm\nSun: 11am to 4pm",
    galleryHint: "Photos of your products and shopfront",
  },
  {
    id: "fitness",
    name: "Fitness or wellness",
    tagline: "Stronger every day",
    headline: "Train smarter, feel better",
    subtext:
      "Whatever your starting point, we'll help you build strength, confidence and habits that last. All levels welcome.",
    ctaText: "Start your free trial",
    features: [
      { icon: "dumbbell", title: "Expert coaching", text: "Qualified trainers who watch your form, adjust your plan and keep you motivated." },
      { icon: "users", title: "Supportive community", text: "Small classes and friendly faces. You'll never feel lost in the crowd." },
      { icon: "calendar", title: "Flexible timetable", text: "Early mornings, lunchtimes and evenings, so training fits around your life." },
    ],
    story:
      "We built this space for people who felt intimidated by big-box gyms. No mirrors wall to wall, no judgement, just good coaching and a community that shows up for each other.\n\nWhether your goal is a first pull-up or a personal best, we'll meet you where you are.",
    teamRoles: ["Head coach and owner", "Coach and nutrition adviser"],
    services: [
      { name: "Group classes", description: "Strength, conditioning and mobility sessions for all levels.", price: "From $20 per class" },
      { name: "Personal training", description: "One-on-one sessions built around your goals.", price: "From $70 per session" },
      { name: "Monthly membership", description: "Unlimited classes plus open gym access.", price: "$120 per month" },
      { name: "Free intro session", description: "Try a class and meet the team before you commit.", price: "Free" },
    ],
    hours: "Mon to Fri: 6am to 8pm\nSat: 7am to 1pm\nSun: 8am to 12pm",
    galleryHint: "Photos of your space and classes",
  },
  {
    id: "nonprofit",
    name: "Nonprofit or community group",
    tagline: "Together, we make a difference",
    headline: "Building a stronger community, together",
    subtext:
      "We bring people together to support those who need it most. Every volunteer hour and every donation goes further than you'd think.",
    ctaText: "Get involved",
    features: [
      { icon: "heart", title: "Local impact", text: "Everything we do stays in the community. You can see where your support goes." },
      { icon: "users", title: "Volunteer led", text: "Run by people who live here and care about the place they call home." },
      { icon: "check", title: "Transparent", text: "We publish what we raise and how we spend it, every year." },
    ],
    story:
      "We started as a handful of neighbours who saw a need and decided to do something about it. Since then we've grown into a registered organisation with a dedicated group of volunteers.\n\nOur work is only possible because of the people who give their time and support. If you'd like to be part of it, we'd love to hear from you.",
    teamRoles: ["Chair", "Volunteer coordinator"],
    services: [
      { name: "Volunteer with us", description: "Regular and one-off opportunities to help, whatever your skills.", price: "" },
      { name: "Donate", description: "One-off or monthly gifts that fund our programmes directly.", price: "" },
      { name: "Community programmes", description: "Free workshops, events and support sessions open to everyone.", price: "Free" },
      { name: "Partner with us", description: "Sponsorship and partnership options for local businesses.", price: "" },
    ],
    hours: "Office: Mon to Thu, 10am to 4pm\nEvents: See our calendar",
    galleryHint: "Photos of events and volunteers",
  },
  {
    id: "other",
    name: "Something else",
    tagline: "Here to help",
    headline: "Welcome to our business",
    subtext:
      "We're a local business dedicated to doing great work for our customers. Have a look around, and get in touch if you'd like to know more.",
    ctaText: "Get in touch",
    features: [
      { icon: "star", title: "Quality first", text: "We take pride in what we do and it shows in every job." },
      { icon: "users", title: "Friendly service", text: "Real people, happy to answer your questions and help you out." },
      { icon: "pin", title: "Local and trusted", text: "Based right here, serving the community for years." },
    ],
    story:
      "We started this business because we saw a way to do things better. That meant putting customers first, being honest about what we can do, and doing it well.\n\nWe're proud of what we've built and grateful to everyone who has supported us along the way.",
    teamRoles: ["Owner", "Manager"],
    services: [
      { name: "Our main service", description: "A short description of the thing you do most.", price: "" },
      { name: "Another service", description: "Something else you offer, described in a sentence.", price: "" },
      { name: "Consultation", description: "A conversation about what you need and how we can help.", price: "Free" },
      { name: "Custom work", description: "Something specific to you? Ask us.", price: "Quoted" },
    ],
    hours: "Mon to Fri: 9am to 5pm\nWeekends: Closed",
    galleryHint: "Photos of your work",
  },
];

export const DEFAULT_BUSINESS_TYPE: BusinessType = "other";

export function getBusinessType(id: BusinessType): BusinessTypePreset {
  return BUSINESS_TYPES.find((b) => b.id === id) ?? BUSINESS_TYPES[BUSINESS_TYPES.length - 1];
}
