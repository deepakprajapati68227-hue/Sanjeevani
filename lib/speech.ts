import { SupportedLanguage } from "./types";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voicePrefixes: string[];
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    voicePrefixes: ["en-IN", "en-GB", "en-US", "en"],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    voicePrefixes: ["hi-IN", "hi", "en-IN"],
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    voicePrefixes: ["mr-IN", "mr", "hi-IN", "hi"],
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    voicePrefixes: ["te-IN", "te", "hi-IN"],
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    voicePrefixes: ["ta-IN", "ta", "hi-IN"],
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    voicePrefixes: ["bn-IN", "bn-BD", "bn", "hi-IN"],
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    voicePrefixes: ["gu-IN", "gu", "hi-IN"],
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    voicePrefixes: ["kn-IN", "kn", "hi-IN"],
  },
];

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

// Global reference to prevent Chrome GC from dropping active utterance
let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentChunks: string[] = [];
let currentChunkIndex = 0;
let isCurrentlySpeaking = false;
let currentOptions: TTSOptions = {};
let currentLangCode = "en";

export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Finds the optimal voice for the given language code
 */
export function findOptimalVoice(langCode: string): SpeechSynthesisVoice | null {
  if (!isTTSSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  const prefixes = langConfig ? langConfig.voicePrefixes : [langCode, "en-IN", "en"];

  for (const prefix of prefixes) {
    const directMatch = voices.find(
      (v) => v.lang.toLowerCase() === prefix.toLowerCase() || v.lang.toLowerCase().replace("_", "-") === prefix.toLowerCase()
    );
    if (directMatch) return directMatch;
  }

  for (const prefix of prefixes) {
    const baseLang = prefix.split("-")[0].toLowerCase();
    const partialMatch = voices.find((v) => v.lang.toLowerCase().startsWith(baseLang));
    if (partialMatch) return partialMatch;
  }

  // Fallback to any Indian voice or first available
  const indianFallback = voices.find((v) => v.lang.includes("IN") || v.name.toLowerCase().includes("india"));
  if (indianFallback) return indianFallback;

  return voices[0] || null;
}

/**
 * Splits text into natural sentence chunks for reliable playback without Chrome timeout
 */
function splitIntoChunks(text: string): string[] {
  // Strip special markdown symbols for cleaner pronunciation
  const clean = text
    .replace(/[#*_`~[\]]/g, "")
    .replace(/•/g, ". ")
    .replace(/📍|🚨|⚠️|📞|🔥|🌡️|💧|🏥|🛡️|✨/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  // Split on sentence boundaries including Hindi/Marathi danda '।'
  const rawChunks = clean.split(/(?<=[.?!।\n])\s+/);
  const result: string[] = [];

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (trimmed.length > 180) {
      // Split large chunk by comma or semicolon
      const sub = trimmed.split(/(?<=[,;])\s+/);
      for (const s of sub) {
        if (s.trim()) result.push(s.trim());
      }
    } else {
      result.push(trimmed);
    }
  }

  return result.length > 0 ? result : [clean];
}

function speakNextChunk(): void {
  if (!isTTSSupported() || currentChunkIndex >= currentChunks.length || !isCurrentlySpeaking) {
    isCurrentlySpeaking = false;
    activeUtterance = null;
    currentOptions.onEnd?.();
    return;
  }

  const chunk = currentChunks[currentChunkIndex];
  const utterance = new SpeechSynthesisUtterance(chunk);
  activeUtterance = utterance;

  const voice = findOptimalVoice(currentLangCode);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = currentLangCode === "hi" ? "hi-IN" : currentLangCode === "mr" ? "mr-IN" : "en-US";
  }

  utterance.rate = currentOptions.rate || 0.95;
  utterance.pitch = currentOptions.pitch || 1.0;
  utterance.volume = currentOptions.volume || 1.0;

  utterance.onend = () => {
    currentChunkIndex++;
    if (isCurrentlySpeaking) {
      speakNextChunk();
    }
  };

  utterance.onerror = (e) => {
    if (e.error !== "interrupted" && e.error !== "canceled") {
      console.warn("TTS chunk error:", e);
      currentOptions.onError?.(e);
    }
    currentChunkIndex++;
    if (isCurrentlySpeaking && currentChunkIndex < currentChunks.length) {
      speakNextChunk();
    } else {
      isCurrentlySpeaking = false;
      activeUtterance = null;
      currentOptions.onEnd?.();
    }
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("SpeechSynthesis error:", err);
    currentOptions.onError?.(err);
    isCurrentlySpeaking = false;
  }
}

/**
 * Speak text in the given language with speech synthesis
 */
export function speakText(text: string, langCode: string = "en", options: TTSOptions = {}): void {
  if (!isTTSSupported()) {
    console.warn("Speech synthesis not supported in this browser environment.");
    options.onError?.(new Error("TTS not supported"));
    return;
  }

  // Cancel any ongoing speech
  stopSpeaking();

  currentChunks = splitIntoChunks(text);
  if (currentChunks.length === 0) return;

  currentChunkIndex = 0;
  isCurrentlySpeaking = true;
  currentOptions = options;
  currentLangCode = langCode;

  options.onStart?.();
  speakNextChunk();
}

export function stopSpeaking(): void {
  if (!isTTSSupported()) return;
  isCurrentlySpeaking = false;
  currentChunks = [];
  currentChunkIndex = 0;
  activeUtterance = null;
  try {
    window.speechSynthesis.cancel();
  } catch (err) {
    // Ignore cancel errors
  }
}

export function pauseSpeaking(): void {
  if (!isTTSSupported()) return;
  try {
    window.speechSynthesis.pause();
  } catch (err) {
    // Ignore pause errors
  }
}

export function resumeSpeaking(): void {
  if (!isTTSSupported()) return;
  try {
    window.speechSynthesis.resume();
  } catch (err) {
    // Ignore resume errors
  }
}

export function getSpeakingStatus(): boolean {
  if (!isTTSSupported()) return false;
  return isCurrentlySpeaking || window.speechSynthesis.speaking;
}
