import { useCharacterCreationStore } from '../../store/characterCreationStore';
import { Period } from '../../../../shared/types';

interface Step1IdentityProps {
  onNext: () => void;
}

const Step1Identity = ({ onNext }: Step1IdentityProps) => {
  const { name, age, gender, birthStatus, period, setIdentity } =
    useCharacterCreationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-westeros-gold mb-2">
          Adım 1: Kimlik
        </h2>
        <p className="text-gray-400">Karakterinizin temel bilgilerini girin</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          İsim <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setIdentity({ name: e.target.value, age, gender, birthStatus, period })}
          className="input-field"
          placeholder="Örn: Jon, Arya, Tyrion"
          maxLength={30}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Maksimum 30 karakter</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">
            Yaş <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) =>
              setIdentity({ name, age: parseInt(e.target.value), gender, birthStatus, period })
            }
            className="input-field"
            min={15}
            max={80}
            required
          />
          <p className="text-xs text-gray-500 mt-1">15-80 arası</p>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-2">
            Cinsiyet <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) =>
              setIdentity({
                name,
                age,
                gender: e.target.value as 'male' | 'female',
                birthStatus,
                period,
              })
            }
            className="input-field"
            required
          >
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="birthStatus" className="block text-sm font-medium mb-2">
          Doğum Durumu <span className="text-red-500">*</span>
        </label>
        <select
          id="birthStatus"
          value={birthStatus}
          onChange={(e) =>
            setIdentity({
              name,
              age,
              gender,
              birthStatus: e.target.value as 'legitimate' | 'bastard',
              period,
            })
          }
          className="input-field"
          required
        >
          <option value="legitimate">Meşru</option>
          <option value="bastard">Piç</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Piç statüsü bazı sosyal etkileşimleri etkiler
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Dönem Seçimi <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <div
            onClick={() => setIdentity({ name, age, gender, birthStatus, period: 'RobertsRebellion' })}
            className={`card cursor-pointer transition ${
              period === 'RobertsRebellion'
                ? 'border-2 border-westeros-gold glow-gold'
                : 'hover:border-gray-600'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Robert'in İsyanı</h3>
            <p className="text-sm text-gray-400 mb-2">
              Aerys II tahtta. İsyan başladı.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Targaryen hakimiyeti</li>
              <li>• Aktif savaş</li>
              <li>• Yüksek tehlike</li>
            </ul>
          </div>

          <div
            onClick={() => setIdentity({ name, age, gender, birthStatus, period: 'GameOfThrones' })}
            className={`card cursor-pointer transition ${
              period === 'GameOfThrones'
                ? 'border-2 border-westeros-gold glow-gold'
                : 'hover:border-gray-600'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Taht Oyunları</h3>
            <p className="text-sm text-gray-400 mb-2">
              Robert Baratheon kral. Komplolar başlıyor.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Görece barış</li>
              <li>• Siyasi entrika</li>
              <li>• King's Landing odaklı</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || age < 15 || age > 80}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        İleri
      </button>
    </form>
  );
};

export default Step1Identity;
