/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tl';

export interface Translations {
  // Navigation
  gameTitle: string;
  gameSubtitle: string;
  lobby: string;
  mapEditor: string;
  rules: string;
  profile: string;
  admin: string;
  leaveRoom: string;
  roomCode: string;
  copiedCode: string;
  musicOn: string;
  musicOff: string;
  tileMapView: string;
  trackView: string;

  // Lobby
  createRoom: string;
  joinRoom: string;
  roomName: string;
  hostName: string;
  maxPlayers: string;
  fillWithBots: string;
  selectMap: string;
  createButton: string;
  joinButton: string;
  enterRoomCode: string;
  playerName: string;
  publicSanctuaries: string;
  refreshList: string;
  noRoomsFound: string;
  playersInLobby: string;
  waitingForHost: string;
  startGame: string;
  needMorePlayers: string;
  addAiCompanion: string;
  kickPlayer: string;
  kickConfirm: string;
  kickedToast: string;

  // Game Board & Controls
  yourTurn: string;
  waitingTurn: string;
  rollDice: string;
  rolling: string;
  endTurn: string;
  accuseImpostor: string;
  accuseBtn: string;
  biyayaHand: string;
  noCardsInHand: string;
  gateChallengeActive: string;
  turnTimer: string;
  activeTurnPlayer: string;
  historyLog: string;
  eliminated: string;
  skipNextTurn: string;
  shieldActive: string;

  // Chat
  chatTab: string;
  pilgrimsTab: string;
  chatPlaceholder: string;
  send: string;
  quickReactions: string[];

  // Profile Editor
  profileTitle: string;
  pilgrimName: string;
  characterTitle: string;
  avatarChoice: string;
  uploadPhoto: string;
  orImageUrl: string;
  saveProfile: string;
  profileSaved: string;

  // Rules Modal
  rulesTitle: string;
  rulesTabStory: string;
  rulesTabRealms: string;
  rulesTabCards: string;
  rulesTabMechanics: string;
  close: string;

  // Admin Modal
  adminTitle: string;
  systemPassword: string;
  unlockAdmin: string;
  cardsTab: string;
  builderTab: string;
  assetsTab: string;
  backupTab: string;

  // Map Editor
  mapEditorTitle: string;
  mapEditorSubtitle: string;
  toolDaan: string;
  toolPagsubok: string;
  toolKapalaran: string;
  toolGate: string;
  toolFinale: string;
  toolEraser: string;
  orderNumbers: string;
  undo: string;
  clearAll: string;
  saveServer: string;
  testPlay: string;
  copyLayout: string;
  pasteLayout: string;
  layoutCopied: string;
  layoutLoaded: string;
  invalidLayout: string;
  quotaTitle: string;
  quotaDone: string;
  quotaOver: string;
  mapNameLabel: string;
  mapDescLabel: string;
  saveSuccess: string;

  // Modals
  gateChallengeTitle: string;
  gateVotePrompt: string;
  voteButton: string;
  voted: string;
  pagsubokTitle: string;
  submitAnswer: string;
  kapalaranTitle: string;
  chooseFate: string;
  accusationTitle: string;
  accusationPrompt: string;
  accuseConfirm: string;
  cancel: string;
  victoryTitle: string;
  victoryAninag: string;
  victoryImpostor: string;
  playAgain: string;
}

const translations: Record<Language, Translations> = {
  en: {
    gameTitle: 'ATHANASIA',
    gameSubtitle: 'Ang Hiwaga ng Diwa',
    lobby: 'Sanctuary Lobby',
    mapEditor: 'Map Editor',
    rules: 'Ancient Codex',
    profile: 'Pilgrim Profile',
    admin: 'Admin Balancer',
    leaveRoom: 'Leave Chamber',
    roomCode: 'Chamber Code',
    copiedCode: 'Chamber code copied to clipboard!',
    musicOn: 'Sound: On',
    musicOff: 'Sound: Off',
    tileMapView: 'Mystic Tile Map',
    trackView: 'Simple Track',

    createRoom: 'Create Sanctuary',
    joinRoom: 'Enter Chamber',
    roomName: 'Sanctuary Name',
    hostName: 'Pilgrim Name',
    maxPlayers: 'Max Pilgrims',
    fillWithBots: 'Auto-fill remaining slots with AI Companions',
    selectMap: 'Select Journey Map',
    createButton: 'Embark Journey',
    joinButton: 'Enter Chamber',
    enterRoomCode: 'Enter 5-Letter Code',
    playerName: 'Your Pilgrim Name',
    publicSanctuaries: 'Available Sanctuaries',
    refreshList: 'Refresh List',
    noRoomsFound: 'No active sanctuaries found. Create one to begin your pilgrimage!',
    playersInLobby: 'Pilgrims in Chamber',
    waitingForHost: 'Waiting for Host to begin...',
    startGame: 'Commence Pilgrimage',
    needMorePlayers: 'Need at least 2 pilgrims to begin',
    addAiCompanion: '+ Add AI Companion',
    kickPlayer: 'Expel from chamber',
    kickConfirm: 'Expel this pilgrim from the chamber?',
    kickedToast: 'You were expelled from the sanctuary chamber by the Host.',

    yourTurn: "It's your turn!",
    waitingTurn: "Waiting for turn...",
    rollDice: 'Cast Movement Die',
    rolling: 'Rolling die...',
    endTurn: 'Conclude Turn',
    accuseImpostor: 'Unmask Impostor',
    accuseBtn: 'Accuse',
    biyayaHand: 'Blessings Hand (Biyaya)',
    noCardsInHand: 'No Biyaya cards in hand. Complete Pagsubok challenges or Kapalaran trials to earn blessings.',
    gateChallengeActive: 'Diwaling Guardian Gate Challenge Active',
    turnTimer: 'Seconds Remaining',
    activeTurnPlayer: 'Current Pilgrim Turn',
    historyLog: 'Chronicle of Diwa',
    eliminated: 'Eliminated',
    skipNextTurn: 'Turn Skipped',
    shieldActive: 'Anting-Anting Shield Active',

    chatTab: 'Chat & Chronicle',
    pilgrimsTab: 'Pilgrims',
    chatPlaceholder: 'Send a message or whisper...',
    send: 'Send',
    quickReactions: [
      'Tabi-tabi po! 🌿',
      'Who is the Impostor? 👀',
      'Beware the Curse! ⚠️',
      'Forward to Aetherya! 🏆',
      'Stay strong, Aninag! ✨',
    ],

    profileTitle: 'Pilgrim Profile Editor',
    pilgrimName: 'Pilgrim Name',
    characterTitle: 'Character Title',
    avatarChoice: 'Talisman Avatar',
    uploadPhoto: 'Upload Custom Avatar',
    orImageUrl: 'Or Paste Image URL',
    saveProfile: 'Save Profile',
    profileSaved: 'Pilgrim profile saved to cookies & talisman.',

    rulesTitle: 'The Ancient Codex & Rules',
    rulesTabStory: 'Lore & Origin',
    rulesTabRealms: 'The 5 Realms',
    rulesTabCards: 'Sacred Decks',
    rulesTabMechanics: 'Trial Rules',
    close: 'Close',

    adminTitle: 'Sanctuary Balancer & Deck Crafting',
    systemPassword: 'Admin Password',
    unlockAdmin: 'Unlock Sacred Vault',
    cardsTab: 'Card Library',
    builderTab: 'Modular Builder',
    assetsTab: 'Avatars & Art',
    backupTab: 'Backup & Restore',

    mapEditorTitle: 'Aetherya Map Template Engine',
    mapEditorSubtitle: '1700×1700 Triangular & Hexagonal Lattice Editor with Real-Time Quota Meters',
    toolDaan: '1: Daan',
    toolPagsubok: '2: Pagsubok',
    toolKapalaran: '3: Kapalaran',
    toolGate: '4: Diwaling Gate',
    toolFinale: '5: Aetherya Finale',
    toolEraser: '6: Eraser',
    orderNumbers: 'Order Numbers',
    undo: 'Undo (Ctrl+Z)',
    clearAll: 'Clear Grid',
    saveServer: 'Save to Server',
    testPlay: 'Test Play',
    copyLayout: 'Copy Layout JSON',
    pasteLayout: 'Load Pasted Layout',
    layoutCopied: 'Layout JSON copied to clipboard!',
    layoutLoaded: 'Custom layout loaded successfully!',
    invalidLayout: 'Invalid map layout data format.',
    quotaTitle: 'Territory Quotas (Real-time)',
    quotaDone: 'Quota Fulfilled',
    quotaOver: 'Over Quota Limit',
    mapNameLabel: 'Map Title',
    mapDescLabel: 'Description',
    saveSuccess: 'Map saved to server library and local storage!',

    gateChallengeTitle: 'Diwaling Gate Guardian Trial',
    gateVotePrompt: 'Identify which companion bears the Sumpa matching the Diwaling clue:',
    voteButton: 'Point Suspicion',
    voted: 'Vote Recorded',
    pagsubokTitle: 'Trial of Wisdom & Wit (Pagsubok)',
    submitAnswer: 'Proclaim Answer',
    kapalaranTitle: 'Crossroads of Destiny (Kapalaran)',
    chooseFate: 'Choose your path wisely:',
    accusationTitle: 'Solemn Accusation of the Impostor',
    accusationPrompt: 'Beware: A correct unmasking carries you straight to Aetherya; a false claim casts you back to the start!',
    accuseConfirm: 'Proclaim Traitor',
    cancel: 'Withdraw',
    victoryTitle: 'Ascension to Aetherya',
    victoryAninag: 'The Aninag restored the light of Diwa to the archipelago!',
    victoryImpostor: 'The Karimlan prevailed! The Impostor sabotaged the pilgrimage!',
    playAgain: 'Return to Sanctuary',
  },
  tl: {
    gameTitle: 'ATHANASIA',
    gameSubtitle: 'Ang Hiwaga ng Diwa',
    lobby: 'Silid ng Paglalakbay',
    mapEditor: 'Paggawa ng Mapa',
    rules: 'Alamat at Tuntunin',
    profile: 'Pagkakakilanlan',
    admin: 'Pangasiwaan (Admin)',
    leaveRoom: 'Lumabas sa Silid',
    roomCode: 'Kodigo ng Silid',
    copiedCode: 'Kopya na ang kodigo sa clipboard!',
    musicOn: 'Tugtog: Bukas',
    musicOff: 'Tugtog: Patay',
    tileMapView: 'Mahiwagang Tile Map',
    trackView: 'Payak na Track',

    createRoom: 'Lumikha ng Silid',
    joinRoom: 'Sumali sa Silid',
    roomName: 'Pangalan ng Silid',
    hostName: 'Pangalan ng Manlalakbay',
    maxPlayers: 'Dami ng Manlalakbay',
    fillWithBots: 'Punuin ng AI Kasama ang bakanteng pwesto',
    selectMap: 'Pumili ng Mapa',
    createButton: 'Simulan ang Silid',
    joinButton: 'Pumasok sa Silid',
    enterRoomCode: 'Ilagay ang 5-Letrang Kodigo',
    playerName: 'Pangalan mo sa Laro',
    publicSanctuaries: 'Mga Bukas na Silid',
    refreshList: 'Sariwain ang Talaan',
    noRoomsFound: 'Walang bukas na silid ngayon. Lumikha ng bago upang magsimula!',
    playersInLobby: 'Mga Kasamang Manlalakbay',
    waitingForHost: 'Naghihintay sa Host bago magsimula...',
    startGame: 'Simulan ang Paglalakbay',
    needMorePlayers: 'Kailangan ng hindi bababa sa 2 manlalakbay',
    addAiCompanion: '+ Magdagdag ng AI Kasama',
    kickPlayer: 'Palabasin sa silid',
    kickConfirm: 'Nais mo bang palabasin ang manlalakbay na ito?',
    kickedToast: 'Pinaalis ka ng Host mula sa silid ng paglalakbay.',

    yourTurn: 'Oras mo nang tumira!',
    waitingTurn: 'Naghihintay sa tira ng iba...',
    rollDice: 'Pagulungin ang Dice',
    rolling: 'Gumugulong ang dice...',
    endTurn: 'Tapusin ang Tira',
    accuseImpostor: 'Ibunyag ang Impostor',
    accuseBtn: 'Paratangan',
    biyayaHand: 'Mga Hawak na Biyaya',
    noCardsInHand: 'Walang hawak na Biyaya. Manalo sa Pagsubok o Kapalaran upang magtamo nito.',
    gateChallengeActive: 'Bukas ang Hamon sa Pintuan ng Diwaling',
    turnTimer: 'Natitirang Segundo',
    activeTurnPlayer: 'Kasalukuyang Tumitira',
    historyLog: 'Kasaysayan ng Diwa',
    eliminated: 'Pinaslang / Natalo',
    skipNextTurn: 'Laktaw na Tira',
    shieldActive: 'May Kalasag na Anting-Anting',

    chatTab: 'Usapan & Tala',
    pilgrimsTab: 'Manlalakbay',
    chatPlaceholder: 'Magpadala ng mensahe...',
    send: 'Ipadala',
    quickReactions: [
      'Tabi-tabi po! 🌿',
      'Sino ang Impostor? 👀',
      'Ingat sa Sumpa! ⚠️',
      'Sulong sa Aetherya! 🏆',
      'Laban lang, Aninag! ✨',
    ],

    profileTitle: 'I-edit ang Manlalakbay',
    pilgrimName: 'Pangalan ng Manlalakbay',
    characterTitle: 'Pamagat o Bansag',
    avatarChoice: 'Larawan ng Agimat',
    uploadPhoto: 'Mag-upload ng Sariling Larawan',
    orImageUrl: 'O Maglagay ng Image URL',
    saveProfile: 'I-save ang Profile',
    profileSaved: 'Nai-save ang pagkakakilanlan sa cookies at talisman.',

    rulesTitle: 'Ang Banal na Tuntunin ng Diwa',
    rulesTabStory: 'Alamat at Kasaysayan',
    rulesTabRealms: 'Ang 5 Lupain',
    rulesTabCards: 'Mga Banal na Baraha',
    rulesTabMechanics: 'Hamon at Tuntunin',
    close: 'Isara',

    adminTitle: 'Pangasiwaan at Paggawa ng Baraha',
    systemPassword: 'Lihim na Password ng Admin',
    unlockAdmin: 'Buksan ang Banal na Kaban',
    cardsTab: 'Talaan ng Baraha',
    builderTab: 'Paggawa ng Epekto',
    assetsTab: 'Larawan at Sigil',
    backupTab: 'Kopya at Pagbabalik',

    mapEditorTitle: 'Aetherya Map Template Engine',
    mapEditorSubtitle: '1700×1700 Triangular at Hexagonal Lattice Editor na may Sukatan ng Lupain',
    toolDaan: '1: Daan',
    toolPagsubok: '2: Pagsubok',
    toolKapalaran: '3: Kapalaran',
    toolGate: '4: Tarangkahan',
    toolFinale: '5: Aetherya Finale',
    toolEraser: '6: Pambura',
    orderNumbers: 'Numero ng Hakbang',
    undo: 'Ibalik (Ctrl+Z)',
    clearAll: 'Burahin Lahat',
    saveServer: 'I-save sa Server',
    testPlay: 'Subukang Laruin',
    copyLayout: 'Kopyahin ang JSON',
    pasteLayout: 'I-load ang JSON',
    layoutCopied: 'Nakopya na ang layout JSON sa clipboard!',
    layoutLoaded: 'Matagumpay na na-load ang mapa!',
    invalidLayout: 'Hindi wasto ang JSON ng mapa.',
    quotaTitle: 'Sukatan ng Lupain (Real-time)',
    quotaDone: 'Kumpleto ang Sukat',
    quotaOver: 'Lumagpas sa Takdang Bilang',
    mapNameLabel: 'Pangalan ng Mapa',
    mapDescLabel: 'Paglalarawan',
    saveSuccess: 'Nai-save ang mapa sa server at lokal na imbakan!',

    gateChallengeTitle: 'Pintuan ng Diwaling Hamon',
    gateVotePrompt: 'Tukuyin kung sino sa inyo ang may hawak ng Sumpa ayon sa Pahiwatig:',
    voteButton: 'Ituro ang Hinala',
    voted: 'Naitala ang Boto',
    pagsubokTitle: 'Pagsubok sa Talino at Bugtong',
    submitAnswer: 'Ipahayag ang Sagot',
    kapalaranTitle: 'Sangandaan ng Kapalaran',
    chooseFate: 'Piliin ang iyong landas:',
    accusationTitle: 'Banal na Paratang sa Impostor',
    accusationPrompt: 'Mag-ingat: Kapag tama, mararating agad ang Aetherya; kapag mali, babalik sa simula!',
    accuseConfirm: 'Iparatang ang Kataksilan',
    cancel: 'Huwag Ituloy',
    victoryTitle: 'Tagumpay sa Aetherya',
    victoryAninag: 'Naibalik ng mga Aninag ang liwanag ng Diwa!',
    victoryImpostor: 'Nagtagumpay ang Karimlan sa pamamagitan ng Impostor!',
    playAgain: 'Muling Maglakbay',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('athanasia_language');
    return saved === 'tl' ? 'tl' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('athanasia_language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
