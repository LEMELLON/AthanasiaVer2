import React, { useState } from 'react';
import { BookOpen, X, Sparkles, Shield, Skull, Compass, Flame, Droplets, Wind, Mountain, Crown } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
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
              activeTab === 'story' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kwento & Mitolohiya
          </button>
          <button
            onClick={() => setActiveTab('realms')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'realms' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            4 na Lupain (Realms)
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cards' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mga Baraha (Decks)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rules' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alituntunin & Tagumpay
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
              <div>
                <strong className="text-amber-300 font-cinzel">1. Role Card & Guess the Impostor:</strong>
                <p className="text-[11px] text-slate-300">Lihim na itinatalaga kung ikaw ay Ordinaryong Aninag o Impostor. Mayroon kang 1 Accusation card sa buong laro upang hulaan ang taksil.</p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">2. Sumpa Cards (6 Curses):</strong>
                <p className="text-[11px] text-slate-300">Tikbalang, Manananggal, Bakunawa, Kapre, Nuno sa Punso, at Tiyanak. Binabasa nang malakas ang pahiwatig sa simula at nagsisilbing susi sa Pintuan ng Diwaling.</p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">3. Pahiwatig Cards (18 Gate Riddles):</strong>
                <p className="text-[11px] text-slate-300">Kinakaharap sa Pintuan ng Diwaling. Nagtatanong kung sino ang may hawak ng partikular na sumpa. Kapag nahulaan ng grupo, bubukas ang tarangkahan.</p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">4. Pagsubok Cards (60 Challenges):</strong>
                <p className="text-[11px] text-slate-300">Riddles (Bugtong), Pambansang Sagisag trivia, Kasabihan, 5-segundong bilisan, Tongue twisters, at Sawikain. Ang tamang sagot ay nagbibigay ng Biyaya card.</p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">5. Biyaya Cards (30 Action Cards):</strong>
                <p className="text-[11px] text-slate-300">Uno-style utility cards tulad ng Abante (sulung), Baliktad (urong), Harang (skip), Kalasag (shield laban sa negatibong epekto), at Palit-Pwesto sa parehong lupain.</p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">6. Kapalaran Cards (30 Dilemma Cards):</strong>
                <p className="text-[11px] text-slate-300">Choice A vs Choice B na nagbibigay ng gantimpala o mga hamon sa paglalakbay.</p>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-amber-300 font-cinzel">Pagkakasunod ng Tira (Turn Sequence):</h4>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300 mt-1">
                  <li><strong>Roll:</strong> Pagulungin ang dice at lumipat sa kaukulang tile.</li>
                  <li><strong>Tile Event:</strong> Harapin ang Diwaling Gate, Pagsubok, o Kapalaran ayon sa napuntahang espasyo.</li>
                  <li><strong>Action:</strong> Maglaro ng Biyaya cards mula sa iyong kamay o magsagawa ng Impostor Accusation kung may hinala.</li>
                  <li><strong>End:</strong> Ipasa ang tira sa susunod na manlalaro.</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 font-cinzel">Kondisyon ng Tagumpay:</h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300 mt-1">
                  <li><strong>Tagumpay ng Aninag:</strong> Maabot ang Tile 50 (Aetherya), buksan ang mga tarangkahan, o maalis ang Impostor gamit ang tamang Accusation.</li>
                  <li><strong>Tagumpay ng Impostor:</strong> Mapigilan ang mga Aninag na maabot ang dambana o makarating sa Aetherya nang hindi nabubunyag ang lihim.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel text-xs font-bold transition-colors cursor-pointer"
          >
            Naiintindihan Ko Na
          </button>
        </div>
      </div>
    </div>
  );
};
