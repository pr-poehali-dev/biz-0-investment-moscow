import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "О нас", id: "about" },
  { label: "Сообщение", id: "report" },
  { label: "Контакты", id: "contacts" },
];

const CIPHER_CHARS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";

function useCipherEffect(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((char, i) => {
          if (i < iteration) return text[i];
          if (char === " ") return " ";
          return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 0.5;
    }, 30);
    return () => clearInterval(interval);
  }, [active, text]);
  return display;
}

function EncryptEffect({ text, delay = 0 }: { text: string; delay?: number }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const display = useCipherEffect(text, active);
  return <span>{display}</span>;
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [formState, setFormState] = useState({ category: "", message: "", contact: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [encryptProgress, setEncryptProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(l => document.getElementById(l.id));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i]!.offsetTop <= scrollY) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setEncryptProgress(0);
    let prog = 0;
    const iv = setInterval(() => {
      prog += 4;
      setEncryptProgress(prog);
      if (prog >= 100) {
        clearInterval(iv);
        setSubmitting(false);
        setSubmitted(true);
      }
    }, 40);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e4dc] font-body">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-[#c41e1e] flex items-center justify-center">
              <Icon name="Eye" size={14} className="text-[#c41e1e]" />
            </div>
            <span className="font-display text-sm tracking-[0.25em] uppercase text-[#e8e4dc] group-hover:text-white transition-colors">
              РАЗВЕДКА
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-display text-xs tracking-[0.2em] uppercase transition-colors ${
                  activeSection === link.id ? "text-[#c41e1e]" : "text-[#6b6b6b] hover:text-[#e8e4dc]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button className="md:hidden text-[#6b6b6b] hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-display text-xs tracking-[0.2em] uppercase text-left text-[#6b6b6b] hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#e8e4dc 1px, transparent 1px), linear-gradient(90deg, #e8e4dc 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#c41e1e] to-transparent opacity-60" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-[1px] bg-[#c41e1e]" />
              <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#c41e1e]">
                Конфиденциально / Защищено
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-8 text-white">
              <EncryptEffect text="ЧАСТНАЯ" delay={200} />
              <br />
              <span className="text-[#c41e1e]">
                <EncryptEffect text="РАЗВЕДКА" delay={600} />
              </span>
            </h1>

            <p className="font-body text-[#6b6b6b] text-lg leading-relaxed max-w-xl mb-12">
              <EncryptEffect text="Анонимная платформа для передачи информации о преступниках и угрозах безопасности. Ваши данные защищены." delay={1200} />
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("report")}
                className="flex items-center gap-3 px-8 py-4 bg-[#c41e1e] hover:bg-[#a51818] text-white font-display text-xs tracking-[0.2em] uppercase transition-all duration-200"
              >
                <Icon name="Send" size={14} />
                Отправить сообщение
                <Icon name="ArrowRight" size={14} />
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="flex items-center gap-3 px-8 py-4 border border-[#2a2a2a] hover:border-[#4a4a4a] text-[#6b6b6b] hover:text-[#e8e4dc] font-display text-xs tracking-[0.2em] uppercase transition-all duration-200"
              >
                Узнать больше
              </button>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-8 border-t border-[#1e1e1e] pt-10 max-w-lg">
              {[
                { num: "100%", label: "Анонимность" },
                { num: "AES-256", label: "Шифрование" },
                { num: "24/7", label: "Приём данных" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-white mb-1">{s.num}</div>
                  <div className="font-display text-[10px] tracking-[0.2em] uppercase text-[#4a4a4a]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 border-t border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#c41e1e]" />
              <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#c41e1e]">О нас</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 max-w-lg">
              Профессиональная разведывательная служба
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={100}>
              <p className="text-[#8a8a8a] leading-relaxed text-base mb-6">
                Мы — независимая аналитическая служба, специализирующаяся на сборе и проверке информации о преступной деятельности. Работаем в строгом соответствии с законодательством.
              </p>
              <p className="text-[#8a8a8a] leading-relaxed text-base">
                Все поступающие сведения проходят многоуровневую верификацию. Личность отправителя не устанавливается — технические меры защиты гарантируют полную анонимность.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="grid grid-cols-1 gap-px bg-[#1a1a1a]">
                {[
                  { icon: "ShieldCheck", title: "Защита источника", desc: "Метаданные не сохраняются. IP-адрес не фиксируется." },
                  { icon: "Lock", title: "Шифрование AES-256", desc: "Сообщение зашифровывается на стороне клиента до отправки." },
                  { icon: "UserX", title: "Без регистрации", desc: "Никакой личной информации. Никаких аккаунтов." },
                  { icon: "FileCheck", title: "Верификация данных", desc: "Каждое обращение проверяется аналитическим отделом." },
                ].map((item, i) => (
                  <div key={i} className="bg-[#0a0a0a] p-6 flex gap-5 items-start group hover:bg-[#0f0f0f] transition-colors">
                    <div className="w-10 h-10 border border-[#1e1e1e] group-hover:border-[#c41e1e] flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon name={item.icon} size={16} className="text-[#c41e1e]" />
                    </div>
                    <div>
                      <div className="font-display text-sm font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-[#5a5a5a] text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* REPORT FORM */}
      <section id="report" className="py-32 border-t border-[#1e1e1e] bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#c41e1e]" />
              <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#c41e1e]">Передать сведения</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Анонимная форма
            </h2>
            <p className="text-[#5a5a5a] mb-16 max-w-md">
              Сообщение будет зашифровано и передано аналитикам. Ваша личность останется неизвестной.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-5 gap-12">
            <ScrollReveal className="md:col-span-3" delay={100}>
              {submitted ? (
                <div className="border border-[#1e1e1e] p-12 text-center">
                  <div className="w-16 h-16 border border-[#c41e1e] flex items-center justify-center mx-auto mb-6">
                    <Icon name="CheckCheck" size={24} className="text-[#c41e1e]" />
                  </div>
                  <div className="font-display text-xl font-bold text-white mb-3">Сообщение передано</div>
                  <p className="text-[#5a5a5a] text-sm">Зашифровано и отправлено в аналитический отдел.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ category: "", message: "", contact: "" }); }}
                    className="mt-8 font-display text-xs tracking-[0.2em] uppercase text-[#c41e1e] hover:text-white transition-colors"
                  >
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-0 border border-[#1a1a1a]">
                  <div className="p-6 border-b border-[#1a1a1a]">
                    <label className="block font-display text-[10px] tracking-[0.3em] uppercase text-[#4a4a4a] mb-3">
                      Категория угрозы
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Терроризм", "Организованная преступность", "Мошенничество", "Иное"].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormState(s => ({ ...s, category: cat }))}
                          className={`px-4 py-3 text-left font-display text-xs tracking-[0.1em] border transition-all ${
                            formState.category === cat
                              ? "border-[#c41e1e] text-white bg-[#c41e1e]/10"
                              : "border-[#1e1e1e] text-[#5a5a5a] hover:border-[#3a3a3a] hover:text-[#8a8a8a]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-b border-[#1a1a1a]">
                    <label className="block font-display text-[10px] tracking-[0.3em] uppercase text-[#4a4a4a] mb-3">
                      Сообщение *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                      placeholder="Опишите известные вам факты подробно..."
                      className="w-full bg-transparent text-[#e8e4dc] placeholder-[#2a2a2a] text-sm leading-relaxed resize-none outline-none font-body"
                    />
                  </div>

                  <div className="p-6 border-b border-[#1a1a1a]">
                    <label className="block font-display text-[10px] tracking-[0.3em] uppercase text-[#4a4a4a] mb-3">
                      Обратная связь <span className="text-[#2a2a2a]">(необязательно)</span>
                    </label>
                    <input
                      type="text"
                      value={formState.contact}
                      onChange={e => setFormState(s => ({ ...s, contact: e.target.value }))}
                      placeholder="Email или защищённый мессенджер..."
                      className="w-full bg-transparent text-[#e8e4dc] placeholder-[#2a2a2a] text-sm outline-none font-body"
                    />
                  </div>

                  <div className="p-6">
                    {submitting ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display text-[10px] tracking-[0.3em] uppercase text-[#c41e1e]">
                            Шифрование...
                          </span>
                          <span className="font-display text-[10px] text-[#4a4a4a]">{encryptProgress}%</span>
                        </div>
                        <div className="w-full h-[1px] bg-[#1a1a1a] relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-[#c41e1e] transition-all duration-75"
                            style={{ width: `${encryptProgress}%` }}
                          />
                        </div>
                        <div className="font-mono text-[10px] text-[#2a2a2a] leading-relaxed h-8 overflow-hidden">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i}>
                              {Array.from({ length: 40 }).map(() =>
                                CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
                              ).join("")}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 py-4 bg-[#c41e1e] hover:bg-[#a51818] text-white font-display text-xs tracking-[0.3em] uppercase transition-colors"
                      >
                        <Icon name="Lock" size={14} />
                        Зашифровать и отправить
                      </button>
                    )}
                  </div>
                </form>
              )}
            </ScrollReveal>

            <ScrollReveal className="md:col-span-2" delay={200}>
              <div className="space-y-6">
                <div className="border-l-2 border-[#c41e1e] pl-5 py-1">
                  <div className="font-display text-xs font-semibold text-white mb-2">Что происходит с данными?</div>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed">Сообщение шифруется до отправки и поступает напрямую в закрытый аналитический канал.</p>
                </div>
                <div className="border-l-2 border-[#2a2a2a] pl-5 py-1">
                  <div className="font-display text-xs font-semibold text-white mb-2">Что считается значимым?</div>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed">Любая конкретная информация: имена, адреса, транспортные средства, схемы, связи.</p>
                </div>
                <div className="border-l-2 border-[#2a2a2a] pl-5 py-1">
                  <div className="font-display text-xs font-semibold text-white mb-2">Ваша безопасность</div>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed">Рекомендуем использовать Tor Browser или VPN при отправке особо чувствительной информации.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-32 border-t border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#c41e1e]" />
              <span className="font-display text-[10px] tracking-[0.4em] uppercase text-[#c41e1e]">Контакты</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16">
              Связаться с нами
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]">
            {[
              { icon: "Mail", label: "Защищённая почта", value: "secure@razvedka.ru", desc: "PGP шифрование доступно" },
              { icon: "MessageSquare", label: "Telegram", value: "@razvedka_ru", desc: "Секретный чат рекомендован" },
              { icon: "Phone", label: "Горячая линия", value: "+7 (495) 000-00-00", desc: "Пн–Пт, 9:00–20:00" },
            ].map((c, i) => (
              <ScrollReveal key={i} delay={i * 100} className="bg-[#0a0a0a] p-8 group hover:bg-[#0d0d0d] transition-colors cursor-pointer">
                <div className="w-12 h-12 border border-[#1e1e1e] group-hover:border-[#c41e1e] flex items-center justify-center mb-6 transition-colors">
                  <Icon name={c.icon} size={18} className="text-[#c41e1e]" />
                </div>
                <div className="font-display text-[10px] tracking-[0.3em] uppercase text-[#4a4a4a] mb-2">{c.label}</div>
                <div className="font-display text-sm font-semibold text-white mb-2">{c.value}</div>
                <div className="text-[#3a3a3a] text-xs">{c.desc}</div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300} className="mt-8 p-6 border border-[#1a1a1a] flex items-start gap-4">
            <Icon name="AlertTriangle" size={16} className="text-[#c41e1e] flex-shrink-0 mt-0.5" />
            <p className="text-[#4a4a4a] text-sm leading-relaxed">
              В случае непосредственной угрозы — немедленно обращайтесь в правоохранительные органы:{" "}
              <span className="text-[#8a8a8a]">102 (полиция), 112 (экстренные службы)</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-[#c41e1e] flex items-center justify-center">
              <Icon name="Eye" size={10} className="text-[#c41e1e]" />
            </div>
            <span className="font-display text-[10px] tracking-[0.3em] uppercase text-[#2a2a2a]">РАЗВЕДКА © 2026</span>
          </div>
          <div className="font-display text-[10px] tracking-[0.2em] uppercase text-[#2a2a2a]">
            Все данные защищены · Анонимность гарантирована
          </div>
        </div>
      </footer>
    </div>
  );
}
