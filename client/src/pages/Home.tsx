import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, ChevronRight, Command, MoveUpRight, Send, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ContactForm } from "@/components/ContactForm";
import { resources, stories, trustSignals } from "@/data/site";
import styles from "@/styles/Site.module.css";
import { applyPageMeta } from "@/lib/seo";

const issues = [
  { title: "Critical systems slow the next move", body: "When the logic inside legacy applications is hard to see, every change carries too much uncertainty.", link: "/solutions/legacy-modernization", glyph: "01" },
  { title: "AI pilots struggle to become operating systems", body: "Without context, governance and useful workflows, promising experiments remain difficult to trust and scale.", link: "/platforms/bodhi", glyph: "02" },
  { title: "Operations react after the signal has passed", body: "Teams need a shared view of what is happening, why it matters and how to respond before small issues compound.", link: "/platforms/sustain", glyph: "03" },
];

const platforms = [
  { name: "Bodhi", kicker: "Orchestrate", title: "Intelligence that understands the work around it.", text: "Design governed agent workflows that use the right enterprise context at the right time.", to: "/platforms/bodhi", theme: "bodhi" },
  { name: "Slingshot", kicker: "Modernize", title: "A clearer path from legacy to next.", text: "Recover the rules inside critical systems and build the future without losing what matters.", to: "/platforms/slingshot", theme: "slingshot" },
  { name: "Sustain", kicker: "Resilience", title: "Operations that can see further ahead.", text: "Connect signals and response paths to make service teams more anticipatory and confident.", to: "/platforms/sustain", theme: "sustain" },
];

export default function Home() {
  const [activeIssue, setActiveIssue] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const issue = issues[activeIssue];

  useEffect(() => { applyPageMeta({ title: "Enterprise intelligence for the next move", description: "Ascend Collective connects strategy, experience, engineering and intelligent systems so complex organizations can move with more confidence.", path: "/" }); }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return <>
    <section className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className={styles.heroInner}>
        <div className={styles.heroEyebrow}><Sparkles size={14} aria-hidden="true" /> Context-first enterprise intelligence</div>
        <h1>Build what the enterprise needs <em>next.</em></h1>
        <p>Ascend Collective brings strategy, experience, engineering and intelligent systems into the same conversation—so complex organizations can move with more confidence.</p>
        <form className={styles.heroSearch} onSubmit={submitSearch}>
          <Command size={19} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search ideas and capabilities" placeholder="What are you working through?" />
          <button type="submit" aria-label="Search"><Send size={17} aria-hidden="true" /></button>
        </form>
        <div className={styles.heroLinks}><Link to="/platforms"><span>Explore the platform view</span><ArrowRight size={15} aria-hidden="true" /></Link><Link to="/contact"><span>Talk to a practitioner</span><ArrowRight size={15} aria-hidden="true" /></Link></div>
      </div>
      <div className={styles.heroOrb} aria-hidden="true"><div /><div /><div /></div>
    </section>

    <section className={styles.trustSection} aria-label="Areas of enterprise focus">
      <p>Designed for the systems, services and decisions that define an enterprise</p>
      <div className={styles.trustTrack}>{[...trustSignals, ...trustSignals].map((signal, index) => <span key={`${signal}-${index}`}>{signal}<i /></span>)}</div>
    </section>

    <section className={styles.issuesSection}>
      <div className={styles.sectionHeader}><span className={styles.eyebrow}>The work in front of you</span><h2>Enterprise progress begins when the real constraints are visible.</h2><p>Across industries, the same patterns slow momentum: tangled systems, disconnected work and operations that lack a useful shared context.</p></div>
      <div className={styles.issueExplorer}>
        <div role="tablist" aria-label="Enterprise issues" className={styles.issueTabs}>{issues.map((item, index) => <button key={item.title} role="tab" aria-selected={activeIssue === index} onClick={() => setActiveIssue(index)}><span>{item.glyph}</span>{item.title}<ChevronRight size={18} aria-hidden="true" /></button>)}</div>
        <article className={styles.issuePanel} aria-live="polite"><div className={styles.issueVisual} data-issue={activeIssue}><span>Signal</span><b>{issue.glyph}</b><i /><i /><i /></div><div><span className={styles.eyebrow}>The challenge</span><h3>{issue.title}</h3><p>{issue.body}</p><Link to={issue.link} className={styles.textLink}>Explore the approach <ArrowRight size={16} aria-hidden="true" /></Link></div></article>
      </div>
    </section>

    <section className={styles.expertiseSection}>
      <div className={styles.expertiseCopy}><span className={styles.eyebrow}>A different kind of enterprise partner</span><h2>Expertise is more useful when it has somewhere to <em>go.</em></h2><p>We bring people who understand an industry, a function and the realities of delivery. Then we connect that perspective to platforms designed to make context operational.</p><Link to="/company/why-us" className={styles.lightLink}>How we work <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <div className={styles.expertiseStats}><div><strong>Strategy</strong><span>Make the next choice clearer.</span></div><div><strong>Experience</strong><span>Design services that hold together.</span></div><div><strong>Engineering</strong><span>Build the system that can evolve.</span></div><div><strong>Intelligence</strong><span>Bring context to every move.</span></div></div>
    </section>

    <section className={styles.platformSection}>
      <div className={styles.sectionHeaderWide}><div><span className={styles.eyebrow}>Platforms for the work</span><h2>Three ways to make enterprise intelligence practical.</h2></div><Link to="/platforms" className={styles.textLink}>View all platforms <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <div className={styles.platformGrid}>{platforms.map((platform, index) => <article className={`${styles.platformCard} ${styles[platform.theme]}`} key={platform.name}><div className={styles.platformMark}><span>{String(index + 1).padStart(2, "0")}</span><i /></div><span className={styles.platformKicker}>{platform.kicker}</span><h3>{platform.name}</h3><p className={styles.platformTitle}>{platform.title}</p><p>{platform.text}</p><Link to={platform.to}>Explore {platform.name} <MoveUpRight size={16} aria-hidden="true" /></Link></article>)}</div>
    </section>

    <section className={styles.storiesSection}>
      <div className={styles.sectionHeaderWide}><div><span className={styles.eyebrow}>Transformation in motion</span><h2>What changes when the enterprise has a clearer way forward.</h2></div><Link to="/customers/stories" className={styles.textLink}>Customer stories <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <div className={styles.storyShowcase}>{stories.slice(0, 3).map((story, index) => <article className={styles.storyCard} key={story.slug}><div className={`${styles.storyArt} ${styles[story.theme]}`}><span>{story.sector}</span><b>{String(index + 1).padStart(2, "0")}</b><i /><i /></div><div className={styles.storyBody}><span className={styles.eyebrow}>{story.sector} · illustrative engagement</span><h3>{story.title}</h3><p>{story.summary}</p><div className={styles.storySignals}>{story.signals.map((signal) => <div key={signal.label}><strong>{signal.value}</strong><span>{signal.label}</span></div>)}</div><Link to={`/customers/stories/${story.slug}`}>Read the story <ArrowRight size={15} aria-hidden="true" /></Link></div></article>)}</div>
    </section>

    <section className={styles.scaleSection}><div><span className={styles.eyebrow}>Enterprise scale, in focus</span><h2>Progress is a system—not a single launch.</h2></div><div className={styles.scaleStats}><div><strong>01</strong><span>Context before automation</span></div><div><strong>02</strong><span>Connected disciplines</span></div><div><strong>03</strong><span>Practical governance</span></div><div><strong>04</strong><span>Learning in the flow of work</span></div></div></section>

    <section className={styles.recognitionSection}><div><span className={styles.eyebrow}>Ideas worth exploring</span><h2>Perspectives for people building the next enterprise move.</h2></div><div className={styles.recognitionGrid}>{resources.slice(0, 3).map((resource, index) => <Link key={resource.slug} to={`/resources/blog/${resource.slug}`} className={styles.resourceFeature}><span>0{index + 1} · {resource.category}</span><h3>{resource.title}</h3><p>{resource.summary}</p><b>Read perspective <ArrowRight size={16} aria-hidden="true" /></b></Link>)}</div></section>

    <section className={styles.contactSection} id="connect"><div className={styles.contactIntro}><span className={styles.eyebrow}>Ready to move?</span><h2>Start with the question that is already on your desk.</h2><p>Bring the opportunity, constraint or decision. We will bring a practical point of view on how to make the next move clearer.</p><ul><li><Check size={15} aria-hidden="true" /> Discuss an enterprise opportunity</li><li><Check size={15} aria-hidden="true" /> Explore a focused platform application</li><li><Check size={15} aria-hidden="true" /> Find a useful next step</li></ul></div><div className={styles.contactPanel}><span className={styles.eyebrow}>Get in touch</span><h3>Tell us where you want to go next.</h3><ContactForm compact /></div></section>
  </>;
}
