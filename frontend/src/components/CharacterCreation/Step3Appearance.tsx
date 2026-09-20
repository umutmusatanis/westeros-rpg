import { useState } from 'react';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

interface Step3AppearanceProps {
  onNext: () => void;
  onBack: () => void;
}

const Step3Appearance = ({ onNext, onBack }: Step3AppearanceProps) => {
  const { appearance, setAppearance, gender } = useCharacterCreationStore();

  const [height, setHeight] = useState(appearance?.height || (gender === 'male' ? 175 : 165));
  const [weight, setWeight] = useState(appearance?.weight || 70);
  const [hairColor, setHairColor] = useState(appearance?.hairColor || 'Siyah');
  const [hairLength, setHairLength] = useState(appearance?.hairLength || 'Orta');
  const [hairStyle, setHairStyle] = useState(appearance?.hairStyle || 'Düz');
  const [eyeColor, setEyeColor] = useState(appearance?.eyeColor || 'Kahverengi');
  const [skinTone, setSkinTone] = useState(appearance?.skinTone || 'Açık');
  const [faceType, setFaceType] = useState(appearance?.faceType || 'Oval');
  const [beard, setBeard] = useState(appearance?.beard || '');
  const [bodyType, setBodyType] = useState(appearance?.bodyType || 'Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppearance({
      height,
      weight,
      hairColor,
      hairLength,
      hairStyle,
      eyeColor,
      skinTone,
      faceType,
      beard: gender === 'male' ? beard : undefined,
      bodyType,
    });
    onNext();
  };

  const hairColors = ['Siyah', 'Kahverengi', 'Sarı', 'Kızıl', 'Beyaz', 'Gümüş'];
  const hairLengths = ['Kısa', 'Orta', 'Uzun', 'Çok Uzun'];
  const hairStyles = ['Düz', 'Dalgalı', 'Kıvırcık', 'Kel'];
  const eyeColors = ['Kahverengi', 'Mavi', 'Yeşil', 'Gri', 'Siyah', 'Amber'];
  const skinTones = ['Açık', 'Orta', 'Esmer', 'Koyu'];
  const faceTypes = ['Oval', 'Yuvarlak', 'Kare', 'Uzun', 'Kalp'];
  const beardStyles = ['Yok', 'Kısa Sakal', 'Uzun Sakal', 'Keçi Sakalı', 'Bıyık'];
  const bodyTypes = ['Zayıf', 'İnce', 'Normal', 'Atletik', 'Kaslı', 'Kilolu'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-westeros-gold mb-2">
          Adım 3: Görünüş
        </h2>
        <p className="text-gray-400">Karakterinizin fiziksel özelliklerini belirleyin</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-2">
              Boy (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              id="height"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              min={140}
              max={220}
              className="w-full"
            />
            <p className="text-sm text-gray-400 text-center">{height} cm</p>
            {height >= 190 && gender === 'male' && (
              <p className="text-xs text-westeros-gold">Dev özelliği için uygun!</p>
            )}
            {height >= 175 && gender === 'female' && (
              <p className="text-xs text-westeros-gold">Dev özelliği için uygun!</p>
            )}
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-2">
              Kilo (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              min={40}
              max={200}
              className="w-full"
            />
            <p className="text-sm text-gray-400 text-center">{weight} kg</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Saç Rengi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hairColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHairColor(color)}
                  className={`py-2 px-3 rounded text-sm ${
                    hairColor === color
                      ? 'bg-westeros-gold text-black'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Saç Uzunluğu <span className="text-red-500">*</span>
            </label>
            <select
              value={hairLength}
              onChange={(e) => setHairLength(e.target.value)}
              className="input-field"
            >
              {hairLengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Saç Stili <span className="text-red-500">*</span>
            </label>
            <select
              value={hairStyle}
              onChange={(e) => setHairStyle(e.target.value)}
              className="input-field"
            >
              {hairStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Göz Rengi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {eyeColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEyeColor(color)}
                  className={`py-2 px-3 rounded text-sm ${
                    eyeColor === color
                      ? 'bg-westeros-gold text-black'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ten Rengi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setSkinTone(tone)}
                  className={`py-2 px-3 rounded text-sm ${
                    skinTone === tone
                      ? 'bg-westeros-gold text-black'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Yüz Tipi <span className="text-red-500">*</span>
            </label>
            <select
              value={faceType}
              onChange={(e) => setFaceType(e.target.value)}
              className="input-field"
            >
              {faceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {gender === 'male' && (
            <div>
              <label className="block text-sm font-medium mb-2">Sakal</label>
              <select
                value={beard}
                onChange={(e) => setBeard(e.target.value)}
                className="input-field"
              >
                {beardStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Beden Tipi <span className="text-red-500">*</span>
            </label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="input-field"
            >
              {bodyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">
          Geri
        </button>
        <button type="submit" className="btn-primary flex-1">
          İleri
        </button>
      </div>
    </form>
  );
};

export default Step3Appearance;
