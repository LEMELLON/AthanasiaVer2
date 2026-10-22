import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'tl' | 'en';

export interface Translations {
  // Brand & Nav
  appName: string;
  appSubtitle: string;
  roomLabel: string;
  roomCodeLabel: string;
  copyCode: string;
  copied: string;
  soundToggle: string;
  rulesBtn: string;
  adminBtn: string;
  leaveRoomBtn: string;
  roleAninag: string;
  roleImpostor: string;

  // Realms (Titles remain Tagalog, elemental descriptor localized)
  realmTalvaris: string;
  realmAlabarya: string;
  realmAlonawon: string;
  realmHimaraya: string;
  realmAetherya: string;

  // Lobby
  mythTag: string;
  motto: string;
  pilgrimNameLabel: string;
  pilgrimNameSub: string;
  pilgrimNamePlaceholder: string;
  tabSolo: string;
  tabCreate: string;
  tabJoin: string;
  quickSoloTitle: string;
  quickSoloDesc: string;
  quickSoloBtn: string;
  roomNameLabel: string;
  totalPlayersLabel: string;
  fillBotsLabel: string;
  createRoomBtn: string;
  joinCodePlaceholder: string;
  joinBtn: string;
  openRoomsLabel: string;
  refreshBtn: string;
  noOpenRooms: string;
  statusPlaying: string;
  rulesLink: string;
  adminLink: string;

  // Pre-game room lobby
  roomOfPilgrimage: string;
  fellowPilgrims: string;
  addBotBtn: string;
  readyStatus: string;
  minPlayersNotice: string;
  readyLaunchNotice: string;
  startGameBtn: string;
  waitingHostNotice: string;

  // Board
  rowEarth: string;
  rowFire: string;
  rowWater: string;
  rowAir: string;
  rowSanctuary: string;
  guardianPrefix: string;
  realmPrefix: string;
  typePrefix: string;
  closeBtn: string;
  startTileLabel: string;
  gateTileLabel: string;
  endTileLabel: string;

  // Dice
  sacredDice: string;
  rollingDice: string;
  resultDice: string;
  readyDice: string;
  rollDiceBtn: string;
  rollingDiceBtn: string;
  notYourTurn: string;
  halvedRollNotice: string;

  // Hand Drawer
  drawerHandle: string;
  roleBtn: string;
  peekRole: string;
  sumpaBtn: string;
  peekSumpa: string;
  shieldBadge: string;
  accuseBtn: string;
  accuseTooltip: string;
  endTurnBtn: string;
  emptyHand: string;
  useCardBtn: string;
  cannotPlayBtn: string;
  targetLabel: string;
  hideSecret: string;

  // Chat & Players
  tabChat: string;
  tabPilgrims: string;
  chatPlaceholder: string;
  tilePositionLabel: string;
  cardsCountLabel: string;
  actingBadge: string;
  hostBadge: string;
  botBadge: string;
  accusationChatTitle: string;

  // Gate Challenge Modal
  gateModalTitle: string;
  gateModalSubtitle: string;
  gateModalDesc: string;
  gateCluePrefix: string;
  gateVotePrompt: string;
  gateVoteBtn: string;
  gateVotedStatus: string;

  // Pagsubok Modal
  pagsubokTitle: string;
  pagsubokSubtitle: string;
  pagsubokNotice: string;
  pagsubokSubmitBtn: string;
  pagsubokInputPlaceholder: string;

  // Kapalaran Modal
  kapalaranTitle: string;
  kapalaranSubtitle: string;
  kapalaranPrompt: string;

  // Accusation Modal
  accusationTitle: string;
  accusationWarning: string;
  accusationPrompt: string;
  accusationConfirmBtn: string;
  cancelBtn: string;

  // Victory Modal
  victoryAninagTitle: string;
  victoryImpostorTitle: string;
  victoryAninagDesc: string;
  victoryImpostorDesc: string;
  winnerLabel: string;
  playAgainBtn: string;

  // Rules Modal
  rulesModalTitle: string;
  tabLore: string;
  tabTurnOrder: string;
  tabRoles: string;
  tabGates: string;
  tabCardTypes: string;
}

const translations: Record<Language, Translations> = {
  tl: {
    appName: 'ATHANASIA',
    appSubtitle: 'ANG HIWAGA NG DIWA',
    roomLabel: 'Silid',
    roomCodeLabel: 'Code ng Silid:',
    copyCode: 'Kopyahin ang Room Code',
    copied: 'Nakopya!',
    soundToggle: 'Tunog',
    rulesBtn: 'Gabay / Alituntunin',
    adminBtn: 'Admin Suite',
    leaveRoomBtn: 'Umalis sa Silid',
    roleAninag: 'ANINAG (Pilgrim)',
    roleImpostor: 'IMPOSTOR (Lihim)',

    realmTalvaris: 'Talvaris (Lupa)',
    realmAlabarya: 'Alabarya (Apoy)',
    realmAlonawon: 'Alonawon (Tubig)',
    realmHimaraya: 'Himaraya (Hangin)',
    realmAetherya: 'Aetherya (Huling Lupain)',

    mythTag: 'Mitolohiyang Pilipino · Dark-Fantasy Board & Card Adventure',
    motto: '"Sa Likod ng Bawat Anino, May Lihim na Nakatago."',
    pilgrimNameLabel: 'Pangalan ng Manlalakbay & Avatar:',
    pilgrimNameSub: 'Piliin ang iyong nilalang',
    pilgrimNamePlaceholder: 'Ipasok ang iyong pangalan...',
    tabSolo: 'Solo / AI Bots',
    tabCreate: 'Lumikha ng Silid',
    tabJoin: 'Sumali sa Silid',
    quickSoloTitle: 'Mabilisang Laro kasama ang 3 AI Bots',
    quickSoloDesc: 'Magsimula agad ng buong 4-player match nang walang paghihintay. Awtomatikong pupunuan ng matatalinong AI bot ang mga bakanteng pwesto!',
    quickSoloBtn: 'MAGSIMULA AGAD (SOLO / AI BOTS)',
    roomNameLabel: 'Pangalan ng Silid (Room Name):',
    totalPlayersLabel: 'Kabuuan ng Manlalaro (2-6):',
    fillBotsLabel: 'Punuan ng AI Bots',
    createRoomBtn: 'BUKSAN ANG BAGONG SILID',
    joinCodePlaceholder: 'Ipasok ang 5-titik na Room Code (hal. ABC12)',
    joinBtn: 'Sumali',
    openRoomsLabel: 'Bukas na mga Silid:',
    refreshBtn: 'I-refresh',
    noOpenRooms: 'Walang bukas na pampublikong silid sa ngayon. Lumikha ng bago upang magsimula!',
    statusPlaying: 'Naglalaro',
    rulesLink: 'Alituntunin ng Laro',
    adminLink: 'Admin Suite',

    roomOfPilgrimage: 'Silid ng Paglalakbay',
    fellowPilgrims: 'Mga Kasamang Manlalakbay',
    addBotBtn: 'Magdagdag ng AI Bot',
    readyStatus: 'Handa na para sa Athanasia',
    minPlayersNotice: 'Kailangan ng hindi bababa sa 2 manlalaro (o magdagdag ng AI bots) upang makapagsimula.',
    readyLaunchNotice: 'Kumpleto na ang paghahanda! Maaari nang simulan ang paglalakbay.',
    startGameBtn: 'SIMULAN ANG LARO',
    waitingHostNotice: 'Hinihintay ang Host na simulan ang laro...',

    rowEarth: 'Lupa',
    rowFire: 'Apoy',
    rowWater: 'Tubig',
    rowAir: 'Hangin',
    rowSanctuary: 'Aetherya',
    guardianPrefix: 'Bantay na Diwaling',
    realmPrefix: 'Lupain ng',
    typePrefix: 'Uri',
    closeBtn: 'Isara',
    startTileLabel: 'START',
    gateTileLabel: 'GATE',
    endTileLabel: 'WAKAS',

    sacredDice: 'Banal na Dice',
    rollingDice: 'Gumugulong...',
    resultDice: 'Resulta:',
    readyDice: 'Handa nang gumulong',
    rollDiceBtn: 'GUMULONG NG DICE',
    rollingDiceBtn: 'GUMUGULONG...',
    notYourTurn: 'HINDI MO TIRA',
    halvedRollNotice: 'Kalahati ang epekto ng susunod na roll!',

    drawerHandle: 'Mga Baraha at Agimat',
    roleBtn: 'Gampanin',
    peekRole: 'Silipin',
    sumpaBtn: 'Sumpa',
    peekSumpa: 'Silipin',
    shieldBadge: 'May Kalasag (Anting-Anting)',
    accuseBtn: 'Hulaan ang Impostor',
    accuseTooltip: 'Isang beses lamang magagamit sa buong laro!',
    endTurnBtn: 'Tapusin ang Tira ➔',
    emptyHand: 'Wala ka pang hawak na Biyaya cards. Makakamit ito sa pagsagot sa Pagsubok o sa Kapalaran!',
    useCardBtn: 'GAMITIN ANG BARAHA',
    cannotPlayBtn: 'HINDI PWEDE NGAYON',
    targetLabel: 'Target:',
    hideSecret: 'Itago',

    tabChat: 'Usapan & Tala',
    tabPilgrims: 'Manlalakbay',
    chatPlaceholder: 'Magpadala ng mensahe...',
    tilePositionLabel: 'Pwesto: Tile #',
    cardsCountLabel: 'Baraha',
    actingBadge: 'TUMITIRA',
    hostBadge: 'HOST',
    botBadge: 'AI',
    accusationChatTitle: '🚨 PARATANG NG IMPOSTOR',

    gateModalTitle: 'Pintuan ng Diwaling',
    gateModalSubtitle: 'Hamon ng Pagbubukas ng Tarangkahan',
    gateModalDesc: 'Sinusubok ng Bantay ang inyong grupo! Sino sa mga kasama ang nagtataglay ng kaukulang Sumpa upang mabuksan ang Pintuan?',
    gateCluePrefix: 'Pahiwatig mula sa Diwaling:',
    gateVotePrompt: 'Pumili ng manlalarong pinaghihinalaan:',
    gateVoteBtn: 'Isumite ang Boto',
    gateVotedStatus: 'Naitala na ang iyong boto. Hinihintay ang iba pang manlalaro...',

    pagsubokTitle: 'Pagsubok ng Katutubong Karunungan',
    pagsubokSubtitle: 'Hamon sa Kaalaman at Mitolohiya',
    pagsubokNotice: 'Gantimpala: 1 Biyaya Card. Kaparusahan sa Pagkabigo: Mawawalan ng 1 tira.',
    pagsubokSubmitBtn: 'Isumite ang Sagot',
    pagsubokInputPlaceholder: 'Ipasok ang iyong sagot...',

    kapalaranTitle: 'Gulong ng Kapalaran',
    kapalaranSubtitle: 'Panganib at Biyaya ng Tadhana',
    kapalaranPrompt: 'Pumili ng isa sa mga sumusunod na landas:',

    accusationTitle: 'Hulaan ang Impostor',
    accusationWarning: '⚠️ Babala: Isang beses mo lamang ito magagamit sa buong laro! Kung TAMA: Agad kang mapupunta sa Aetherya (Tile 50) at aalisin ang Impostor. Kung MALI: Babalik ka sa Simula (Tile 0) at hindi makatitira sa susunod na round!',
    accusationPrompt: 'Sino sa iyong palagay ang tunay na IMPOSTOR?',
    accusationConfirmBtn: 'Gawin ang Paratang!',
    cancelBtn: 'Kanselahin',

    victoryAninagTitle: 'TAGUMPAY NG MGA ANINAG!',
    victoryImpostorTitle: 'TAGUMPAY NG IMPOSTOR!',
    victoryAninagDesc: 'Matagumpay na narating ng mga tapat na Aninag ang Aetherya at napagtagumpayan ang mga hamon at lihim na Sumpa!',
    victoryImpostorDesc: 'Nalinlang ng Impostor ang buong grupo at unang nakarating sa Aetherya o naalis ang mga sumubok na humadlang!',
    winnerLabel: 'Nagwagi:',
    playAgainBtn: 'Muling Maglakbay (Lobby)',

    rulesModalTitle: 'Gabay at Alituntunin: Athanasia',
    tabLore: 'Kuwento (Lore)',
    tabTurnOrder: 'Daloy ng Laro',
    tabRoles: 'Gampanin (Roles)',
    tabGates: 'Tarangkahan (Gates)',
    tabCardTypes: 'Mga Baraha (Cards)',
  },
  en: {
    appName: 'ATHANASIA',
    appSubtitle: 'ANG HIWAGA NG DIWA',
    roomLabel: 'Room',
    roomCodeLabel: 'Room Code:',
    copyCode: 'Copy Room Code',
    copied: 'Copied!',
    soundToggle: 'Sound',
    rulesBtn: 'Guide & Rules',
    adminBtn: 'Admin Suite',
    leaveRoomBtn: 'Leave Room',
    roleAninag: 'ANINAG (Pilgrim)',
    roleImpostor: 'IMPOSTOR (Secret)',

    realmTalvaris: 'Talvaris (Earth)',
    realmAlabarya: 'Alabarya (Fire)',
    realmAlonawon: 'Alonawon (Water)',
    realmHimaraya: 'Himaraya (Air)',
    realmAetherya: 'Aetherya (Sanctuary)',

    mythTag: 'Philippine Mythology · Dark-Fantasy Board & Card Adventure',
    motto: '"Behind Every Shadow, A Secret Lies Hidden."',
    pilgrimNameLabel: 'Pilgrim Name & Avatar:',
    pilgrimNameSub: 'Choose your mythical entity',
    pilgrimNamePlaceholder: 'Enter your name...',
    tabSolo: 'Solo / AI Bots',
    tabCreate: 'Create Room',
    tabJoin: 'Join Room',
    quickSoloTitle: 'Quick Match with 3 AI Bots',
    quickSoloDesc: 'Instantly start a full 4-player match without waiting. Smart AI bots will automatically fill vacant spots!',
    quickSoloBtn: 'START NOW (SOLO / AI BOTS)',
    roomNameLabel: 'Room Name:',
    totalPlayersLabel: 'Total Players (2-6):',
    fillBotsLabel: 'Fill with AI Bots',
    createRoomBtn: 'OPEN NEW ROOM',
    joinCodePlaceholder: 'Enter 5-character Room Code (e.g. ABC12)',
    joinBtn: 'Join',
    openRoomsLabel: 'Open Public Rooms:',
    refreshBtn: 'Refresh',
    noOpenRooms: 'No public rooms currently open. Create a new one to begin!',
    statusPlaying: 'In Game',
    rulesLink: 'Game Rules',
    adminLink: 'Admin Suite',

    roomOfPilgrimage: 'Chamber of the Pilgrimage',
    fellowPilgrims: 'Fellow Pilgrims',
    addBotBtn: 'Add AI Bot',
    readyStatus: 'Ready for Athanasia',
    minPlayersNotice: 'Requires at least 2 players (or add AI bots) to start the match.',
    readyLaunchNotice: 'Preparations complete! The pilgrimage may now begin.',
    startGameBtn: 'START GAME',
    waitingHostNotice: 'Waiting for the Host to start the game...',

    rowEarth: 'Earth',
    rowFire: 'Fire',
    rowWater: 'Water',
    rowAir: 'Air',
    rowSanctuary: 'Aetherya',
    guardianPrefix: 'Diwaling Guardian',
    realmPrefix: 'Realm of',
    typePrefix: 'Type',
    closeBtn: 'Close',
    startTileLabel: 'START',
    gateTileLabel: 'GATE',
    endTileLabel: 'END',

    sacredDice: 'Sacred Dice',
    rollingDice: 'Rolling...',
    resultDice: 'Result:',
    readyDice: 'Ready to roll',
    rollDiceBtn: 'ROLL DICE',
    rollingDiceBtn: 'ROLLING...',
    notYourTurn: 'NOT YOUR TURN',
    halvedRollNotice: 'Next roll distance is halved!',

    drawerHandle: 'Cards & Agimat',
    roleBtn: 'Role',
    peekRole: 'Peek',
    sumpaBtn: 'Sumpa',
    peekSumpa: 'Peek',
    shieldBadge: 'Shielded (Anting-Anting)',
    accuseBtn: 'Accuse the Impostor',
    accuseTooltip: 'Can only be used once in the entire game!',
    endTurnBtn: 'End Turn ➔',
    emptyHand: 'You do not hold any Biyaya cards yet. Earn them by passing Pagsubok or through Kapalaran!',
    useCardBtn: 'USE CARD',
    cannotPlayBtn: 'CANNOT PLAY NOW',
    targetLabel: 'Target:',
    hideSecret: 'Hide',

    tabChat: 'Chat & Logs',
    tabPilgrims: 'Pilgrims',
    chatPlaceholder: 'Send a message...',
    tilePositionLabel: 'Position: Tile #',
    cardsCountLabel: 'Cards',
    actingBadge: 'ACTING',
    hostBadge: 'HOST',
    botBadge: 'AI',
    accusationChatTitle: '🚨 IMPOSTOR ACCUSATION',

    gateModalTitle: 'Pintuan ng Diwaling',
    gateModalSubtitle: 'Gate Unsealing Challenge',
    gateModalDesc: 'The Diwaling Guardian challenges your fellowship! Who among you bears the matching Sumpa curse required to unlock the gate?',
    gateCluePrefix: 'Clue from the Diwaling:',
    gateVotePrompt: 'Select the suspected player:',
    gateVoteBtn: 'Submit Vote',
    gateVotedStatus: 'Your vote has been cast. Waiting for fellow pilgrims...',

    pagsubokTitle: 'Pagsubok of Ancestral Wisdom',
    pagsubokSubtitle: 'Folklore & Mythology Trial',
    pagsubokNotice: 'Reward: 1 Biyaya Card. Penalty on Failure: Skip next turn.',
    pagsubokSubmitBtn: 'Submit Answer',
    pagsubokInputPlaceholder: 'Type your answer...',

    kapalaranTitle: 'Gulong ng Kapalaran',
    kapalaranSubtitle: 'Wheel of Fate & Dilemmas',
    kapalaranPrompt: 'Choose one of the following paths:',

    accusationTitle: 'Accuse the Impostor',
    accusationWarning: '⚠️ Warning: You can only perform this ONCE in the entire match! If CORRECT: You instantly advance to Aetherya (Tile 50) and eliminate the Impostor. If WRONG: You return to Start (Tile 0) and cannot move next round!',
    accusationPrompt: 'Who among the pilgrims is the true IMPOSTOR?',
    accusationConfirmBtn: 'Confirm Accusation!',
    cancelBtn: 'Cancel',

    victoryAninagTitle: 'VICTORY OF THE ANINAG!',
    victoryImpostorTitle: 'VICTORY OF THE IMPOSTOR!',
    victoryAninagDesc: 'The faithful Aninag pilgrims have successfully reached Aetherya, triumphing over darkness, trials, and secret Sumpa!',
    victoryImpostorDesc: 'The Impostor deceived the fellowship and claimed Aetherya first or eliminated those who stood in their way!',
    winnerLabel: 'Victor:',
    playAgainBtn: 'Journey Again (Lobby)',

    rulesModalTitle: 'Guide & Rules: Athanasia',
    tabLore: 'Lore & Story',
    tabTurnOrder: 'Turn Order',
    tabRoles: 'Roles & Impostor',
    tabGates: 'Diwaling Gates',
    tabCardTypes: 'Card Decks',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('athanasia_lang') as Language) || 'tl';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('athanasia_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tl' ? 'en' : 'tl');
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
