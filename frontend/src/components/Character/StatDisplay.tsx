import { Stat } from '../../../../shared/types';
import { Swords, Shield, Coins, Eye, BookOpen, Dumbbell, Zap, Heart } from 'lucide-react';

interface StatDisplayProps {
  stats: Stat;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StatDisplay = ({ stats, showLabels = true, size = 'medium' }: StatDisplayProps) => {
  const statConfig = [
    {
      key: 'diplomacy' as keyof Stat,
      icon: Swords,
      name: 'Diplomasi',
      shortName: 'DIP',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
    },
    {
      key: 'martial' as keyof Stat,
      icon: Shield,
      name: 'Askeriye',
      shortName: 'MAR',
      color: 'text-red-400',
      bgColor: 'bg-red-900/30',
    },
    {
      key: 'stewardship' as keyof Stat,
      icon: Coins,
      name: 'İdare',
      shortName: 'STE',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
    },
    {
      key: 'intrigue' as keyof Stat,
      icon: Eye,
      name: 'Entrika',
      shortName: 'INT',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30',
    },
    {
      key: 'learning' as keyof Stat,
      icon: BookOpen,
      name: 'Bilgelik',
      shortName: 'LEA',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/30',
    },
    {
      key: 'strength' as keyof Stat,
      icon: Dumbbell,
      name: 'Güç',
      shortName: 'STR',
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/30',
    },
    {
      key: 'agility' as keyof Stat,
      icon: Zap,
      name: 'Çeviklik',
      shortName: 'AGI',
      color: 'text-green-400',
      bgColor: 'bg-green-900/30',
    },
    {
      key: 'endurance' as keyof Stat,
      icon: Heart,
      name: 'Dayanıklılık',
      shortName: 'END',
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/30',
    },
  ];

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'text-xs',
          icon: 'w-3 h-3',
          value: 'text-sm',
          padding: 'p-2',
        };
      case 'large':
        return {
          container: 'text-base',
          icon: 'w-6 h-6',
          value: 'text-2xl',
          padding: 'p-4',
        };
      default:
        return {
          container: 'text-sm',
          icon: 'w-4 h-4',
          value: 'text-xl',
          padding: 'p-3',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${sizeClasses.container}`}>
      {statConfig.map(({ key, icon: Icon, name, shortName, color, bgColor }) => (
        <div
          key={key}
          className={`${bgColor} ${sizeClasses.padding} rounded-lg flex items-center gap-2 border border-gray-700 hover:border-gray-600 transition`}
        >
          <Icon className={`${color} ${sizeClasses.icon}`} />
          <div className="flex-1">
            {showLabels && (
              <div className="text-gray-400 font-medium">
                {size === 'small' ? shortName : name}
              </div>
            )}
            <div className={`${color} font-bold ${sizeClasses.value}`}>
              {stats[key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatDisplay;
