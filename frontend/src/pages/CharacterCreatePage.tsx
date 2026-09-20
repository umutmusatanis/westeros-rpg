import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterCreationStore } from '../store/characterCreationStore';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/characterService';
import Step1Identity from '../components/CharacterCreation/Step1Identity';
import Step2Origin from '../components/CharacterCreation/Step2Origin';
import Step3Appearance from '../components/CharacterCreation/Step3Appearance';
import Step4Stats from '../components/CharacterCreation/Step4Stats';
import Step5Traits from '../components/CharacterCreation/Step5Traits';

const CharacterCreatePage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const characterCreationData = useCharacterCreationStore();
  const { addCharacter } = useCharacterStore();

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Build character data
      const characterData = {
        name: characterCreationData.name,
        age: characterCreationData.age,
        gender: characterCreationData.gender,
        birthStatus: characterCreationData.birthStatus,
        house: characterCreationData.house!,
        region: characterCreationData.region!,
        profession: characterCreationData.profession!,
        appearance: characterCreationData.appearance!,
        baseStats: characterCreationData.baseStats!,
        currentStats: characterCreationData.baseStats!, // Will be calculated by backend
        traits: {
          education: characterCreationData.educationTrait,
          personality: characterCreationData.personalityTraits,
          other: characterCreationData.otherTraits,
          combat: characterCreationData.combatTraits,
        },
        period: characterCreationData.period,
        level: 1,
        experience: 0,
        currency: { gold: 0, silver: 0, copper: 50 },
        reputation: 0,
        reputationLevel: 'Common' as const,
        health: 100,
        maxHealth: 100,
        location: {
          x: 0,
          y: 0,
          region: characterCreationData.region!,
        },
      };

      const response = await characterService.createCharacter(characterData);
      addCharacter(response.data.character);
      
      // Reset creation store
      characterCreationData.reset();
      
      // Navigate to characters
      navigate('/characters');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Karakter oluşturulamadı');
      console.error('Character creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-westeros-gold text-xl">Karakter oluşturuluyor...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-westeros-gold mb-6 text-center">
          Karakter Oluştur
        </h1>

        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 h-2 mx-1 rounded ${
                stepNum <= step ? 'bg-westeros-gold' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-5 gap-2 mb-8 text-center text-sm">
          <div className={step === 1 ? 'text-westeros-gold font-bold' : 'text-gray-400'}>
            Kimlik
          </div>
          <div className={step === 2 ? 'text-westeros-gold font-bold' : 'text-gray-400'}>
            Köken
          </div>
          <div className={step === 3 ? 'text-westeros-gold font-bold' : 'text-gray-400'}>
            Görünüş
          </div>
          <div className={step === 4 ? 'text-westeros-gold font-bold' : 'text-gray-400'}>
            Statlar
          </div>
          <div className={step === 5 ? 'text-westeros-gold font-bold' : 'text-gray-400'}>
            Özellikler
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="min-h-96">
          {step === 1 && <Step1Identity onNext={() => setStep(2)} />}
          {step === 2 && <Step2Origin onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3Appearance onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4Stats onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <Step5Traits onComplete={handleComplete} onBack={() => setStep(4)} />}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreatePage;
