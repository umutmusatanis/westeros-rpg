import { useEffect } from 'react';
import { useCharacterCreationStore } from '../../store/characterCreationStore';
import { useGameDataStore } from '../../store/gameDataStore';
import { gameDataService } from '../../services/gameDataService';

interface Step2OriginProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2Origin = ({ onNext, onBack }: Step2OriginProps) => {
  const { house, region, profession, setOrigin } = useCharacterCreationStore();
  const { houses, regions, professions, isLoaded, setHouses, setRegions, setProfessions, setIsLoaded } =
    useGameDataStore();

  useEffect(() => {
    if (!isLoaded) {
      loadGameData();
    }
  }, [isLoaded]);

  const loadGameData = async () => {
    try {
      const data = await gameDataService.getAllGameData();
      setHouses(data.houses);
      setRegions(data.regions);
      setProfessions(data.professions);
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (house && region && profession) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-westeros-gold mb-2">
          Adım 2: Köken
        </h2>
        <p className="text-gray-400">Hane, bölge ve mesleğinizi seçin</p>
      </div>

      {/* House Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Hane <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto scroll-container">
          {houses.map((h) => (
            <div
              key={h.name}
              onClick={() => setOrigin({ house: h.name, region: region || h.region, profession: profession || 'Soldier' })}
              className={`card cursor-pointer transition text-sm ${
                house === h.name
                  ? 'border-2 border-westeros-gold glow-gold'
                  : 'hover:border-gray-600'
              }`}
            >
              <h3 className="font-bold mb-1">{h.name}</h3>
              {h.words && <p className="text-xs text-westeros-gold italic mb-2">{h.words}</p>}
              <p className="text-xs text-gray-400 mb-2">{h.description}</p>
              <div className="text-xs text-gray-500">
                Bonus: {Object.entries(h.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Region Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Bölge <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto scroll-container">
          {regions.map((r) => (
            <div
              key={r.name}
              onClick={() => setOrigin({ house: house || 'None', region: r.name, profession: profession || 'Soldier' })}
              className={`card cursor-pointer transition text-sm ${
                region === r.name
                  ? 'border-2 border-westeros-gold glow-gold'
                  : 'hover:border-gray-600'
              }`}
            >
              <h3 className="font-bold mb-1">{r.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{r.description}</p>
              <div className="text-xs text-gray-500">
                Bonus: {Object.entries(r.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profession Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Meslek <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto scroll-container">
          {professions.map((p) => (
            <div
              key={p.name}
              onClick={() => setOrigin({ house: house || 'None', region: region || 'North', profession: p.name })}
              className={`card cursor-pointer transition text-sm ${
                profession === p.name
                  ? 'border-2 border-westeros-gold glow-gold'
                  : 'hover:border-gray-600'
              }`}
            >
              <h3 className="font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{p.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>
                  Bonus: {Object.entries(p.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
                </div>
                <div className="text-westeros-gold">
                  Gelir: {p.weeklyIncome.min}-{p.weeklyIncome.max} {p.weeklyIncome.currency === 'copper' ? 'BA' : p.weeklyIncome.currency === 'silver' ? 'GG' : 'AD'}/hafta
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">
          Geri
        </button>
        <button
          type="submit"
          disabled={!house || !region || !profession}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          İleri
        </button>
      </div>
    </form>
  );
};

export default Step2Origin;
