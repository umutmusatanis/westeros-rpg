import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/characterService';
import StatDisplay from '../components/Character/StatDisplay';
import { PlusCircle, Play, Trash2, Crown } from 'lucide-react';

const CharacterSelectPage = () => {
  const { characters, setCharacters, deleteCharacter } = useCharacterStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await characterService.getCharacters();
      setCharacters(response.data.characters);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu karakteri silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await characterService.deleteCharacter(id);
      deleteCharacter(id);
    } catch (error) {
      console.error('Failed to delete character:', error);
    }
  };

  const handlePlay = (id: string) => {
    navigate(`/game/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-westeros-gold text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-westeros-gold">Karakterlerim</h1>
        <Link to="/characters/create" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Yeni Karakter
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg mb-6">
            Henüz bir karakteriniz yok. Hemen bir karakter oluşturun!
          </p>
          <Link to="/characters/create" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            İlk Karakterinizi Oluşturun
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {characters.map((character) => (
            <div key={character._id} className="card hover:glow-gold transition">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Character Info */}
                <div className="lg:w-1/3">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-westeros-gold flex items-center gap-2">
                        {character.name}
                        <Crown className="w-5 h-5" />
                      </h3>
                      <p className="text-sm text-gray-400">
                        {character.age} yaşında {character.gender === 'male' ? 'Erkek' : 'Kadın'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hane:</span>
                      <span className="font-bold text-westeros-gold">{character.house}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seviye:</span>
                      <span className="text-westeros-gold font-bold">Lv. {character.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">İtibar:</span>
                      <span className="text-green-400">{character.reputationLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bölge:</span>
                      <span>{character.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Meslek:</span>
                      <span>{character.profession}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlay(character._id!)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Oyna
                    </button>
                    <button
                      onClick={() => handleDelete(character._id!)}
                      className="btn-danger px-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Stats Preview */}
                <div className="lg:w-2/3">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">STATLAR</h4>
                  <StatDisplay stats={character.currentStats} size="small" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterSelectPage;
