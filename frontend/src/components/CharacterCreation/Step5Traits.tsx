import { useEffect, useState } from 'react';
import { useCharacterCreationStore } from '../../store/characterCreationStore';
import { useGameDataStore } from '../../store/gameDataStore';
import { Trait } from '../../../../shared/types';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Step5TraitsProps {
  onComplete: () => void;
  onBack: () => void;
}

const Step5Traits = ({ onComplete, onBack }: Step5TraitsProps) => {
  const {
    baseStats,
    appearance,
    educationTrait,
    personalityTraits,
    otherTraits,
    combatTraits,
    setEducationTrait,
    togglePersonalityTrait,
    toggleOtherTrait,
    toggleCombatTrait,
  } = useCharacterCreationStore();

  const { traits } = useGameDataStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const TOTAL_POINTS = 200;

  // Filter traits by type
  const educationTraits = traits.filter((t) => t.type === 'education');
  const personalityTraitsList = traits.filter((t) => t.type === 'personality');
  const otherTraitsList = traits.filter((t) => t.type === 'other');
  const combatTraitsList = traits.filter((t) => t.type === 'combat');

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;
    
    if (educationTrait) {
      const trait = traits.find((t) => t.name === educationTrait);
      if (trait) total += trait.cost;
    }

    personalityTraits.forEach((traitName) => {
      const trait = traits.find((t) => t.name === traitName);
      if (trait) total += trait.cost;
    });

    otherTraits.forEach((traitName) => {
      const trait = traits.find((t) => t.name === traitName);
      if (trait) total += trait.cost;
    });

    combatTraits.forEach((traitName) => {
      const trait = traits.find((t) => t.name === traitName);
      if (trait) total += trait.cost;
    });

    return total;
  };

  const totalCost = calculateTotalCost();
  const remainingPoints = TOTAL_POINTS - totalCost;

  // Check if trait can be selected
  const canSelectTrait = (trait: Trait): { can: boolean; reason?: string } => {
    // Check cost
    if (trait.cost > 0 && remainingPoints < trait.cost) {
      return { can: false, reason: 'Yetersiz puan' };
    }

    // Check stat requirements
    if (trait.requirements?.stat && trait.requirements?.minValue && baseStats) {
      const statValue = baseStats[trait.requirements.stat];
      if (statValue < trait.requirements.minValue) {
        return {
          can: false,
          reason: `${trait.requirements.stat} >= ${trait.requirements.minValue} gerekli`,
        };
      }
    }

    // Check height requirement
    if (trait.requirements?.height && appearance) {
      if (appearance.height < trait.requirements.height) {
        return {
          can: false,
          reason: `Boy >= ${trait.requirements.height}cm gerekli`,
        };
      }
    }

    // Check exclusions
    if (trait.requirements?.excludes) {
      const allSelectedTraits = [
        educationTrait,
        ...personalityTraits,
        ...otherTraits,
        ...combatTraits,
      ].filter(Boolean);

      const conflicts = trait.requirements.excludes.filter((exclude) =>
        allSelectedTraits.includes(exclude as any)
      );

      if (conflicts.length > 0) {
        return {
          can: false,
          reason: `Çakışma: ${conflicts.join(', ')}`,
        };
      }
    }

    return { can: true };
  };

  // Validate before submission
  const validate = (): boolean => {
    const errors: string[] = [];

    if (!educationTrait) {
      errors.push('Bir eğitim özelliği seçmelisiniz');
    }

    if (personalityTraits.length < 2) {
      errors.push('En az 2 kişilik özelliği seçmelisiniz');
    }

    if (totalCost > TOTAL_POINTS) {
      errors.push('Toplam maliyet 200 puanı aşamaz');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete();
    }
  };

  const isTraitSelected = (traitName: string): boolean => {
    return (
      educationTrait === traitName ||
      personalityTraits.includes(traitName as any) ||
      otherTraits.includes(traitName as any) ||
      combatTraits.includes(traitName as any)
    );
  };

  const TraitCard = ({ trait, onToggle, isSelected }: { trait: Trait; onToggle: () => void; isSelected: boolean }) => {
    const validation = canSelectTrait(trait);
    const canSelect = validation.can || isSelected;

    return (
      <div
        onClick={() => canSelect && onToggle()}
        className={`card cursor-pointer transition text-sm ${
          isSelected
            ? 'border-2 border-westeros-gold glow-gold'
            : canSelect
            ? 'hover:border-gray-600'
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold flex-1">{trait.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                trait.cost > 0 ? 'text-westeros-gold' : 'text-red-400'
              }`}
            >
              {trait.cost > 0 ? '+' : ''}
              {trait.cost}
            </span>
            {isSelected && <CheckCircle className="w-5 h-5 text-green-400" />}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mb-2">{trait.description}</p>
        
        {trait.bonuses && Object.keys(trait.bonuses).length > 0 && (
          <div className="text-xs text-green-400 mb-1">
            Bonus: {Object.entries(trait.bonuses).map(([stat, val]) => `${stat} +${val}`).join(', ')}
          </div>
        )}

        {!validation.can && !isSelected && (
          <div className="text-xs text-red-400 flex items-center gap-1 mt-2">
            <XCircle className="w-3 h-3" />
            {validation.reason}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-westeros-gold mb-2">
          Adım 5: Özellikler
        </h2>
        <p className="text-gray-400">200 puan ile özelliklerinizi seçin</p>
        <div className="mt-3">
          <span
            className={`text-2xl font-bold ${
              remainingPoints >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            Kalan: {remainingPoints} puan
          </span>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-900/50 border border-red-500 rounded p-4">
          {validationErrors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Education Traits */}
      <div>
        <h3 className="text-lg font-bold text-westeros-gold mb-3">
          Eğitim Özelliği (1 adet seçin) *
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {educationTraits.map((trait) => (
            <TraitCard
              key={trait.name}
              trait={trait}
              onToggle={() => setEducationTrait(educationTrait === trait.name ? null : (trait.name as any))}
              isSelected={educationTrait === trait.name}
            />
          ))}
        </div>
      </div>

      {/* Personality Traits */}
      <div>
        <h3 className="text-lg font-bold text-westeros-gold mb-3">
          Kişilik Özellikleri (En az 2 adet seçin) *
        </h3>
        <div className="text-sm text-gray-400 mb-2">
          Seçili: {personalityTraits.length} adet
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto scroll-container">
          {personalityTraitsList.map((trait) => (
            <TraitCard
              key={trait.name}
              trait={trait}
              onToggle={() => togglePersonalityTrait(trait.name as any)}
              isSelected={personalityTraits.includes(trait.name as any)}
            />
          ))}
        </div>
      </div>

      {/* Other Traits */}
      <div>
        <h3 className="text-lg font-bold text-westeros-gold mb-3">
          Diğer Özellikler (İsteğe Bağlı)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto scroll-container">
          {otherTraitsList.map((trait) => (
            <TraitCard
              key={trait.name}
              trait={trait}
              onToggle={() => toggleOtherTrait(trait.name as any)}
              isSelected={otherTraits.includes(trait.name as any)}
            />
          ))}
        </div>
      </div>

      {/* Combat Traits */}
      {baseStats && baseStats.martial >= 13 && (
        <div>
          <h3 className="text-lg font-bold text-westeros-gold mb-3">
            Savaş Özellikleri (Askeriye ≥13 gerekli)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {combatTraitsList.map((trait) => (
              <TraitCard
                key={trait.name}
                trait={trait}
                onToggle={() => toggleCombatTrait(trait.name as any)}
                isSelected={combatTraits.includes(trait.name as any)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">
          Geri
        </button>
        <button
          type="submit"
          disabled={remainingPoints < 0}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Karakteri Oluştur
        </button>
      </div>
    </form>
  );
};

export default Step5Traits;
