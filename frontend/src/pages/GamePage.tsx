import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/characterService';
import CharacterSheet from '../components/Character/CharacterSheet';
import { ArrowLeft } from 'lucide-react';

const GamePage = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const { currentCharacter, setCurrentCharacter } = useCharacterStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (characterId) {
      loadCharacter(characterId);
    }
  }, [characterId]);

  const loadCharacter = async (id: string) => {
    try {
      const response = await characterService.getCharacterById(id);
      setCurrentCharacter(response.data.character);
    } catch (error) {
      console.error('Failed to load character:', error);
      navigate('/characters');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-westeros-gold text-xl">Oyun yükleniyor...</div>
      </div>
    );
  }

  if (!currentCharacter) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400">Karakter bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/characters')}
        className="btn-secondary mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Karakterlere Dön
      </button>

      <h1 className="text-4xl font-bold text-westeros-gold mb-6 text-center">
        {currentCharacter.name}
      </h1>
      
      <CharacterSheet character={currentCharacter} />
      
      <div className="card mt-6 text-center">
        <p className="text-gray-400">
          🚧 Oyun özellikleri (Envanter, Savaş, Ekonomi) yakında eklenecek!
        </p>
      </div>
    </div>
  );
};

export default GamePage;
