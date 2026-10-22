import React, { useState } from 'react';
import { BookOpen, X, Mountain, Flame, Droplets, Wind, Crown } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
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
                {t.motto}
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
            {t.tabLore}
          </button>
          <button
            onClick={() => setActiveTab('realms')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'realms' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'tl' ? '4 na Lupain (Realms)' : '4 Realms'}
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cards' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabCardTypes}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rules' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabTurnOrder}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs text-slate-300 pr-1">
          {activeTab === 'story' && (
            <div className="space-y-3">
              {language === 'tl' ? (
                <>
                  <p>
                    Noong unang panahon sa kapuluan, ang daigdig ng mga mortal at ang kalipunan ng mga espiritu ay namumuhay sa banal na pagkakasundo na pinananatili ng <strong>Diwa</strong>—ang dalisay na tanglaw ng buhay at alaala.
                  </p>
                  <p>
                    Subalit, isang maruming kadiliman na tinawag na <strong>Karimlan</strong> ang lumason sa mga elemento. Nabasag at nanakaw ang Diwa, kaya't ang apat na elemental na lupain ay nalugmok sa walang-hanggang dapit-hapon.
                  </p>
                  <p>
                    Isang maliit na pangkat ng mga <strong>Aninag</strong> (mga pilgrim) ang naglakbay upang makarating sa <strong>Aetherya</strong>, ang lumulutang na dambana na binabantayan ng primordyal na titanong si <strong>Varyndor</strong> upang ibalik ang liwanag. Ngunit lingid sa kanilang kaalaman, may isang <strong>Impostor</strong> sa kanilang hanay na lihim na sumasabotahe sa paglalakbay!
                  </p>
                </>
              ) : (
                <>
                  <p>
                    In ancient times across the archipelago, the mortal realm and spiritual plane coexisted in sacred harmony sustained by the <strong>Diwa</strong>—the pure spark of life, soul, and memory.
                  </p>
                  <p>
                    Yet an ancient corruption known as the <strong>Karimlan</strong> shattered the elements and stole the Diwa, casting the four elemental realms into perpetual twilight.
                  </p>
                  <p>
                    A band of pilgrims known as the <strong>Aninag</strong> embarked on an expedition to reach <strong>Aetherya</strong>, the floating sanctuary guarded by the primordial titan <strong>Varyndor</strong> to restore the balance. Unknown to them, a corrupted <strong>Impostor</strong> walks among their ranks, working secretly to derail the journey!
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === 'realms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                  <Mountain className="w-4 h-4" /> Talvaris — Lupa (Tiles 1-17)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bantay: Ikapatar (Ikapati). Ang sagradong lupain ng agrikultura, ugat, at guho.'
                    : 'Guardian: Ikapatar (Ikapati). The sacred ground of soil, deep roots, and ancient ruins.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Flame className="w-4 h-4" /> Alabarya — Apoy (Tiles 18-31)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bantay: Sinukalab (Sinukuan). Ang maapoy na kabundukan at bulkan ng primordial na init.'
                    : 'Guardian: Sinukalab (Sinukuan). Volcanic mountains and primal embers of courage and trial.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Droplets className="w-4 h-4" /> Alonawon — Tubig (Tiles 32-42)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bantay: Sinayalon (Aman Sinaya). Ang lumubog na dambana sa ilalim ng buwan at maalong dagat.'
                    : 'Guardian: Sinayalon (Aman Sinaya). Submerged coral temples under moonlit oceanic currents.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40">
                <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                  <Wind className="w-4 h-4" /> Himaraya — Hangin (Tiles 43-49)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bantay: Lihamihan (Amihan). Ang matatayog na talampas sa hangganan ng Kaluwalhatian.'
                    : 'Guardian: Lihamihan (Amihan). Sky-high ridges and celestial breezes approaching Kaluwalhatian.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-yellow-950/50 border border-yellow-400/50">
                <div className="font-bold text-yellow-300 flex items-center gap-1.5 text-xs">
                  <Crown className="w-4 h-4" /> Aetherya — Huling Dambana (Tile 50)
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bantay: Varyndor. Ang dambana kung saan hinaharap ang Huling Hamon para sa walang-hanggang Diwa.'
                    : 'Guardian: Varyndor. The floating sanctuary where the Final Victory of Diwa is claimed.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-2.5">
              <div>
                <strong className="text-amber-300 font-cinzel">1. Role & Accusation:</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Lihim na itinatalaga kung ikaw ay Aninag o Impostor. May 1 Accusation card sa buong laro upang hulaan ang taksil.'
                    : 'Secretly designates whether you are an Aninag pilgrim or the Impostor. Each player holds 1 single-use Accusation to unmask the traitor.'}
                </p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">2. Sumpa Cards (6 Curses):</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Tikbalang, Manananggal, Bakunawa, Kapre, Nuno sa Punso, at Tiyanak. Binabasa ang pahiwatig sa simula at nagsisilbing susi sa Pintuan ng Diwaling.'
                    : 'Tikbalang, Manananggal, Bakunawa, Kapre, Nuno sa Punso, and Tiyanak. Their clues are read aloud at match start and serve as keys to Diwaling Gates.'}
                </p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">3. Pahiwatig Cards (18 Gate Riddles):</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Kinakaharap sa Pintuan ng Diwaling. Nagtatanong kung sino ang may hawak ng partikular na sumpa upang mabuksan ang daan.'
                    : 'Encountered at each Diwaling Gate. Prompts the group to identify which player bears the corresponding Sumpa to unseal passage.'}
                </p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">4. Pagsubok Cards (60 Lore Trials):</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Bugtong, Pambansang Sagisag, Kasabihan, 5-segundong bilisan, Tongue twisters, at Sawikain. Ang tamang sagot ay nagbibigay ng Biyaya card.'
                    : 'Bugtong riddles, National symbols, Proverbs, 5-second speed trivia, Tongue twisters, and Idioms. Correct answers grant Biyaya cards.'}
                </p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">5. Biyaya Cards (30 Action Cards):</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Utility cards tulad ng Sulong, Urong, Harang (skip), Kalasag (Anting-Anting shield), at Palit-Pwesto sa kapwa manlalakbay.'
                    : 'Utility cards like Advance, Retract, Skip turn, Anting-Anting shield, and Position swap with fellow travelers in the same realm.'}
                </p>
              </div>
              <div>
                <strong className="text-amber-300 font-cinzel">6. Kapalaran Cards (30 Dilemma Cards):</strong>
                <p className="text-[11px] text-slate-300">
                  {language === 'tl'
                    ? 'Panganib at biyaya (Choice A vs Choice B) na sumusubok sa tapang at diskarte ng manlalakbay.'
                    : 'Risk versus reward dilemmas (Choice A vs Choice B) testing pilgrim courage and calculated strategy.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-amber-300 font-cinzel">
                  {language === 'tl' ? 'Pagkakasunod ng Tira (Turn Sequence):' : 'Turn Sequence:'}
                </h4>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300 mt-1">
                  <li><strong>Roll:</strong> {language === 'tl' ? 'Pagulungin ang dice at lumipat sa kaukulang tile.' : 'Roll the dice and advance to the target tile.'}</li>
                  <li><strong>Tile Event:</strong> {language === 'tl' ? 'Harapin ang Pintuan ng Diwaling, Pagsubok, o Kapalaran.' : 'Resolve the Diwaling Gate, Pagsubok, or Kapalaran dilemma on your tile.'}</li>
                  <li><strong>Action:</strong> {language === 'tl' ? 'Maglaro ng Biyaya card o magsagawa ng Impostor Accusation.' : 'Play optional Biyaya action cards or make an Impostor accusation.'}</li>
                  <li><strong>End:</strong> {language === 'tl' ? 'Ipasa ang tira sa susunod na kasama.' : 'End your turn and pass play to the next traveler.'}</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 font-cinzel">
                  {language === 'tl' ? 'Kondisyon ng Tagumpay:' : 'Victory Conditions:'}
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300 mt-1">
                  <li><strong>{language === 'tl' ? 'Tagumpay ng Aninag:' : 'Aninag Victory:'}</strong> {language === 'tl' ? 'Maabot ang Tile 50 (Aetherya) o maalis ang Impostor gamit ang tamang paratang.' : 'Reach Tile 50 (Aetherya) or eliminate the Impostor with a correct accusation.'}</li>
                  <li><strong>{language === 'tl' ? 'Tagumpay ng Impostor:' : 'Impostor Victory:'}</strong> {language === 'tl' ? 'Makarating sa Aetherya o mapigilan ang mga Aninag nang hindi nabubunyag.' : 'Reach Aetherya first or sabotage the pilgrims without being unmasked.'}</li>
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
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
