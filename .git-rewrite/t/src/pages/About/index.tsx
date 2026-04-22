import React from 'react';
import { HeartHandshake, Users2, BookOpen, Award, Target, Lightbulb, MapPin, Phone, Clock, HandCoins, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
    // Calcula os anos de história dinamicamente
    const currentYear = new Date().getFullYear();
    const yearsOfHistory = currentYear - 1959;
    const values = [
        {
            title: 'Cuidado integral',
            description: 'Acolhemos cada criança com atenção individualizada, respeitando ritmos e histórias.',
            icon: <HeartHandshake className="w-6 h-6" />,
        },
        {
            title: 'Educação que transforma',
            description: 'Construímos conhecimento com intencionalidade pedagógica e experiências práticas.',
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            title: 'Transparência e confiança',
            description: 'Prestação de contas clara com famílias, parceiros e comunidade.',
            icon: <Lightbulb className="w-6 h-6" />,
        },
        {
            title: 'Parcerias fortes',
            description: 'Unimos educadores, voluntários e apoiadores para ampliar impacto.',
            icon: <Users2 className="w-6 h-6" />,
        },
    ];

    const highlights = [
        { label: 'Anos de história', value: yearsOfHistory.toString(), detail: 'fundado em 1959' },
        { label: 'Atendimento diário', value: '260', detail: 'crianças e adolescentes acolhidos' },
        { label: 'Equipe dedicada', value: '60', detail: 'educadores e colaboradores' },
        { label: 'Projetos ativos', value: '12', detail: 'educação, cultura e esporte' },
    ];

    const board = [
        'Presidente: Hélio Fernando Delalana Filho',
        'Vice-presidente: Luiz Arnaldo Alves Lima Filho',
        '1º Tesoureiro: Joaquim Rafael Delalana',
        '2º Tesoureiro: Rui Álvaro Iamarino',
        '1ª Secretária: Maria Cristina B. Iamarino',
        '2ª Secretária: Vanessa Luísa Delfino Fuirini Alves Lima',
    ];

    const counselors = ['Ana Maria do Nascimento Brunialti', 'Patrícia Job Dorigatti', 'Renato Rodrigues Prado'];

    const activities = [
        'Creche (0 a 3 anos) em parceria com a Secretaria Municipal de Educação',
        'Projetos interdisciplinares e contraturno',
        'Hábitos saudáveis: alimentação, escovação e banho',
        'Livro na mão, Biblioteca em ação',
        'Mexe e remexe a terra (jardinagem)',
        'Esporte e desafios (futebol, judô)',
        'Educando cidadão e oficinas de arte',
        'Grupo operativo de adolescentes',
        'Atendimento às famílias: reuniões, assistência social e psicológica',
    ];

    const income = [
        'Convênios públicos',
        'Campanhas e eventos (noite do espaguete, bazares, festas)',
        'Madrinhas e padrinhos dos educandos',
        'Amigos do Educandário (contribuição mensal voluntária)',
    ];

    return (
        <main className="pt-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            {/* Hero */}
            <section className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full uppercase tracking-wide">
                            <Award size={16} /> Educandário Nossa Senhora Auxiliadora
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight">
                            Preparar hoje, cidadãos para o futuro
                        </h1>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20 text-blue-50">
                            <Award size={14} /> {yearsOfHistory} anos de história (1959–{currentYear})
                        </div>
                        <p className="text-lg text-blue-100 max-w-2xl">
                            Instituição filantrópica que acolhe crianças e adolescentes em jornada ampliada, unindo proteção social, educação de qualidade e vínculos fortes com famílias e comunidade. Atendemos cerca de 260 crianças e adolescentes diariamente.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm">Educação Infantil</span>
                            <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm">Contraturno</span>
                            <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm">Famílias e Comunidade</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-xl p-8 space-y-6 border border-white/30 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Nosso compromisso</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                                <Target className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Objetivo claro: desenvolvimento integral de cada criança.</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                                <BookOpen className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Propostas pedagógicas alinhadas à BNCC e valores humanos.</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                                <Users2 className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Família e comunidade como parceiras permanentes.</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                                <HeartHandshake className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Ética, respeito e afeto em todas as relações.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Missão, Visão, Valores */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-4">
                                <Target size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Missão</h3>
                            <p className="text-slate-600 dark:text-slate-300">Preparar hoje, cidadãos para o futuro.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-4">
                                <Lightbulb size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visão</h3>
                            <p className="text-slate-600 dark:text-slate-300">Proporcionar bem-estar a cada criança/adolescente e suas famílias, com proteção social, espaço seguro e relações de afetividade.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-4">
                                <HeartHandshake size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Valores</h3>
                            <p className="text-slate-600 dark:text-slate-300">Empatia, ética, excelência pedagógica, corresponsabilidade e celebração das conquistas de cada criança.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quem somos e estrutura */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 space-y-10">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Quem somos</h2>
                                <p className="text-slate-600 dark:text-slate-300">Entidade sem fins lucrativos com sede na Rua José Pereira, 780, Vila Bazani, Itapira-SP, atendendo crianças e adolescentes de 0 a 14 anos.</p>
                                <p className="text-slate-600 dark:text-slate-300 mt-3">Fundado em 25 de janeiro de 1959 pelo Padre Mateus Ruiz Domingues, o Educandário nasceu da compaixão e do desejo de oferecer um futuro digno às crianças de Itapira. Hoje, aos 67 anos, mantemos vivo o legado de acolhimento, atendendo cerca de 260 crianças e adolescentes diariamente.</p>
                            </div>
                            <span className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <ShieldCheck size={16} /> Atendimento em jornada ampliada
                            </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-5 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">Horário de funcionamento</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">07h às 17h</p>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <Users2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">Equipe multidisciplinar</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Psicólogas, coordenação pedagógica, assistentes sociais, nutricionista, educadores, administração e cozinha.</p>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">Localização</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Rua José Pereira, 780 – Vila Bazani – Itapira/SP</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Diretoria voluntária</h3>
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                                {board.map((person) => (
                                    <li key={person} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                                        <span>{person}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Conselheiros</h3>
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                                {counselors.map((person) => (
                                    <li key={person} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                                        <span>{person}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Nossas atividades</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Programas que integram cuidado, educação e desenvolvimento socioemocional.</p>
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                                {activities.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fontes de renda</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Sustentamos nossas ações com uma combinação de apoio público e comunitário.</p>
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                                {income.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <HandCoins className="w-4 h-4 text-blue-700 dark:text-blue-400 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Impacto em números</h2>
                                <p className="text-slate-600 dark:text-slate-400">Indicadores que mostram nossa trajetória e dedicação diária.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                                    <Award size={16} /> Filantrópica certificada
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                    <Award size={14} /> {yearsOfHistory} anos de história
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {highlights.map((item) => (
                                <div key={item.label} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-center">
                                    <div className="text-3xl font-black text-blue-800 dark:text-blue-400">{item.value}</div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-white mt-2">{item.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores em ação */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nossos pilares na prática</h2>
                            <p className="text-slate-600 dark:text-slate-400">Como vivenciamos nossos valores no dia a dia do Educandário.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            <HeartHandshake size={16} /> Juntos com a comunidade
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {values.map((value) => (
                            <div key={value.title} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-blue-700 dark:text-blue-400">
                                    {value.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{value.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Localização e contato */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Localização e contato</h2>
                                <p className="text-slate-600 dark:text-slate-400">Estamos prontos para acolher e responder a dúvidas.</p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <MapPin size={16} /> Vila Bazani, Itapira/SP
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Endereço</p>
                                    <p>Rua José Pereira, 780 - Vila Bazani - Itapira/SP</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Telefone</p>
                                    <p>(19) 3863-1972</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Horário</p>
                                    <p>Segunda a sexta, 07h às 17h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
