export type NavItem = { label: string; to: string; description?: string };

export type NavGroup = {
  label: string;
  to?: string;
  items?: NavItem[];
  secondary?: { label: string; items: NavItem[] };
};

export type PageEntity = {
  family: "solutions" | "industries" | "platforms" | "capabilities" | "company";
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  accent: "red" | "ember" | "violet" | "green" | "blue";
  intro: string;
  pillars: { title: string; body: string }[];
  outcomes: { value: string; label: string }[];
  related: string[];
};

export type Story = {
  slug: string;
  sector: string;
  title: string;
  summary: string;
  signals: { value: string; label: string }[];
  theme: string;
};

export type Resource = {
  slug: string;
  category: "Article" | "Research" | "Guide";
  title: string;
  summary: string;
  date: string;
  theme: string;
};

export const announcementItems = [
  { label: "A context-first approach to enterprise AI", to: "/platforms/bodhi" },
  { label: "Modernization that keeps critical work moving", to: "/solutions/legacy-modernization" },
  { label: "How resilient operations become a capability", to: "/platforms/sustain" },
];

export const navGroups: NavGroup[] = [
  {
    label: "Solutions",
    items: [
      { label: "Legacy Modernization", to: "/solutions/legacy-modernization", description: "Move critical systems forward with confidence." },
      { label: "Content Supply Chain", to: "/solutions/content-supply-chain", description: "Make content creation connected and reusable." },
      { label: "Customer Engagement", to: "/solutions/customer-engagement", description: "Turn signals into useful customer moments." },
      { label: "Digital Commerce", to: "/solutions/digital-commerce", description: "Create buying systems that continuously adapt." },
      { label: "Experience Transformation", to: "/solutions/experience-transformation", description: "Unite services around people and outcomes." },
    ],
    secondary: {
      label: "Ecosystem",
      items: [
        { label: "Partners", to: "/company/partners", description: "Technology ecosystems shaped for delivery." },
        { label: "How we work", to: "/company/why-us", description: "A practical model for complex change." },
      ],
    },
  },
  {
    label: "Industries",
    items: [
      { label: "Consumer Products", to: "/industries/consumer-products" },
      { label: "Energy & Commodities", to: "/industries/energy-commodities" },
      { label: "Financial Services", to: "/industries/financial-services" },
      { label: "Health", to: "/industries/health" },
      { label: "Public Sector", to: "/industries/public-sector" },
      { label: "Retail", to: "/industries/retail" },
      { label: "Telecom, Media & Tech", to: "/industries/telecom-media-tech" },
      { label: "Transportation & Mobility", to: "/industries/transportation-mobility" },
      { label: "Travel & Hospitality", to: "/industries/travel-hospitality" },
    ],
  },
  {
    label: "AI Platforms",
    items: [
      { label: "Platform overview", to: "/platforms", description: "Context, intelligence and delivery in concert." },
      { label: "Bodhi", to: "/platforms/bodhi", description: "Design and orchestrate enterprise agents." },
      { label: "Slingshot", to: "/platforms/slingshot", description: "Recover, modernize and accelerate software." },
      { label: "Sustain", to: "/platforms/sustain", description: "Anticipate and resolve operational issues." },
    ],
  },
  { label: "Customers", to: "/customers/stories" },
  {
    label: "Resources",
    items: [
      { label: "Blog", to: "/resources/blog", description: "Perspectives from teams doing the work." },
      { label: "Demo library", to: "/resources/demos", description: "Short walkthroughs of enterprise concepts." },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", to: "/company/about" },
      { label: "Why us", to: "/company/why-us" },
      { label: "Newsroom", to: "/company/newsroom" },
      { label: "Accolades", to: "/company/accolades" },
      { label: "Locations", to: "/company/locations" },
      { label: "Capabilities", to: "/capabilities" },
    ],
  },
];

function entity(
  family: PageEntity["family"],
  slug: string,
  eyebrow: string,
  title: string,
  summary: string,
  accent: PageEntity["accent"],
  pillars: PageEntity["pillars"],
): PageEntity {
  return {
    family,
    slug,
    eyebrow,
    title,
    summary,
    accent,
    intro: "Complex organizations need progress that can survive real operating conditions. We bring the strategic, technical and experience disciplines together around the work that matters, then make the next decision easier to act on.",
    pillars,
    outcomes: [
      { value: "01", label: "Shared context" },
      { value: "02", label: "Practical pathways" },
      { value: "03", label: "Connected delivery" },
    ],
    related: ["/platforms/bodhi", "/customers/stories", "/contact"],
  };
}

export const pages: PageEntity[] = [
  entity("solutions", "legacy-modernization", "Solution", "Modernize what powers the enterprise.", "Bring clarity to systems with years of embedded knowledge—without putting current operations at risk.", "red", [
    { title: "Recover the logic", body: "Map the rules, relationships and decisions hidden inside business-critical code and processes." },
    { title: "Sequence the change", body: "Prioritize modernization through a business lens, with clear dependencies and measured risk." },
    { title: "Build a future-ready core", body: "Create an operating foundation that supports new products, data and intelligent workflows." },
  ]),
  entity("solutions", "content-supply-chain", "Solution", "Make every content decision more connected.", "Shape an intelligent content system that improves reuse, stewardship and relevance across markets.", "ember", [
    { title: "Connect the signal", body: "Bring asset, audience and channel context into one view of what deserves attention." },
    { title: "Orchestrate creation", body: "Guide teams and agents through reusable workflows without losing the editorial point of view." },
    { title: "Learn as you publish", body: "Turn performance signals into practical decisions for the next piece of work." },
  ]),
  entity("solutions", "customer-engagement", "Solution", "Turn customer complexity into useful moments.", "Design engagement systems that respond to people, context and changing expectations.", "violet", [
    { title: "Understand the moment", body: "Unify behavior, service and journey signals in the flow of customer work." },
    { title: "Design for continuity", body: "Connect experiences across channels so customers do not need to restart the conversation." },
    { title: "Improve with evidence", body: "Use live learning loops to make each interaction clearer and more valuable." },
  ]),
  entity("solutions", "digital-commerce", "Solution", "Commerce that adapts as customers do.", "Create a commerce foundation that connects discovery, decisioning and fulfillment without slowing teams down.", "green", [
    { title: "Make decisions closer to demand", body: "Bring customer, inventory and operational signals into everyday commerce choices." },
    { title: "Keep the core moving", body: "Evolve buying experiences without destabilizing critical platforms and order flows." },
    { title: "Deliver continuously", body: "Build a release model that keeps learning, quality and delivery in one rhythm." },
  ]),
  entity("solutions", "experience-transformation", "Solution", "Create experiences people can keep moving through.", "Reframe fragmented services around the people, teams and decisions they are meant to support.", "blue", [
    { title: "Find the friction", body: "Look beyond channels to identify the moments that slow customers and employees down." },
    { title: "Design the whole service", body: "Join product, process, data and operations in one experience model." },
    { title: "Make change usable", body: "Deliver practical improvements that teams can adopt and sustain." },
  ]),
  entity("industries", "consumer-products", "Industry", "Consumer products that move with culture.", "Make every portfolio, channel and market more responsive to the people buying and using it.", "red", [
    { title: "Sense demand", body: "Turn distributed signals into a clearer picture of what customers need next." },
    { title: "Scale relevance", body: "Enable market teams to shape content and commerce around local context." },
    { title: "Connect the operation", body: "Align supply, service and customer work around the same decisions." },
  ]),
  entity("industries", "energy-commodities", "Industry", "Resilient energy, grounded in real operations.", "Use connected data and intelligent workflows to make high-consequence decisions more confident.", "ember", [
    { title: "See the system", body: "Create a shared operating view across assets, markets and field work." },
    { title: "Respond earlier", body: "Surface emerging risk and opportunity before it becomes disruption." },
    { title: "Embed knowledge", body: "Make specialist expertise available in repeatable workflows." },
  ]),
  entity("industries", "financial-services", "Industry", "Financial systems ready for what is next.", "Modernize with a clear view of regulation, resilience and the customer moments that matter.", "violet", [
    { title: "Protect the critical", body: "Advance core systems while keeping governance, evidence and controls in view." },
    { title: "Connect the decision", body: "Bring data, policy and workflow context together for practical automation." },
    { title: "Earn customer trust", body: "Create service journeys that are clear, timely and designed for confidence." },
  ]),
  entity("industries", "health", "Industry", "Health experiences with people at the center.", "Connect services, teams and systems so care can feel more coherent for everyone involved.", "green", [
    { title: "Simplify the path", body: "Reduce avoidable complexity in access, navigation and service coordination." },
    { title: "Support the workforce", body: "Make knowledge and workflow assistance available when teams need it." },
    { title: "Build responsibly", body: "Design data and automation practices that respect trust and governance." },
  ]),
  entity("industries", "public-sector", "Industry", "Public services designed for real life.", "Improve how institutions understand needs, coordinate work and deliver dependable digital services.", "blue", [
    { title: "Start with access", body: "Design services that are easier to understand and use across communities." },
    { title: "Connect delivery", body: "Align policy, casework and service operations around the person being served." },
    { title: "Build trust", body: "Make transparency, security and accountability part of every decision." },
  ]),
  entity("industries", "retail", "Industry", "Retail systems that can respond in the moment.", "Join customer, workforce and inventory decisions in a more adaptive operating model.", "red", [
    { title: "Unify the view", body: "Bring store, digital and fulfillment signals into one decision environment." },
    { title: "Make work easier", body: "Support teams with context-aware tools where service and operations meet." },
    { title: "Adapt the model", body: "Test, learn and improve commercial decisions without waiting for a large program." },
  ]),
  entity("industries", "telecom-media-tech", "Industry", "Build digital businesses that keep learning.", "Design for the pace of technology, the complexity of ecosystems and the expectations of connected audiences.", "violet", [
    { title: "Modernize the foundation", body: "Create flexible platforms and delivery practices that make change less costly." },
    { title: "Make context useful", body: "Use connected signals to improve product, service and operational decisions." },
    { title: "Scale the experience", body: "Bring quality and relevance to every high-volume interaction." },
  ]),
  entity("industries", "transportation-mobility", "Industry", "Mobility designed as a connected system.", "Bring together service, operations and customer confidence across every moving part.", "green", [
    { title: "Coordinate the network", body: "Create clarity across systems, journeys, assets and service teams." },
    { title: "Respond with confidence", body: "Build early-warning and resolution pathways for dynamic operations." },
    { title: "Improve the journey", body: "Connect the customer experience to the reality of live operations." },
  ]),
  entity("industries", "travel-hospitality", "Industry", "Travel that feels more personal, from first search to return.", "Create seamless travel and hospitality experiences while keeping service operations ready for change.", "blue", [
    { title: "Understand intent", body: "Use timely signals to improve discovery, planning and service decisions." },
    { title: "Connect the stay", body: "Align digital, on-property and service-team experiences." },
    { title: "Operate resiliently", body: "Help teams anticipate disruption and protect the quality of the journey." },
  ]),
  entity("platforms", "bodhi", "AI Platform", "Orchestrate agents around enterprise context.", "Bodhi helps teams shape governed, context-aware workflows that can move from experimentation into operating reality.", "red", [
    { title: "Context graph", body: "Connect systems, policies, data and workflow knowledge around the work an agent must do." },
    { title: "Agent choreography", body: "Design specialist agents that can coordinate, escalate and stay within clear boundaries." },
    { title: "Governed progress", body: "Give teams a practical way to observe, evaluate and improve intelligent workflows." },
  ]),
  entity("platforms", "slingshot", "AI Platform", "Turn software complexity into a path forward.", "Slingshot brings structure to legacy and new software work so teams can understand, build and evolve with more confidence.", "ember", [
    { title: "Discover", body: "Recover technical and business context from applications, interfaces and delivery history." },
    { title: "Modernize", body: "Build an evidence-led sequence from legacy code to a cleaner service foundation." },
    { title: "Accelerate", body: "Support delivery teams with knowledge that stays connected from planning through release." },
  ]),
  entity("platforms", "sustain", "AI Platform", "Build operations that see further ahead.", "Sustain connects operational signals, knowledge and response workflows to help teams prevent issues and recover faster.", "green", [
    { title: "Sense", body: "Bring telemetry, incident and service context into one operational picture." },
    { title: "Interpret", body: "Help teams understand likely causes and relevant response paths." },
    { title: "Resolve", body: "Coordinate action with automation, clear escalation and learning from each incident." },
  ]),
  entity("capabilities", "strategy", "Capability", "Strategy that knows how work becomes real.", "Move from ambition to focused choices with teams that understand business, operating models and technology together.", "blue", [
    { title: "Frame the decision", body: "Translate uncertainty into the few choices that will unlock meaningful progress." },
    { title: "Connect the system", body: "See how markets, operations, technology and people affect the path forward." },
    { title: "Mobilize the work", body: "Build a clear, practical route from direction to delivery." },
  ]),
  entity("capabilities", "product", "Capability", "Products designed to keep learning.", "Create product organizations and experiences that can respond to evidence rather than assumptions.", "violet", [
    { title: "Find the value", body: "Focus on the outcomes that make a meaningful difference for customers and teams." },
    { title: "Shape the product", body: "Bring experience, data and engineering into one continuous team." },
    { title: "Evolve responsibly", body: "Set learning loops that improve the product without losing trust or clarity." },
  ]),
  entity("capabilities", "experience", "Capability", "Experience that works as a complete service.", "Design the customer and employee moments that turn organizational complexity into a clearer path.", "red", [
    { title: "Understand people", body: "Combine research, behavioral data and operational insight to see the full moment." },
    { title: "Design the flow", body: "Create coherent paths across products, channels and people." },
    { title: "Make it usable", body: "Ensure the experience can be delivered, maintained and improved in the real world." },
  ]),
  entity("capabilities", "engineering", "Capability", "Engineering built for continuous change.", "Build high-quality systems and delivery practices that make ambitious ideas more sustainable to operate.", "ember", [
    { title: "Build the right foundation", body: "Design flexible architectures for the change that is already on the horizon." },
    { title: "Ship with confidence", body: "Create delivery systems where quality, security and speed reinforce one another." },
    { title: "Keep improving", body: "Use automation and clear feedback loops to make everyday engineering stronger." },
  ]),
  entity("capabilities", "data-ai", "Capability", "Data and AI with a usable center of gravity.", "Connect responsible data practices to focused AI applications that support people doing real work.", "green", [
    { title: "Make data available", body: "Improve access, trust and context without creating another disconnected layer." },
    { title: "Design intelligence", body: "Shape useful AI interactions around people, decisions and governance." },
    { title: "Embed learning", body: "Build the capability to test, monitor and evolve intelligent systems." },
  ]),
  entity("capabilities", "global-capability-centers", "Capability", "Capability centers that create momentum.", "Evolve global delivery into a connected source of product, engineering and business value.", "blue", [
    { title: "Set the mandate", body: "Define a clear role for the capability center within the wider enterprise system." },
    { title: "Build the model", body: "Connect talent, platforms and ways of working around meaningful outcomes." },
    { title: "Create pull", body: "Make the capability center a partner teams choose to work with, not a handoff point." },
  ]),
  entity("company", "about", "Company", "Built for the hard work of change.", "We combine strategy, experience, engineering and intelligent systems to help enterprises move forward with more confidence.", "red", [
    { title: "Start with the work", body: "We focus on the systems, journeys and decisions that determine whether change sticks." },
    { title: "Bring disciplines together", body: "Our teams work across business, design and technology from the first question." },
    { title: "Build for the next move", body: "Every engagement is designed to leave clients with greater capability, not dependency." },
  ]),
  entity("company", "why-us", "Company", "The future does not arrive one discipline at a time.", "Our approach brings people, products and platforms into the same conversation so work can move at the speed of real opportunity.", "violet", [
    { title: "Enterprise fluency", body: "We understand the constraints that come with operating at scale." },
    { title: "Platform thinking", body: "We build reusable advantage, not a succession of one-off interventions." },
    { title: "Delivery energy", body: "We stay close to the work until the new operating rhythm is in place." },
  ]),
  entity("company", "newsroom", "Company", "News from the work in motion.", "Explore independently authored updates and perspectives from across the organization.", "blue", [
    { title: "What's changing", body: "A concise view of current themes in enterprise transformation." },
    { title: "What we're learning", body: "Notes from practitioners turning complex work into usable progress." },
    { title: "Where to find us", body: "Opportunities to continue the conversation with our teams." },
  ]),
  entity("company", "accolades", "Company", "Work that gets noticed for the right reasons.", "A transparent view of selected recognition themes, presented without third-party award claims in this independent recreation.", "ember", [
    { title: "Responsible intelligence", body: "Recognition for work that connects technology to practical human outcomes." },
    { title: "Service transformation", body: "Recognition for experiences that improve how people navigate complexity." },
    { title: "Engineering practice", body: "Recognition for delivery systems that make progress more reliable." },
  ]),
  entity("company", "locations", "Company", "Global perspective. Local context.", "Meet a connected team that works across regions, time zones and enterprise realities.", "green", [
    { title: "Americas", body: "Teams close to ambitious organizations across North and South America." },
    { title: "Europe & Middle East", body: "Collaborative hubs that bring regional context to global programs." },
    { title: "Asia Pacific", body: "A growing network of product, engineering and transformation talent." },
  ]),
  entity("company", "partners", "Ecosystem", "Collaboration built into the solution.", "Partner ecosystems create more choice and a clearer route from architecture to value.", "blue", [
    { title: "Complementary platforms", body: "Choose technologies that fit the operating context, not just the feature list." },
    { title: "Shared delivery", body: "Bring specialist teams together around the same service and outcome model." },
    { title: "Clear accountability", body: "Keep decision-making and delivery transparent across a complex ecosystem." },
  ]),
];

export const stories: Story[] = [
  { slug: "connected-operations", sector: "Operations", title: "Connecting service signals before disruption compounds.", summary: "An illustrative operating model for turning fragmented signals into a shared response path.", signals: [{ value: "Live", label: "operating context" }, { value: "One", label: "response rhythm" }, { value: "Clear", label: "escalation paths" }], theme: "signal" },
  { slug: "platform-foundation", sector: "Financial Services", title: "Making a modernization roadmap easier to trust.", summary: "An illustrative approach for recovering legacy understanding and sequencing the change with business priorities in view.", signals: [{ value: "Mapped", label: "decision logic" }, { value: "Shared", label: "delivery view" }, { value: "Ready", label: "next release" }], theme: "structure" },
  { slug: "content-ecosystem", sector: "Consumer Products", title: "Building a reusable content ecosystem across markets.", summary: "An illustrative content model for making local relevance and global learning work together.", signals: [{ value: "Connected", label: "asset context" }, { value: "Guided", label: "creation flow" }, { value: "Learning", label: "feedback loop" }], theme: "flow" },
  { slug: "adaptive-commerce", sector: "Retail", title: "A commerce operating model designed for change.", summary: "An illustrative approach to linking customer signals, decisions and fulfillment without creating fragile workarounds.", signals: [{ value: "Unified", label: "signal view" }, { value: "Adaptive", label: "decisioning" }, { value: "Continuous", label: "delivery" }], theme: "commerce" },
];

export const resources: Resource[] = [
  { slug: "context-is-the-enterprise-advantage", category: "Article", title: "Context is the enterprise advantage no model can manufacture.", summary: "A perspective on why operational knowledge belongs at the center of intelligent systems.", date: "August 2026", theme: "red" },
  { slug: "designing-work-that-agents-can-support", category: "Article", title: "Designing work that agents can genuinely support.", summary: "A practical look at the workflows, decisions and boundaries that make automation useful.", date: "July 2026", theme: "violet" },
  { slug: "legacy-modernization-without-the-drama", category: "Research", title: "Legacy modernization without the drama.", summary: "A field guide to building evidence and momentum before changing critical systems.", date: "July 2026", theme: "ember" },
  { slug: "what-resilient-operations-look-like", category: "Article", title: "What resilient operations look like in practice.", summary: "How teams can turn detection, interpretation and response into one operating rhythm.", date: "June 2026", theme: "green" },
  { slug: "an-enterprise-ai-decision-canvas", category: "Guide", title: "An enterprise AI decision canvas.", summary: "A compact framework for moving from ambitious ideas to governed experiments.", date: "June 2026", theme: "blue" },
  { slug: "the-service-behind-the-interface", category: "Article", title: "The service behind the interface.", summary: "Why customer experience becomes durable when operations are part of the design work.", date: "May 2026", theme: "red" },
];

export const trustSignals = ["Consumer", "Mobility", "Energy", "Retail", "Finance", "Health", "Travel", "Technology"];

export const contactReasons = ["Explore enterprise AI", "Modernize a critical system", "Improve customer experience", "Build resilient operations", "Something else"];

export const locations = [
  { region: "Americas", cities: ["Boston", "Chicago", "New York", "Toronto"] },
  { region: "Europe & Middle East", cities: ["London", "Berlin", "Paris", "Dubai"] },
  { region: "Asia Pacific", cities: ["Bengaluru", "Singapore", "Sydney", "Tokyo"] },
];

export function findPage(family: PageEntity["family"], slug: string) {
  return pages.find((page) => page.family === family && page.slug === slug);
}

export function findStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function findResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
