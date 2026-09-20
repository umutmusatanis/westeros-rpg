import { Link } from 'react-router-dom';
import { Sword, Shield, Crown, Users, BookOpen } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-6xl font-bold text-westeros-gold mb-4 text-shadow">
          Westeros'a Hoş Geldiniz
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Game of Thrones evreninde geçen, açık dünya RPG deneyimi.
          Kendi hikayeni yaz, tahtın için savaş.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Oyuna Başla
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-3">
            Giriş Yap
          </Link>
          <Link to="/info" className="btn-secondary text-lg px-8 py-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Oyun Rehberi
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <FeatureCard
          icon={<Crown className="w-12 h-12 text-westeros-gold" />}
          title="Büyük Haneler"
          description="Stark, Lannister, Targaryen ve daha fazlası. Hanenizi seçin, soyunuzu onurlandırın."
        />
        <FeatureCard
          icon={<Sword className="w-12 h-12 text-westeros-gold" />}
          title="Derin Savaş Sistemi"
          description="Düello ve ordu savaşları. Taktik ve şansın birleşimi."
        />
        <FeatureCard
          icon={<Shield className="w-12 h-12 text-westeros-gold" />}
          title="Karakter Gelişimi"
          description="8 ana stat, 200+ özellik. Benzersiz karakterinizi yaratın."
        />
        <FeatureCard
          icon={<Users className="w-12 h-12 text-westeros-gold" />}
          title="Ordu Yönetimi"
          description="6 tier birlik sistemi. Ordunuzu toplayın, savaşa hazırlayın."
        />
      </section>

      {/* Periods */}
      <section className="py-12">
        <h2 className="text-4xl font-bold text-center text-westeros-gold mb-8">
          İki Farklı Dönem
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card hover:glow-gold transition">
            <h3 className="text-2xl font-bold text-westeros-gold mb-3">
              Robert'in İsyanı
            </h3>
            <p className="text-gray-300 mb-4">
              Aerys II Targaryen tahtta. İsyan başladı. Rhaegar ve Lyanna'nın sırrı ortaya çıkacak.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Targaryen hakimiyeti</li>
              <li>• Aktif savaş durumu</li>
              <li>• Trident Savaşı yaklaşıyor</li>
            </ul>
          </div>
          <div className="card hover:glow-gold transition">
            <h3 className="text-2xl font-bold text-westeros-gold mb-3">
              Taht Oyunları
            </h3>
            <p className="text-gray-300 mb-4">
              Robert Baratheon kral. Jon Arryn öldü. Ned Stark Hand oluyor. Komplolar başlıyor.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Görece barış dönemi</li>
              <li>• Siyasi entrikalar</li>
              <li>• King's Landing'de güç mücadelesi</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="text-center py-12">
        <blockquote className="text-2xl italic text-gray-400 max-w-3xl mx-auto">
          "Taht Oyunları'nda ya kazanırsın, ya ölürsün."
          <footer className="text-westeros-gold mt-2">- Cersei Lannister</footer>
        </blockquote>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="card text-center hover:glow-gold transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-westeros-gold">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default HomePage;
