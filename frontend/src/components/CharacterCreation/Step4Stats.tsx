import { useState, useEffect } from 'react';
import { useCharacterCreationStore } from '../../store/characterCreationStore';
import { useGameDataStore } from '../../store/gameDataStore';
import { Stat } from '../../../../shared/types';
import { Swords, Shield, Coins, Eye, BookOpen, Dumbbell, Zap, Heart } from 'lucide-react';

interface Step4StatsProps {
  onNext: () => void;
  onBack: () => void;
}

const Step4Stats = ({ onNext, onBack }: Step4StatsProps) => {
  const { baseStats, setBaseStats, house, region, profession } = useCharacterCreationStore();
  const { houses, regions, professions } = useGameDataStore();

  const [stats, setStats] = useState<Stat>(
    baseStats || {
      diplomacy: 3,
      martial: 3,
      stewardship: 3,
      intrigue: 3,
      learning: 3,
      strength: 3,
      agility: 3,
      endurance: 3,
    }
  );

  const TOTAL_POINTS = 55;
  const MIN_STAT = 3;
  const MAX_STAT = 21;

  const usedPoints = Object.values(stats).reduce((sum, val) => sum + val, 0);
  const remainingPoints = TOTAL_POINTS - usedPoints;

  // Calculate bonuses
  const houseData = houses.find((h) => h.name === house);
  const regionData = regions.find((r) => r.name === region);
  const professionData = professions.find((p) => p.name === profession);

  const getBonusForStat = (statName: keyof Stat): number => {
    let bonus = 0;
    if (houseData?.bonuses[statName]) bonus += houseData.bonuses[statName];
    if (regionData?.bonuses[statName]) bonus += regionData.bonuses[statName];
    if (professionData?.bonuses[statName]) bonus += professionData.bonuses[statName];
    return bonus;
  };

  const handleStatChange = (statName: keyof Stat, value: number) => {
    const newValue = Math.max(MIN_STAT, Math.min(MAX_STAT, value));
    const newStats = { ...stats, [statName]: newValue };
    const newTotal = Object.values(newStats).reduce((sum, val) => sum + val, 0);
    
    if (newTotal <= TOTAL_POINTS) {
      setStats(newStats);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usedPoints === TOTAL_POINTS) {
      setBaseStats(stats);
      onNext();
    }
  };

  const statConfig = [
    {
      key: 'diplomacy' as keyof Stat,
      icon: <Swords className="w-5 h-5" />,
      name: 'Diplomasi',
      description: 'İkna, müzakere, karizmatik iletişim',
      color: 'text-blue-400',
    },
    {
      key: 'martial' as keyof Stat,
      icon: <Shield className="w-5 h-5" />,
      name: 'Askeriye',
      description: 'Savaş taktikleri, ordu komutası',
      color: 'text-red-400',
    },
    {
      key: 'stewardship' as keyof Stat,
      icon: <Coins className="w-5 h-5" />,
      name: 'İdare',
      description: 'Para, yönetim, ticaret becerisi',
      color: 'text-yellow-400',
    },
    {
      key: 'intrigue' as keyof Stat,
      icon: <Eye className="w-5 h-5" />,
      name: 'Entrika',
      description: 'Komplo, casusluk, manipülasyon',
      color: 'text-purple-400',
    },
    {
      key: 'learning' as keyof Stat,
      icon: <BookOpen className="w-5 h-5" />,
      name: 'Bilgelik',
      description: 'Öğrenme, strateji, din ve felsefe',
      color: 'text-cyan-400',
    },
    {
      key: 'strength' as keyof Stat,
      icon: <Dumbbell className="w-5 h-5" />,
      name: 'Güç',
      description: 'Fiziksel güç, vurma gücü',
      color: 'text-orange-400',
    },
    {
      key: 'agility' as keyof Stat,
      icon: <Zap className="w-5 h-5" />,
      name: 'Çeviklik',
      description: 'Hız, denge, refleks',
      color: 'text-green-400',
    },
    {
      key: 'endurance' as keyof Stat,
      icon: <Heart className="w-5 h-5" />,
      name: 'Dayanıklılık',
      description: 'Hasara dayanma, direnç',
      color: 'text-pink-400',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-westeros-gold mb-2">
          Adım 4: Statlar
        </h2>
        <p className="text-gray-400">55 puan dağıtın (Her stat 3-21 arası)</p>
        <div className="mt-3">
          <span className={`text-2xl font-bold ${remainingPoints === 0 ? 'text-green-400' : 'text-westeros-gold'}`}>
            Kalan: {remainingPoints} puan
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {statConfig.map(({ key, icon, name, description, color }) => {
          const baseStat = stats[key];
          const bonus = getBonusForStat(key);
          const total = baseStat + bonus;

          return (
            <div key={key} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className={color}>{icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold">{name}</h3>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-westeros-gold">
                    {total}
                  </div>
                  {bonus > 0 && (
                    <div className="text-xs text-green-400">
                      ({baseStat} + {bonus})
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStatChange(key, baseStat - 1)}
                  disabled={baseStat <= MIN_STAT}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-30"
                >
                  -
                </button>
                <input
                  type="range"
                  value={baseStat}
                  onChange={(e) => handleStatChange(key, parseInt(e.target.value))}
                  min={MIN_STAT}
                  max={MAX_STAT}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleStatChange(key, baseStat + 1)}
                  disabled={baseStat >= MAX_STAT || remainingPoints === 0}
                  className="btn-secondary px-3 py-1 text-sm disabled:opacity-30"
                >
                  +
                </button>
                <span className="text-sm font-mono w-8 text-center">{baseStat}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Summary */}
      <div className="card bg-gray-900 border-westeros-gold">
        <h3 className="font-bold text-westeros-gold mb-3">Bonus Özeti</h3>
        <div className="grid md:grid-cols-3 gap-2 text-sm">
          {house && houseData && (
            <div>
              <span className="text-gray-400">Hane ({house}):</span>
              <div className="text-green-400">
                {Object.entries(houseData.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
              </div>
            </div>
          )}
          {region && regionData && (
            <div>
              <span className="text-gray-400">Bölge ({region}):</span>
              <div className="text-green-400">
                {Object.entries(regionData.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
              </div>
            </div>
          )}
          {profession && professionData && (
            <div>
              <span className="text-gray-400">Meslek ({profession}):</span>
              <div className="text-green-400">
                {Object.entries(professionData.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">
          Geri
        </button>
        <button
          type="submit"
          disabled={remainingPoints !== 0}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {remainingPoints === 0 ? 'İleri' : `${remainingPoints} puan kaldı`}
        </button>
      </div>
    </form>
  );
};

export default Step4Stats;
