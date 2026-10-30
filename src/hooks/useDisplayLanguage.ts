import { useEffect, useState } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/voiceNarrationData';

const DISPLAY_LANGUAGE_STORAGE_KEY = 'ctc_display_language_v1';
const DISPLAY_LANGUAGE_EVENT = 'ctc_display_language_changed';
const translationsByLanguage: Partial<Record<SupportedLanguage, Record<string, string>>> = {
  hi: {
    Home: 'होम', Dashboard: 'डैशबोर्ड', Agreements: 'समझौते', Menu: 'मेन्यू',
    Settings: 'सेटिंग्स', 'Legal & Compliance': 'कानूनी और अनुपालन',
    'Open User Profile': 'उपयोगकर्ता प्रोफ़ाइल खोलें', 'Open Settings': 'सेटिंग्स खोलें',
    'Preferences & Languages': 'प्राथमिकताएँ और भाषाएँ', 'Display Language': 'ऐप की भाषा',
    'Audio Explainer Language (आवाज़ की भाषा):': 'ऑडियो भाषा:',
    'Select Audio Language': 'ऑडियो भाषा चुनें', Search: 'खोजें',
    'Search an Agreement or Affidavit': 'समझौता या शपथपत्र खोजें',
    'Voice input is not supported by this browser. Please type your query.': 'इस ब्राउज़र में आवाज़ से खोज उपलब्ध नहीं है। कृपया अपना सवाल लिखें।'
  },
  ml: { Home: 'ഹോം', Dashboard: 'ഡാഷ്ബോർഡ്', Agreements: 'കരാറുകൾ', Menu: 'മെനു', Settings: 'ക്രമീകരണങ്ങൾ', 'Display Language': 'ആപ്പ് ഭാഷ' },
  te: { Home: 'హోమ్', Dashboard: 'డాష్‌బోర్డ్', Agreements: 'ఒప్పందాలు', Menu: 'మెను', Settings: 'సెట్టింగ్‌లు', 'Display Language': 'యాప్ భాష' },
  pa: { Home: 'ਮੁੱਖ ਪੰਨਾ', Dashboard: 'ਡੈਸ਼ਬੋਰਡ', Agreements: 'ਸਮਝੌਤੇ', Menu: 'ਮੀਨੂ', Settings: 'ਸੈਟਿੰਗਾਂ', 'Display Language': 'ਐਪ ਭਾਸ਼ਾ' },
  ta: { Home: 'முகப்பு', Dashboard: 'டாஷ்போர்டு', Agreements: 'ஒப்பந்தங்கள்', Menu: 'மெனு', Settings: 'அமைப்புகள்', 'Display Language': 'செயலி மொழி' },
  mr: { Home: 'मुख्यपृष्ठ', Dashboard: 'डॅशबोर्ड', Agreements: 'करार', Menu: 'मेनू', Settings: 'सेटिंग्ज', 'Display Language': 'अॅपची भाषा' },
  gu: { Home: 'હોમ', Dashboard: 'ડેશબોર્ડ', Agreements: 'કરારો', Menu: 'મેનુ', Settings: 'સેટિંગ્સ', 'Display Language': 'એપની ભાષા' },
  bn: { Home: 'হোম', Dashboard: 'ড্যাশবোর্ড', Agreements: 'চুক্তি', Menu: 'মেনু', Settings: 'সেটিংস', 'Display Language': 'অ্যাপের ভাষা' },
  kn: { Home: 'ಮುಖಪುಟ', Dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', Agreements: 'ಒಪ್ಪಂದಗಳು', Menu: 'ಮೆನು', Settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', 'Display Language': 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ' },
  en: {}
};

type TranslationTarget = {
  original: string;
  apply: (translation: string) => void;
  isCurrent: () => boolean;
};
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
let activeDisplayLanguage: SupportedLanguage = 'en';

export function getStoredDisplayLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
    if (saved && SUPPORTED_LANGUAGES.some((language) => language.code === saved)) return saved;
  } catch {}
  return 'en';
}

export function setStoredDisplayLanguage(language: SupportedLanguage) {
  try {
    localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, language);
    window.dispatchEvent(new CustomEvent(DISPLAY_LANGUAGE_EVENT, { detail: { language } }));
  } catch {}
}

function localTranslation(text: string, language: SupportedLanguage): string | undefined {
  return translationsByLanguage[language]?.[text.trim()];
}

async function translateBatch(texts: string[], language: SupportedLanguage): Promise<string[]> {
  try {
    const response = await fetch('/api/gemini/translate-ui', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, language })
    });
    if (!response.ok) return texts;
    const payload = await response.json();
    if (!Array.isArray(payload.translations)) return texts;
    return texts.map((text, index) => {
      const translated = payload.translations[index];
      return typeof translated === 'string' && translated.trim() ? translated : text;
    });
  } catch {
    return texts;
  }
}

function preserveWhitespace(original: string, translation: string) {
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  return `${leading}${translation.trim()}${trailing}`;
}

async function translateTargets(targets: TranslationTarget[], language: SupportedLanguage) {
  for (const target of targets) {
    const knownTranslation = localTranslation(target.original, language);
    if (knownTranslation) target.apply(knownTranslation);
  }

  const remoteTargets = targets.filter((target) => !localTranslation(target.original, language));
  for (let offset = 0; offset < remoteTargets.length; offset += 40) {
    const batch = remoteTargets.slice(offset, offset + 40);
    const translated = await translateBatch(batch.map((target) => target.original), language);
    if (activeDisplayLanguage !== language) return;
    batch.forEach((target, index) => {
      if (target.isCurrent()) target.apply(translated[index]);
    });
  }
}

function translateSubtree(root: Node, language: SupportedLanguage) {
  const targets: TranslationTarget[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const content = node.textContent?.trim() || '';
      if (!parent || !content || content.length > 240 || content.length < 2) return NodeFilter.FILTER_REJECT;
      if (parent.closest('script,style,noscript,svg,[data-display-language-ignore],[contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
      if (!/[\p{L}]/u.test(content)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const textNodes: Text[] = root.nodeType === Node.TEXT_NODE ? [root as Text] : [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);
  for (const textNode of textNodes) {
    const parent = textNode.parentElement;
    const content = textNode.data.trim();
    if (!parent || !content || content.length > 240 || content.length < 2) continue;
    if (parent.closest('script,style,noscript,svg,[data-display-language-ignore],[contenteditable="true"]')) continue;
    if (!/[\p{L}]/u.test(content)) continue;
    const original = originalText.get(textNode) ?? textNode.data;
    originalText.set(textNode, original);
    if (language === 'en') textNode.data = original;
    else targets.push({
      original: original.trim(),
      apply: (translation) => { textNode.data = preserveWhitespace(original, translation); },
      isCurrent: () => textNode.isConnected && originalText.get(textNode) === original
    });
  }

  const elements: Element[] = root.nodeType === Node.ELEMENT_NODE ? [root as Element] : [];
  if (root instanceof Element) elements.push(...Array.from(root.querySelectorAll('*')));
  for (const element of elements) {
    if (element.closest('script,style,noscript,svg,[data-display-language-ignore],[contenteditable="true"]')) continue;
    const originals = originalAttributes.get(element) || new Map<string, string>();
    for (const attribute of ['placeholder', 'aria-label', 'title']) {
      const current = element.getAttribute(attribute);
      const original = originals.get(attribute) ?? current;
      if (!original || original.length > 240 || original.length < 2) continue;
      originals.set(attribute, original);
      if (language === 'en') element.setAttribute(attribute, original);
      else targets.push({
        original,
        apply: (translation) => element.setAttribute(attribute, translation.trim()),
        isCurrent: () => element.isConnected && originals.get(attribute) === original
      });
    }
    originalAttributes.set(element, originals);
  }
  if (language !== 'en') void translateTargets(targets, language);
}

export function useDisplayLanguage(options: { translateDom?: boolean } = {}) {
  const [language, setLanguageState] = useState<SupportedLanguage>(getStoredDisplayLanguage);

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const nextLanguage = (event as CustomEvent<{ language?: SupportedLanguage }>).detail?.language;
      if (nextLanguage && SUPPORTED_LANGUAGES.some((item) => item.code === nextLanguage)) {
        activeDisplayLanguage = nextLanguage;
        setLanguageState(nextLanguage);
      }
    };
    window.addEventListener(DISPLAY_LANGUAGE_EVENT, syncLanguage);
    return () => window.removeEventListener(DISPLAY_LANGUAGE_EVENT, syncLanguage);
  }, []);

  useEffect(() => {
    if (!options.translateDom) return;
    activeDisplayLanguage = language;
    document.documentElement.lang = language;
    translateSubtree(document.body, language);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            translateSubtree(node, language);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, options.translateDom]);

  return {
    language,
    setLanguage: setStoredDisplayLanguage,
    t: (key: string) => localTranslation(key, language) || key
  };
}