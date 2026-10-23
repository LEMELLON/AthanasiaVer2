import React, { useState, useRef } from 'react';
import { PilgrimProfile } from '../../types/game';
import { DEFAULT_CHARACTER_AVATARS } from '../../data/canonicalCards';
import { savePilgrimProfile } from '../../utils/cookie';
import { sounds } from '../../utils/audio';
import { 
  User, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  X, 
  Shield, 
  Crown, 
  Image as ImageIcon,
  Flame,
  Feather
} from 'lucide-react';

interface PilgrimProfileEditorProps {
  initialProfile: PilgrimProfile;
  onSave: (updatedProfile: PilgrimProfile) => void;
  onClose: () => void;
}

export const PilgrimProfileEditor: React.FC<PilgrimProfileEditorProps> = ({
  initialProfile,
  onSave,
  onClose,
}) => {
  const [playerName, setPlayerName] = useState(initialProfile.playerName || 'Aninag Bayani');
  const [characterName, setCharacterName] = useState(initialProfile.characterName || 'Babaylan Tala');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || DEFAULT_CHARACTER_AVATARS[0].url);
  const [inputUrl, setInputUrl] = useState('');
  const [avatarTab, setAvatarTab] = useState<'upload' | 'url' | 'presets'>('presets');
  const [uploadError, setUploadError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Tanging mga larawan (PNG, JPG, WebP) lamang ang tinatanggap.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Masyadong malaki ang larawan. Hanggang 2MB lamang.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setUploadError('');
        sounds.playChallengeSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    setAvatarUrl(inputUrl.trim());
    setInputUrl('');
    sounds.playClick();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playChallengeSuccess();

    const updated: PilgrimProfile = {
      playerName: playerName.trim() || 'Aninag Bayani',
      characterName: characterName.trim() || 'Babaylan Tala',
      avatarUrl,
    };

    savePilgrimProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      onSave(updated);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#0b0f17] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl shadow-amber-950/50 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>Profile ng Manlalakbay</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-amber-300/70 font-serif italic">
                I-ukit ang iyong pagkakakilanlan sa aklat ng Athanasia (Naka-save sa Cookies)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Form Inputs */}
            <div className="flex flex-col gap-4">
              {/* Player Name */}
              <div>
                <label className="text-xs font-semibold text-amber-300 font-cinzel block mb-1.5">
                  Pangalan ng Manlalaro (Player Name):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={25}
                    placeholder="Hal. Amihan, Makisig..."
                    className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Character Lore Title / Name */}
              <div>
                <label className="text-xs font-semibold text-amber-300 font-cinzel block mb-1.5">
                  Pangalan ng Karakter / Pamagat (Character Title):
                </label>
                <div className="relative">
                  <Crown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    maxLength={35}
                    placeholder="Hal. Babaylan Tala ng Sinukuan..."
                    className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Avatar Chooser Tabs */}
              <div className="mt-1">
                <label className="text-xs font-semibold text-amber-300 font-cinzel block mb-2">
                  Piliin ang Larawan ng Karakter:
                </label>

                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 mb-3">
                  <button
                    type="button"
                    onClick={() => { setAvatarTab('presets'); sounds.playClick(); }}
                    className={`flex-1 py-1 text-[11px] font-cinzel rounded-lg transition-all cursor-pointer ${
                      avatarTab === 'presets' ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Myth Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAvatarTab('upload'); sounds.playClick(); }}
                    className={`flex-1 py-1 text-[11px] font-cinzel rounded-lg transition-all cursor-pointer ${
                      avatarTab === 'upload' ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAvatarTab('url'); sounds.playClick(); }}
                    className={`flex-1 py-1 text-[11px] font-cinzel rounded-lg transition-all cursor-pointer ${
                      avatarTab === 'url' ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Image Link
                  </button>
                </div>

                {/* Tab: Presets */}
                {avatarTab === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {DEFAULT_CHARACTER_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(av.url);
                          setCharacterName(av.name);
                          sounds.playClick();
                        }}
                        className={`group p-1.5 rounded-xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          avatarUrl === av.url
                            ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50 shadow-md'
                            : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-11 h-11 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="text-[10px] text-slate-300 truncate w-full text-center font-medium">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab: Upload File */}
                {avatarTab === 'upload' && (
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-950/50 hover:bg-slate-900/80 cursor-pointer transition-all"
                    >
                      <Upload className="w-6 h-6 text-amber-400 animate-bounce" />
                      <span className="text-xs text-amber-200 font-semibold">
                        Pumili o Mag-drop ng Larawan
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, WebP hanggang 2MB
                      </span>
                    </button>
                    {uploadError && (
                      <p className="text-[11px] text-rose-400">{uploadError}</p>
                    )}
                  </div>
                )}

                {/* Tab: Image Link */}
                {avatarTab === 'url' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-cinzel text-xs font-bold cursor-pointer"
                      >
                        Gamitin
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">
                      Direktang ilakip ang web image link
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Glowing Talisman Preview Card */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-cinzel font-bold text-slate-400 tracking-wider uppercase mb-2">
                Agimat ng Pagkakakilanlan (Live Preview)
              </span>

              <div className="w-full max-w-[260px] p-5 rounded-3xl bg-gradient-to-b from-amber-950/50 via-slate-950 to-slate-900 border-2 border-amber-500 shadow-2xl shadow-amber-600/30 flex flex-col items-center text-center relative overflow-hidden animate-pulse-glow">
                {/* Filigree corner accents */}
                <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-mono">✦</div>
                <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-mono">✦</div>
                <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-mono">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-mono">✦</div>

                {/* Avatar with Gilded Border */}
                <div className="relative mb-3 mt-1">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-yellow-300 shadow-lg shadow-amber-500/40">
                    <img
                      src={avatarUrl}
                      alt={playerName}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                      onError={() => setAvatarUrl(DEFAULT_CHARACTER_AVATARS[0].url)}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Player Name */}
                <h3 className="font-cinzel text-base font-bold text-amber-100 tracking-wide mt-1">
                  {playerName || 'Aninag Bayani'}
                </h3>

                {/* Character Title */}
                <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-cinzel font-semibold tracking-wider uppercase">
                  {characterName || 'Babaylan Tala'}
                </div>

                <div className="border-t border-slate-800 w-full my-3" />

                <div className="text-[10px] text-slate-400 font-serif italic text-center px-1">
                  "Nawa'y gabayan ng mga bathala ang bawat hakbang sa lupain ng Athanasia."
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-cinzel text-xs cursor-pointer transition-colors"
            >
              Kanselahin
            </button>
            <button
              type="submit"
              disabled={saveSuccess}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-cinzel text-xs font-bold flex items-center gap-2 shadow-xl hover:brightness-110 cursor-pointer transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>NAI-SAVE SA COOKIES!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>I-SAVE ANG PROFILE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
