import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, ChevronDown, History, Scale, Info, Moon, Sun } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DonationModal from '@/components/DonationModel/DonationModal';
import imgLogo from '@/assets/logo-educandario.jpeg';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
    const [isInstitutionOpen, setIsInstitutionOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });
    const [fontSize, setFontSize] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('fontSize');
            return saved ? parseInt(saved, 10) : 100;
        }
        return 100;
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Efeito para aplicar/remover classe dark no HTML
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Efeito para aplicar tamanho da fonte
    useEffect(() => {
        const root = window.document.documentElement;
        root.style.fontSize = `${fontSize}%`;
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150));
    const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 80));

    const institutionActive = ['/sobre', '/historia', '/regimento-interno'].some((path) =>
        location.pathname.startsWith(path)
    );

    const institutionLinks = [
        { name: 'Sobre Nós', href: '/sobre', icon: <Info size={18} /> },
        { name: 'Nossa História', href: '/historia', icon: <History size={18} /> },
        { name: 'Regimento Interno', href: '/regimento-interno', icon: <Scale size={18} /> },
    ];

    // Lógica para lidar com links de âncora (#) e navegação entre páginas
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            setIsOpen(false);
            setIsInstitutionOpen(false);

            if (location.pathname !== '/') {
                navigate(`/${href}`); // Navega para a home com a âncora
            } else {
                const element = document.querySelector(href);
                element?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            setIsOpen(false);
            setIsInstitutionOpen(false);
        }
    };

    const isActiveLink = (href: string) => {
        if (href.startsWith('#')) {
            return location.pathname === '/' && location.hash === href;
        }
        const [path, hash] = href.split('#');
        const samePath = location.pathname === path;
        if (hash) return samePath && location.hash === `#${hash}`;
        return samePath;
    };

    useEffect(() => {
        if (!location.hash) return;
        const target = document.querySelector(location.hash);
        if (!target) return;
        const timeoutId = window.setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return () => window.clearTimeout(timeoutId);
    }, [location]);

    return (
        <nav className="fixed w-full z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md shadow-sm dark:shadow-slate-800/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* Logo Container */}
                    <Link to="/" className="shrink-0 flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                            <img 
                                src={imgLogo} 
                                alt="Logo Educandário N. S. Aparecida"
                                className="w-full h-full object-contain rounded-full shadow-sm"
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                                Educandário
                            </span>
                            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">
                                N. S. Aparecida
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex space-x-6 items-center">
                            <Link 
                                to="/" 
                                onClick={(e) => handleNavClick(e, '/')}
                                className={`text-sm uppercase tracking-wide transition-all font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActiveLink('/') ? 'text-blue-700 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
                            >
                                Início
                            </Link>

                            {/* Dropdown A Instituição */}
                            <div className="relative"
                                onMouseEnter={() => setIsInstitutionOpen(true)}
                                onMouseLeave={() => setIsInstitutionOpen(false)}
                            >
                                <button
                                    type="button"
                                    aria-haspopup="true"
                                    aria-expanded={isInstitutionOpen}
                                    aria-controls="institution-menu"
                                    onClick={() => setIsInstitutionOpen((prev) => !prev)}
                                    className={`inline-flex items-center gap-1 text-sm uppercase tracking-wide transition-all pb-1 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                        institutionActive
                                        ? 'text-blue-700 dark:text-blue-400 font-extrabold border-blue-700 dark:border-blue-400'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 border-transparent font-semibold'
                                    }`}
                                >
                                    A Instituição
                                    <ChevronDown size={16} className={`${isInstitutionOpen ? 'rotate-180' : ''} transition-transform`} />
                                </button>
                                
                                {isInstitutionOpen && (
                                    <div id="institution-menu" className="absolute left-0 mt-0 w-56 pt-2 z-50">
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2">
                                            {institutionLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    to={link.href}
                                                    onClick={(e) => handleNavClick(e, link.href)}
                                                    className="block px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* LINK PROJETOS REINTEGRADO */}
                            <Link 
                                to="/#projetos"
                                onClick={(e) => handleNavClick(e, '#projetos')}
                                className={`text-sm uppercase tracking-wide transition-all font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActiveLink('#projetos') ? 'text-blue-700 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
                            >
                                Projetos
                            </Link>

                            <Link 
                                to="/transparencia" 
                                onClick={(e) => handleNavClick(e, '/transparencia')}
                                className={`text-sm uppercase tracking-wide transition-all font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActiveLink('/transparencia') ? 'text-blue-700 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
                            >
                                Transparência
                            </Link>

                            <Link 
                                to="/contato" 
                                onClick={(e) => handleNavClick(e, '/contato')}
                                className={`text-sm uppercase tracking-wide transition-all font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActiveLink('/contato') ? 'text-blue-700 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'}`}
                            >
                                Contato
                            </Link>
                        </div>

                        {/* Controles de Acessibilidade */}
                        <div className="flex items-center gap-1">
                            {/* Botões de Tamanho de Fonte */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                                <button
                                    onClick={decreaseFontSize}
                                    disabled={fontSize <= 80}
                                    className="px-2 py-1 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-l-full"
                                    aria-label="Diminuir tamanho do texto"
                                    title="Diminuir tamanho do texto"
                                >
                                    A-
                                </button>
                                <span className="text-xs text-slate-500 dark:text-slate-400 px-1 select-none" aria-live="polite" aria-atomic="true">{fontSize}%</span>
                                <button
                                    onClick={increaseFontSize}
                                    disabled={fontSize >= 150}
                                    className="px-2 py-1 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-r-full"
                                    aria-label="Aumentar tamanho do texto"
                                    title="Aumentar tamanho do texto"
                                >
                                    A+
                                </button>
                            </div>

                            {/* Botão Dark Mode */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                aria-label="Alternar entre modo claro e escuro"
                                title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                        
                        <button onClick={() => setIsDonationOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                            <Heart size={18} fill="currentColor" /> DOE AGORA
                        </button>
                    </div>

                    {/* Botão Mobile */}
                    <div className="lg:hidden flex items-center gap-1">
                        {/* Botões de Fonte Mobile */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5">
                            <button
                                onClick={decreaseFontSize}
                                disabled={fontSize <= 80}
                                className="px-1.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
                                aria-label="Diminuir tamanho do texto"
                            >
                                A-
                            </button>
                            <button
                                onClick={increaseFontSize}
                                disabled={fontSize >= 150}
                                className="px-1.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
                                aria-label="Aumentar tamanho do texto"
                            >
                                A+
                            </button>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-colors"
                            aria-label="Alternar entre modo claro e escuro"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-600 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label="Abrir menu"
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div id="mobile-menu" className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute w-full shadow-2xl">
                    <div className="px-4 pt-4 pb-8 space-y-2">
                        <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="block px-4 py-3 text-lg font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800">INÍCIO</Link>
                        
                        {/* Accordion A Instituição */}
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setIsInstitutionOpen(!isInstitutionOpen)}
                                className="flex items-center justify-between w-full px-4 py-3 text-lg font-black text-blue-600 dark:text-blue-400 border-b border-slate-50 dark:border-slate-800"
                            >
                                A INSTITUIÇÃO
                                <ChevronDown className={`transition-transform ${isInstitutionOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${isInstitutionOpen ? 'max-h-64 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                                {institutionLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="flex items-center gap-3 px-8 py-3 text-sm font-bold text-slate-600 dark:text-slate-300"
                                    >
                                        <span className="text-blue-400 dark:text-blue-300">{link.icon}</span>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/#projetos" onClick={(e) => handleNavClick(e, '#projetos')} className="block px-4 py-3 text-lg font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800">PROJETOS</Link>
                        <Link to="/transparencia" onClick={(e) => handleNavClick(e, '/transparencia')} className="block px-4 py-3 text-lg font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800">TRANSPARÊNCIA</Link>
                        <Link to="/contato" onClick={(e) => handleNavClick(e, '/contato')} className="block px-4 py-3 text-lg font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800">CONTATO</Link>
                        
                        <div className="pt-6">
                            <button onClick={() => { setIsDonationOpen(true); setIsOpen(false); }} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black flex justify-center items-center gap-2 shadow-xl shadow-orange-200">
                                <Heart size={20} fill="currentColor" /> DOE AGORA
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DonationModal open={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </nav>
    );
};

export default Navbar;