import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Heart, Clock } from 'lucide-react';
import DonationModal from '@/components/DonationModel/DonationModal';
import imgLogo from '@/assets/logo-educandario.jpeg';

const Footer: React.FC = () => {
    const [donationOpen, setDonationOpen] = useState(false);

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Coluna 1: Sobre */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                            <img 
                                src={imgLogo} 
                                alt="Logo Educandário N. S. Aparecida"
                                className="w-full h-full object-contain rounded-full shadow-sm"
                            />
                        </div>
                <span className="text-xl font-bold text-white">Educandário <span className="text-orange-500">NSA</span></span>
                </div>
                <p className="text-sm leading-relaxed">
                Transformando o futuro de crianças e adolescentes em Itapira através da educação, cultura e assistência social há mais de 60 anos.
                </p>
                <div className="flex gap-4">
                <a href="https://www.facebook.com/aparecida.ensa.1" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 transition-colors text-white" aria-label="Facebook do Educandário">
                    <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/educandarionsa" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors text-white" aria-label="Instagram do Educandário">
                    <Instagram size={20} />
                </a>
                </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Mapa do Site</h4>
                <ul className="space-y-4">
                    <li><Link to="/" className="hover:text-orange-500 transition-colors">Início</Link></li>
                    <li><Link to="/sobre" className="hover:text-orange-500 transition-colors">Sobre</Link></li>
                    <li><Link to="/historia" className="hover:text-orange-500 transition-colors">Nossa História</Link></li>
                    <li><Link to="/regimento-interno" className="hover:text-orange-500 transition-colors">Regimento Interno</Link></li>
                    <li><Link to="/#projetos" className="hover:text-orange-500 transition-colors">Nossos Projetos</Link></li>
                    <li><Link to="/transparencia" className="hover:text-orange-500 transition-colors">Transparência</Link></li>
                    <li><Link to="/contato" className="hover:text-orange-500 transition-colors">Contato</Link></li>
                </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contato</h4>
                <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin className="text-orange-500 shrink-0" size={18} />
                    <span>Rua José Pereira, 780 - Vila Bazani<br />Itapira - SP</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="text-orange-500 shrink-0" size={18} />
                    <span>(19) 3863-1972</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="text-orange-500 shrink-0" size={18} />
                    <span>contato@educandarionsa.com.br</span>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="text-orange-500 shrink-0" size={18} />
                    <span>Seg a sex, 07h às 17h</span>
                </li>
                </ul>
            </div>

            {/* Coluna 4: Doação Rápida */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Heart size={18} className="text-orange-500" fill="currentColor" />
                Faça a diferença
                </h4>
                <p className="text-xs mb-4">Sua doação ajuda a manter nossas oficinas e alimentação das crianças.</p>
                <button
                    className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase"
                    onClick={() => setDonationOpen(true)}
                    aria-haspopup="dialog"
                >
                Doar via PIX
                </button>
            </div>
            </div>

            {/* Rodapé Final */}
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} Educandário Nossa Senhora Aparecida. Todos os direitos reservados.</p>
            <p>Desenvolvido com ❤️ em React + Vite</p>
            </div>
        </div>
        <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
        </footer>
    );
};

export default Footer;