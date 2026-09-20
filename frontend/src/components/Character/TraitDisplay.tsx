import { Award, Users, Sparkles, Swords } from 'lucide-react';

interface TraitDisplayProps {
  traits: {
    education?: string;
    personality: string[];
    other: string[];
    combat: string[];
  };
}

const TraitDisplay = ({ traits }: TraitDisplayProps) => {
  const traitSections = [
    {
      title: 'Eğitim',
      icon: Award,
      traits: traits.education ? [traits.education] : [],
      color: 'text-westeros-gold',
      bgColor: 'bg-yellow-900/20',
    },
    {
      title: 'Kişilik',
      icon: Users,
      traits: traits.personality,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
    {
      title: 'Diğer',
      icon: Sparkles,
      traits: traits.other,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
    },
    {
      title: 'Savaş',
      icon: Swords,
      traits: traits.combat,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
    },
  ];

  return (
    <div className="space-y-4">
      {traitSections.map(({ title, icon: Icon, traits: sectionTraits, color, bgColor }) => {
        if (sectionTraits.length === 0) return null;

        return (
          <div key={title}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <h3 className={`font-bold ${color}`}>{title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {sectionTraits.map((trait) => (
                <span
                  key={trait}
                  className={`${bgColor} ${color} px-3 py-1 rounded-full text-xs font-medium border border-gray-700`}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TraitDisplay;
