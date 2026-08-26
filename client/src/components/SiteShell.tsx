import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, Pause, Play, Search, Sparkles, X } from "lucide-react";
import { announcementItems, navGroups, pages, resources, stories } from "@/data/site";
import styles from "@/styles/Site.module.css";

type ShellProps = { children: React.ReactNode };

const searchEntries = [
  ...pages.map((page) => ({ label: page.title, type: page.eyebrow, to: `/${page.family}/${page.slug}`, summary: page.summary })),
  ...stories.map((story) => ({ label: story.title, type: "Customer story", to: `/customers/stories/${story.slug}`, summary: story.summary })),
  ...resources.map((resource) => ({ label: resource.title, type: resource.category, to: `/resources/blog/${resource.slug}`, summary: resource.summary })),
];

function BrandMark() {
  return (
    <Link to="/" className={styles.brand} aria-label="Ascend Collective home">
      <span>ascend</span>
      <strong>collective</strong>
    </Link>
  );
}

function AnnouncementRail() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % announcementItems.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const item = announcementItems[index];
  return (
    <div className={styles.announcement} aria-label="Featured update">
      <div className={styles.announcementInner}>
        <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
        <Link to={item.to}>{item.label} <ArrowRight size={14} aria-hidden="true" /></Link>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play announcements" : "Pause announcements"} className={styles.iconButtonLight}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    setQuery("");
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return searchEntries.slice(0, 6);
    return searchEntries.filter((entry) => `${entry.label} ${entry.type} ${entry.summary}`.toLowerCase().includes(term)).slice(0, 8);
  }, [query]);

  if (!open) return null;
  return (
    <div className={styles.dialogBackdrop} role="presentation" onMouseDown={onClose}>
      <section className={styles.searchDialog} role="dialog" aria-modal="true" aria-label="Search Ascend Collective" onMouseDown={(event) => event.stopPropagation()}>
        <div className={styles.searchHeading}>
          <div><span className={styles.eyebrow}>Search</span><h2>What are you working through?</h2></div>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close search"><X size={20} aria-hidden="true" /></button>
        </div>
        <label className={styles.searchInputWrap}>
          <Search size={20} aria-hidden="true" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, platforms or perspectives" />
        </label>
        <div className={styles.searchResults} aria-live="polite">
          {results.length ? results.map((result) => (
            <Link key={result.to} to={result.to} className={styles.searchResult}>
              <span>{result.type}</span><strong>{result.label}</strong><p>{result.summary}</p><ArrowRight size={17} aria-hidden="true" />
            </Link>
          )) : <p className={styles.noResults}>No matching content yet. Try a broader phrase.</p>}
        </div>
      </section>
    </div>
  );
}

function Header() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleMobileNavigation = useCallback(() => setMobileOpen((value) => !value), []);
  const handleMobilePointerUp = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleMobileNavigation();
  }, [toggleMobileNavigation]);
  const handleMobileKeyboardClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) toggleMobileNavigation();
  }, [toggleMobileNavigation]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  return (
    <>
      <AnnouncementRail />
      <a className={styles.skipLink} href="#main">Skip to main content</a>
      <header className={styles.header} onMouseLeave={() => setOpenGroup(null)}>
        <div className={styles.navFrame}>
          <BrandMark />
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navGroups.map((group) => group.items ? (
              <div key={group.label} className={styles.navMenu}>
                <button type="button" className={styles.navTrigger} aria-expanded={openGroup === group.label} onClick={() => setOpenGroup((current) => current === group.label ? null : group.label)}>
                  {group.label}<ChevronDown size={14} aria-hidden="true" />
                </button>
                {openGroup === group.label && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaPrimary}>
                      <span className={styles.menuLabel}>{group.label}</span>
                      {group.items.map((item) => <Link onClick={() => setOpenGroup(null)} key={item.to} to={item.to} className={styles.megaLink}><strong>{item.label}</strong>{item.description && <span>{item.description}</span>}<ArrowRight size={14} aria-hidden="true" /></Link>)}
                    </div>
                    {group.secondary && <div className={styles.megaSecondary}><span className={styles.menuLabel}>{group.secondary.label}</span>{group.secondary.items.map((item) => <Link onClick={() => setOpenGroup(null)} key={item.to} to={item.to} className={styles.megaLink}><strong>{item.label}</strong><span>{item.description}</span><ArrowRight size={14} aria-hidden="true" /></Link>)}</div>}
                  </div>
                )}
              </div>
            ) : <NavLink key={group.label} className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ""}`} to={group.to!}>{group.label}</NavLink>)}
          </nav>
          <div className={styles.navActions}>
            <button type="button" className={styles.searchToggle} onClick={() => setSearchOpen(true)} aria-label="Open search"><Search size={19} aria-hidden="true" /></button>
            <Link className={styles.connectButton} to="/contact">Let&apos;s connect <ArrowRight size={15} aria-hidden="true" /></Link>
            <button type="button" className={styles.mobileToggle} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onPointerUp={handleMobilePointerUp} onClick={handleMobileKeyboardClick}>{mobileOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}</button>
          </div>
        </div>
      </header>
      {mobileOpen && <div className={styles.mobilePanel}>
        <div className={styles.mobilePanelTop}><BrandMark /><button type="button" className={styles.iconButton} onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} aria-hidden="true" /></button></div>
        <nav aria-label="Mobile navigation" className={styles.mobileNav}>
          {navGroups.map((group) => group.items ? <details key={group.label}><summary>{group.label}<ChevronDown size={16} aria-hidden="true" /></summary><div>{group.items.map((item) => <Link onClick={() => setMobileOpen(false)} key={item.to} to={item.to}>{item.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}{group.secondary?.items.map((item) => <Link onClick={() => setMobileOpen(false)} key={item.to} to={item.to}>{item.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div></details> : <Link onClick={() => setMobileOpen(false)} to={group.to!}>{group.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}
        </nav>
        <div className={styles.mobilePanelActions}><button type="button" onClick={() => { setSearchOpen(true); setMobileOpen(false); }}><Search size={17} aria-hidden="true" /> Search</button><Link onClick={() => setMobileOpen(false)} to="/contact">Let&apos;s connect <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>}
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}

function Footer() {
  const footerGroups = navGroups.filter((group) => group.items).slice(0, 5);
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div className={styles.footerBrand}><BrandMark /><p>Where people, products and practical intelligence shape the next enterprise move.</p><Link to="/contact" className={styles.footerCta}>Start a conversation <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <div className={styles.footerGrid}>{footerGroups.map((group) => <div key={group.label}><h3>{group.label}</h3>{group.items!.slice(0, 6).map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}</div>)}</div>
    </div>
    <div className={styles.footerBottom}><span>© 2026 Ascend Collective. Independent demonstration experience.</span><div><Link to="/privacy">Privacy</Link><Link to="/privacy">Accessibility</Link><Link to="/privacy">Cookie settings</Link><a href="https://careers.publicissapient.com/" target="_blank" rel="noreferrer">Careers <ArrowRight size={12} aria-hidden="true" /></a></div></div>
  </footer>;
}

function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(window.localStorage.getItem("ascend-cookie-choice") === null), []);
  if (!visible) return null;
  const choose = (value: string) => { window.localStorage.setItem("ascend-cookie-choice", value); setVisible(false); };
  return <aside className={styles.cookieNotice} aria-label="Cookie preferences"><div><span className={styles.eyebrow}>Your preferences</span><p>We use a small local preference to remember your choice. This independent demo does not include behavioral advertising.</p></div><div><Link to="/privacy">Read privacy</Link><button type="button" className={styles.cookieSecondary} onClick={() => choose("essential")}>Essential only</button><button type="button" className={styles.cookiePrimary} onClick={() => choose("all")}>Accept</button></div></aside>;
}

export default function SiteShell({ children }: ShellProps) {
  return <div className={styles.site}><Header /><main id="main">{children}</main><Footer /><CookieNotice /></div>;
}
