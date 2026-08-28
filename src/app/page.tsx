import Link from 'next/link';
import Image from 'next/image';
import { PhotoCarousel } from '@/components/photo-carousel';
import { FadeIn } from '@/components/fade-in';

const ticker = [
  'Movimento',
  'Força',
  'Elegância',
  'Flexibilidade',
  'Postura',
  'Bem-estar',
];

const benefits = [
  {
    title: 'Força',
    text: 'Desenvolvimento e fortalecimento muscular de forma progressiva.',
  },
  {
    title: 'Postura',
    text: 'Consciência corporal e alinhamento em cada movimento.',
  },
  {
    title: 'Flexibilidade',
    text: 'Maior mobilidade e amplitude nos movimentos do dia a dia.',
  },
  {
    title: 'Condicionamento',
    text: 'Uma aula dinâmica que trabalha resistência e energia.',
  },
  {
    title: 'Coordenação',
    text: 'Movimentos que estimulam equilíbrio e controle corporal.',
  },
  {
    title: 'Bem-estar',
    text: 'Uma experiência que une exercício, música e expressão.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Aquecimento',
    text: 'Preparação do corpo e ativação muscular para começar em segurança.',
  },
  {
    n: '02',
    title: 'Barra',
    text: 'Exercícios inspirados no ballet para força, postura e controle.',
  },
  {
    n: '03',
    title: 'Centro',
    text: 'Movimentos que trabalham equilíbrio, coordenação e estabilidade.',
  },
  {
    n: '04',
    title: 'Condicionamento',
    text: 'Sequências dinâmicas para resistência e energia.',
  },
  {
    n: '05',
    title: 'Alongamento',
    text: 'Desaceleração, mobilidade e relaxamento muscular ao final da aula.',
  },
];

const audience = [
  {
    q: 'Nunca fiz ballet?',
    a: 'Sem problema. O curso é pensado para iniciantes, no seu tempo.',
  },
  {
    q: 'Já faço atividade física?',
    a: 'O Ballet Fitness pode complementar a sua rotina de treino.',
  },
  {
    q: 'Tenho pouca flexibilidade?',
    a: 'A flexibilidade é desenvolvida progressivamente, aula após aula.',
  },
  {
    q: 'Preciso ter experiência com ballet?',
    a: 'Não. A modalidade não exige experiência prévia em ballet clássico.',
  },
];

export default function Home() {
  return (
    <div>
      <FadeIn
        immediate
        className="shell grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 lg:gap-24 lg:py-24"
      >
        <div className="max-w-xl">
          <p className="inline-flex rounded-full border border-[var(--line)] px-3 py-1 text-[0.65rem] tracking-[0.2em] text-[var(--muted)]">
            BALLET FITNESS
          </p>
          <h1 className="font-display mt-6 text-4xl leading-[1.15] text-[var(--accent)] md:text-5xl lg:text-[3.4rem]">
            Ballet que transforma o corpo.
            <br />
            Fitness que transforma você.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted)]">
            Curso online que combina a técnica e a elegância do ballet com
            exercícios de força, condicionamento e mobilidade.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            Não precisa de barra de ballet. Em casa, uma cadeira firme, a parede
            ou só o corpo já bastam.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/cursos" className="btn btn-primary">
              Ver o curso →
            </Link>
            <Link href="#sobre" className="btn btn-ghost px-0">
              Conhecer o Ballet Fitness
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] bg-[var(--accent-soft)] lg:min-h-[560px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/35 to-transparent" />
        </div>
      </FadeIn>

      <div className="overflow-hidden bg-[var(--accent-soft)] py-3 text-[var(--accent)]">
        <div className="marquee-track flex w-max gap-8 text-[0.7rem] tracking-[0.28em] uppercase">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              {item}
              <span aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </div>

      <FadeIn id="sobre" className="shell max-w-5xl py-28 text-center">
        <p className="kicker">Plenarte Fitness</p>
        <h2 className="font-display mt-4 text-3xl leading-snug text-[var(--accent)] md:text-4xl">
          Do mesmo universo da Plenarte, nasce uma nova forma de mover o corpo:
          a força do fitness com a elegância do ballet.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[var(--muted)]">
          Uma plataforma online dedicada ao Ballet Fitness, pensada para quem
          busca condicionamento com consciência corporal, postura e bem-estar —
          no seu ritmo, em casa.
        </p>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {[
            ['Ballet', 'Técnica e elegância'],
            ['Fitness', 'Força e energia'],
            ['Você', 'No centro da experiência'],
          ].map(([title, subtitle], index) => (
            <div
              key={title}
              className={`px-4 ${index > 0 ? 'md:border-l md:border-[var(--line)]' : ''}`}
            >
              <p className="font-display text-3xl text-[var(--accent)]">
                {title}
              </p>
              <p className="mt-2 kicker">{subtitle}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="shell grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 lg:gap-24 lg:py-24">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] rounded-tl-[4rem] rounded-br-[4rem] lg:min-h-[520px]">
          <Image
            src="/images/ballet-fitness-home.png"
            alt="Mulher em um movimento de ballet fitness, no chão, sem usar barra"
            fill
            className="object-cover object-[center_24%]"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div>
          <p className="kicker">Muito mais que uma aula</p>
          <h2 className="font-display mt-3 text-3xl text-[var(--accent)] md:text-4xl">
            Ballet e fitness em um só movimento.
          </h2>
          <p className="mt-5 leading-relaxed text-[var(--muted)]">
            O Ballet Fitness une elementos da técnica do ballet a exercícios de
            condicionamento. Não é academia tradicional — e também não exige
            formação clássica. É movimento com propósito: força, postura e
            presença.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              'Força',
              'Tonificação muscular',
              'Flexibilidade',
              'Equilíbrio',
              'Coordenação',
              'Postura',
              'Mobilidade',
              'Resistência',
            ].map(tag => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn className="shell py-24">
        <p className="kicker">Benefícios</p>
        <h2 className="font-display mt-3 max-w-xl text-3xl md:text-4xl">
          Seu corpo em movimento. Sua melhor versão.
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map(item => (
            <li
              key={item.title}
              className="card p-6 transition hover:-translate-y-0.5"
            >
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn className="shell py-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--accent-soft)] px-8 py-28 md:px-20">
          <p className="kicker">Experiência Plenarte Fitness</p>
          <h2 className="font-display mt-4 max-w-lg text-4xl text-[var(--accent)] md:text-5xl">
            Treine com a leveza do ballet.
          </h2>
          <p className="mt-8 max-w-2xl font-display text-lg text-[var(--muted)]">
            Movimento · Música · Força · Elegância · Corpo · Confiança ·
            Autoestima
          </p>
        </div>
      </FadeIn>

      <FadeIn className="shell max-w-4xl py-24">
        <p className="kicker">Como funciona</p>
        <h2 className="font-display mt-3 text-3xl md:text-4xl">
          A estrutura de uma aula de Ballet Fitness.
        </h2>
        <ol className="mt-12 space-y-10 border-l border-[var(--line)] pl-8">
          {steps.map(step => (
            <li key={step.n} className="flex gap-5">
              <p className="font-display w-12 shrink-0 text-3xl text-[var(--accent)]/45">
                {step.n}
              </p>
              <div>
                <h3 className="font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </FadeIn>

      <FadeIn className="shell py-24">
        <p className="kicker">Para quem é</p>
        <h2 className="font-display mt-3 text-3xl md:text-4xl">
          Ballet Fitness é para você?
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {audience.map(item => (
            <li key={item.q} className="card p-6">
              <h3 className="border-l-2 border-[var(--accent)] pl-3 font-medium">
                {item.q}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.a}</p>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn className="shell grid items-center gap-12 py-24 md:grid-cols-2 md:gap-16 lg:gap-24">
        <PhotoCarousel />
        <div>
          <p className="kicker">Instrutora</p>
          <h2 className="font-display mt-3 text-3xl text-[var(--accent)] md:text-4xl">
            Quem está com você nessa jornada.
          </h2>
          <h3 className="font-display mt-8 text-2xl">Fernanda Abreu</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Diretora, fundadora e responsável pela Plenarte Ballet.
          </p>
          <p className="mt-5 leading-relaxed text-[var(--muted)]">
            Bailarina, pedagoga, psicopedagoga e psicomotricista — e mãe da
            Maitê e do Dani. Na Plenarte, Fernanda une rigor técnico à escuta:
            cada corpo no seu tempo, com profundidade e expressão.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            A Plenarte Fitness nasce dessa mesma visão. Aqui, o ballet encontra
            o condicionamento para você treinar em casa, com consciência e
            presença.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="shell py-20">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--accent-soft)] px-8 py-16 text-center md:px-16">
          <h2 className="font-display text-3xl text-[var(--accent)] md:text-5xl">
            Seu próximo movimento começa aqui.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
            Escolha o curso, assista no seu ritmo e treine com a força do
            fitness e a elegância do ballet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/cursos" className="btn btn-primary">
              Ver o curso →
            </Link>
            <Link
              href="/cadastro"
              className="btn rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)]"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
