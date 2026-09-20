import { Character } from '../../../../shared/types';
import StatDisplay from './StatDisplay';
import TraitDisplay from './TraitDisplay';
import { User, MapPin, Briefcase, Calendar, Crown, TrendingUp, Coins } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
}

const CharacterSheet = ({ character }: CharacterSheetProps) => {
  const getReputationColor = (level: string) => {
    switch (level) {
      case 'Legendary':
        return 'text-purple-400';
      case 'Lord':
        return 'text-blue-400';
      case 'Ser':
        return 'text-green-400';
      case 'Known':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-westeros-gold mb-2">
              {character.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {character.age} yaşında {character.gender === 'male' ? 'Erkek' : 'Kadın'}
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                {character.house}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-westeros-gold">Lv. {character.level}</div>
            <div className={`text-sm font-medium ${getReputationColor(character.reputationLevel)}`}>
              {character.reputationLevel}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-400">Bölge</div>
              <div className="font-medium">{character.region}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-400">Meslek</div>
              <div className="font-medium">{character.profession}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-400">Dönem</div>
              <div className="font-medium">
                {character.period === 'RobertsRebellion' ? "Robert'in İsyanı" : 'Taht Oyunları'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-westeros-gold" />
          <h2 className="text-xl font-bold text-westeros-gold">Statlar</h2>
        </div>
        <StatDisplay stats={character.currentStats} size="medium" />
      </div>

      {/* Vital Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Can</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${(character.health / character.maxHealth) * 100}%`,
                }}
              />
            </div>
            <div className="text-lg font-bold text-green-400">
              {character.health}/{character.maxHealth}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Deneyim</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-4">
              <div
                className="bg-westeros-gold h-4 rounded-full transition-all"
                style={{
                  width: `${(character.experience % 100)}%`,
                }}
              />
            </div>
            <div className="text-lg font-bold text-westeros-gold">
              {character.experience} XP
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
            <Coins className="w-4 h-4" />
            Para
          </div>
          <div className="text-lg font-bold space-x-2">
            {character.currency.gold > 0 && (
              <span className="text-yellow-400">{character.currency.gold} AD</span>
            )}
            {character.currency.silver > 0 && (
              <span className="text-gray-300">{character.currency.silver} GG</span>
            )}
            <span className="text-orange-400">{character.currency.copper} BA</span>
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className="card">
        <h2 className="text-xl font-bold text-westeros-gold mb-4">Özellikler</h2>
        <TraitDisplay traits={character.traits} />
      </div>

      {/* Appearance */}
      <div className="card">
        <h2 className="text-xl font-bold text-westeros-gold mb-4">Görünüş</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Boy:</span>{' '}
            <span className="font-medium">{character.appearance.height} cm</span>
          </div>
          <div>
            <span className="text-gray-400">Kilo:</span>{' '}
            <span className="font-medium">{character.appearance.weight} kg</span>
          </div>
          <div>
            <span className="text-gray-400">Saç:</span>{' '}
            <span className="font-medium">
              {character.appearance.hairColor}, {character.appearance.hairLength}, {character.appearance.hairStyle}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Göz:</span>{' '}
            <span className="font-medium">{character.appearance.eyeColor}</span>
          </div>
          <div>
            <span className="text-gray-400">Ten:</span>{' '}
            <span className="font-medium">{character.appearance.skinTone}</span>
          </div>
          <div>
            <span className="text-gray-400">Yüz:</span>{' '}
            <span className="font-medium">{character.appearance.faceType}</span>
          </div>
          {character.appearance.beard && (
            <div>
              <span className="text-gray-400">Sakal:</span>{' '}
              <span className="font-medium">{character.appearance.beard}</span>
            </div>
          )}
          <div>
            <span className="text-gray-400">Beden:</span>{' '}
            <span className="font-medium">{character.appearance.bodyType}</span>
          </div>
        </div>
      </div>

      {/* Troops */}
      {character.troops && character.troops.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-westeros-gold mb-4">Birlikler</h2>
          <div className="space-y-2">
            {character.troops.map((troop, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                <div>
                  <div className="font-medium">{troop.type}</div>
                  <div className="text-xs text-gray-400">Tier {troop.tier}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-westeros-gold">{troop.count} asker</div>
                  <div className="text-xs text-gray-400">Güç: {troop.power * troop.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;
