import React, { useState } from 'react';
import { BookOpen, X, Sparkles, Shield, Skull, Compass, Flame, Droplets, Wind, Mountain, Crown } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../utils/i18n';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'story' | 'realms' | 'cards' | 'rules'>('story');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-left max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base md:text-lg font-bold text-amber-100">
                ATHANASIA: Ang Hiwaga ng Diwa
              </h2>
              <p className="text-[11px] text-slate-400 font-serif italic">
                "Sa Likod ng Bawat Anino, May Lihim na Nakatago."
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'story' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.rulesTabStory}
          </button>
          <button
            onClick={() => setActiveTab('realms')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'realms' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.rulesTabRealms}
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cards' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.rulesTabCards}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rules' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.rulesTabMechanics}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs text-slate-300 pr-1">
          {activeTab === 'story' && (
            <div className="space-y-3">
              <p>
                Noong unang panahon sa kapuluan, ang daigdig ng mga mortal at ang kalipunan ng mga espiritu ay namumuhay sa banal na pagkakasundo na pinananatili ng <strong>Diwa</strong>—ang dalisay na tanglaw ng buhay at alaala.
              </p>
              <p>
                Subalit, isang maruming kadiliman na tinawag na <strong>Karimlan</strong> ang lumason sa mga elemento. Nabasag at nanakaw ang Diwa, kaya't ang apat na elemental na lupain ay nalugmok sa walang-hanggang dapit-hapon.
              </p>
              <p>
                Isang maliit na pangkat ng mga <strong>Aninag</strong> (mga pilgrim) ang naglakbay upang makarating sa <strong>Aetherya</strong>, ang lumulutang na dambana na binabantayan ng primordyal na titanong si <strong>Varyndor</strong> upang ibalik ang liwanag. Ngunit lingid sa kanilang kaalaman, may isang <strong>Impostor</strong> sa kanilang hanay na lihim na sumasabotahe sa paglalakbay!
              </p>
            </div>
          )}

          {activeTab === 'realms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                  <Mountain className="w-4 h-4" /> Talvaris — Lupa (17 Tiles)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bantay: <strong>Ikapatar (Ikapati)</strong>. Ang sagradong lupain ng agrikultura, ugat, at guho.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Flame className="w-4 h-4" /> Alabarya — Apoy (14 Tiles)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bantay: <strong>Sinukalab (Sinukuan)</strong>. Ang maapoy na kabundukan at bulkan ng primordial na init.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Droplets className="w-4 h-4" /> Alonawon — Tubig (11 Tiles)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bantay: <strong>Sinayalon (Aman Sinaya)</strong>. Ang lumubog na dambana sa ilalim ng buwan at maalong dagat.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40">
                <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                  <Wind className="w-4 h-4" /> Himaraya — Hangin (8 Tiles)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bantay: <strong>Lihamihan (Amihan)</strong>. Ang matatayog na talampas sa hangganan ng Kaluwalhatian.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-yellow-950/50 border border-yellow-400/50">
                <div className="font-bold text-yellow-300 flex items-center gap-1.5 text-xs">
                  <Crown className="w-4 h-4" /> Aetherya — Huling Dambana (Tile 50)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bantay: <strong>Varyndor</strong>. Ang dambana kung saan hinaharap ang Huling Hamon para sa walang-hanggang Diwa.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300 text-xs">Sumpa Card (Lihim na Kapansanan)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ibinubulong sa simula ng laro. Hindi nakakapagpabagal sa paggalaw, ngunit ito ang susi sa pagsagot sa Pahiwatig sa Tarangkahan ng Diwaling.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300 text-xs">Pahiwatig Card (Mga Tanong ng Diwaling)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lilitaw kapag nakarating sa Pintuan. Kailangang ituro ng grupo kung sino ang nagtataglay ng kaukulang Sumpa upang mabuksan ang tarangkahan.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300 text-xs">Pagsubok Card (Bugtong at Karunungan)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Matatagpuan sa mga Pagsubok tiles. Sagutin ang tradisyunal na bugtong o logic puzzle upang magkamit ng Biyaya card.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300 text-xs">Kapalaran Card (Tadhana at Pagsusugal)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pumili sa pagitan ng ligtas na handog o mapangahas na pag-abante na may kapalit na panganib.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300 text-xs">Biyaya Card (Uno-Style Action Cards)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mga agimat tulad ng Harang (Skip), Baliktad (Reverse 2), Abante (+2 moves), at Kalasag (Shield).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300">Kilos at Pag-abante (Movement)</div>
                <p className="text-[11px] text-slate-400">
                  Pagulungin ang 6-sided movement die. Bawat manlalaro ay kailangang huminto sa saradong Tarangkahan ng Diwaling hanggang ito ay mabuksan ng grupo.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300">Pag-akusa sa Impostor (Guess the Impostor)</div>
                <p className="text-[11px] text-slate-400">
                  Maaari mong gamitin ang iyong Accusation card isang beses sa iyong tira. Kung tama ang hinala, agad kang aabante sa Aetherya! Ngunit kung mali, babalik ka sa simula at mawawalan ng 1 tira.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300">Kondisyon ng Tagumpay (Victory Conditions)</div>
                <p className="text-[11px] text-slate-400">
                  <strong>Tagumpay ng Aninag:</strong> Makarating sa Aetherya o matagumpay na ibunyag ang Impostor.<br />
                  <strong>Tagumpay ng Impostor:</strong> Sabotahin ang mga pagsubok at pigilan ang mga Aninag sa pagpapanumbalik ng Diwa.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-end">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
