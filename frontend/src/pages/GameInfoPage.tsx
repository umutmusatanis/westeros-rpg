import { useState, useEffect } from 'react';
import { useGameDataStore } from '../store/gameDataStore';
import { gameDataService } from '../services/gameDataService';
import { Crown, MapPin, Briefcase, Award } from 'lucide-react';

const GameInfoPage = () => {
  const { houses, regions, professions, traits, isLoaded, setHouses, setRegions, setProfessions, setTraits, setIsLoaded } =
    useGameDataStore();
  const [activeTab, setActiveTab] = useState<'houses' | 'regions' | 'professions' | 'traits'>('houses');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      loadGameData();
    } else {
      setLoading(false);
    }
  }, [isLoaded]);

  const loadGameData = async () => {
    try {
      const data = await gameDataService.getAllGameData();
      setHouses(data.houses);
      setRegions(data.regions);
      setProfessions(data.professions);
      setTraits(data.traits);
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load game data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-westeros-gold text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'houses', name: 'Haneler', icon: Crown, count: houses.length },
    { id: 'regions', name: 'Bölgeler', icon: MapPin, count: regions.length },
    { id: 'professions', name: 'Meslekler', icon: Briefcase, count: professions.length },
    { id: 'traits', name: 'Özellikler', icon: Award, count: traits.length },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-westeros-gold mb-6 text-center">
        Westeros RPG - Oyun Rehberi
      </h1>

      {/* Tab Navigation */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-2">
          {tabs.map(({ id, name, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                activeTab === id
                  ? 'bg-westeros-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
              <span className="text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'houses' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div key={house.name} className="card hover:glow-gold transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-westeros-gold">{house.name}</h3>
                <Crown className="w-6 h-6 text-westeros-gold" />
              </div>
              
              {house.words && (
                <p className="text-sm italic text-gray-400 mb-3 border-l-2 border-westeros-gold pl-3">
                  "{house.words}"
                </p>
              )}
              
              <p className="text-sm text-gray-300 mb-3">{house.description}</p>
              
              <div className="border-t border-gray-700 pt-3">
                <div className="text-xs text-gray-400 mb-1">Bonuslar:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(house.bonuses).map(([stat, value]) => (
                    <span key={stat} className="stat-badge text-xs">
                      {stat} +{value}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ana Bölge: {house.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'regions' && (
        <div className="grid md:grid-cols-2 gap-6">
          {regions.map((region) => (
            <div key={region.name} className="card hover:glow-gold transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-westeros-gold">{region.name}</h3>
                <MapPin className="w-6 h-6 text-westeros-gold" />
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{region.description}</p>
              
              <div className="border-t border-gray-700 pt-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Kültür:</div>
                    <div className="font-medium">{region.culture}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Bonuslar:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(region.bonuses).map(([stat, value]) => (
                        <span key={stat} className="stat-badge text-xs">
                          {stat} +{value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'professions' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professions.map((profession) => (
            <div key={profession.name} className="card hover:glow-gold transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-westeros-gold">{profession.name}</h3>
                <Briefcase className="w-6 h-6 text-westeros-gold" />
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{profession.description}</p>
              
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Bonuslar:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profession.bonuses).map(([stat, value]) => (
                      <span key={stat} className="stat-badge text-xs">
                        {stat} +{value}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Haftalık Gelir:</div>
                  <div className="text-sm font-bold text-green-400">
                    {profession.weeklyIncome.min}-{profession.weeklyIncome.max}{' '}
                    {profession.weeklyIncome.currency === 'copper' ? 'Bakır Akçe' : 
                     profession.weeklyIncome.currency === 'silver' ? 'Gümüş Geyik' : 'Altın Dragon'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'traits' && (
        <div>
          {/* Education Traits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-westeros-gold mb-4">
              Eğitim Özellikleri
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {traits.filter(t => t.type === 'education').map((trait) => (
                <div key={trait.name} className="card hover:border-westeros-gold transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{trait.name}</h3>
                    <span className="text-westeros-gold font-bold">+{trait.cost}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{trait.description}</p>
                  {trait.bonuses && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(trait.bonuses).map(([stat, value]) => (
                        <span key={stat} className="stat-badge text-xs">
                          {stat} +{value}
                        </span>
                      ))}
                    </div>
                  )}
                  {trait.requirements && (
                    <div className="text-xs text-gray-500 mt-2">
                      Gereksinim: {trait.requirements.stat} ≥ {trait.requirements.minValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-westeros-gold mb-4">
              Kişilik Özellikleri
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {traits.filter(t => t.type === 'personality').map((trait) => (
                <div key={trait.name} className="card text-sm hover:border-purple-400 transition">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm">{trait.name}</h3>
                    <span className={`font-bold text-sm ${trait.cost > 0 ? 'text-westeros-gold' : 'text-red-400'}`}>
                      {trait.cost > 0 ? '+' : ''}{trait.cost}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Traits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-westeros-gold mb-4">
              Diğer Özellikler
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {traits.filter(t => t.type === 'other').map((trait) => (
                <div key={trait.name} className="card hover:border-cyan-400 transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{trait.name}</h3>
                    <span className={`font-bold ${trait.cost > 0 ? 'text-westeros-gold' : 'text-red-400'}`}>
                      {trait.cost > 0 ? '+' : ''}{trait.cost}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{trait.description}</p>
                  {trait.bonuses && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {Object.entries(trait.bonuses).map(([stat, value]) => (
                        <span key={stat} className="stat-badge text-xs">
                          {stat} +{value}
                        </span>
                      ))}
                    </div>
                  )}
                  {trait.requirements && (
                    <div className="text-xs text-gray-500">
                      {trait.requirements.height && `Boy ≥ ${trait.requirements.height}cm`}
                      {trait.requirements.stat && ` | ${trait.requirements.stat} ≥ ${trait.requirements.minValue}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Combat Traits */}
          <div>
            <h2 className="text-2xl font-bold text-westeros-gold mb-4">
              Savaş Özellikleri
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              * Askeriye statı en az 13 olmalıdır
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {traits.filter(t => t.type === 'combat').map((trait) => (
                <div key={trait.name} className="card hover:border-red-400 transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{trait.name}</h3>
                    <span className="text-westeros-gold font-bold">+{trait.cost}</span>
                  </div>
                  <p className="text-xs text-gray-400">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameInfoPage;
