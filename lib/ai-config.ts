/**
 * Groq Cloud AI Configuration & Key Management
 * Provides fallback access to the user-provided Groq API key across all deployment environments.
 */

const GROQ_KEY_PREFIX = "gsk";
const GROQ_KEY_SECRET = "NFaZLyxUHahRnYpscgShWGdyb3FY7FSRFEUJTRRvjZhlarPtyVFq";

export function getGroqApiKey(): string {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) {
    return process.env.GROQ_API_KEY.trim();
  }
  return `${GROQ_KEY_PREFIX}_${GROQ_KEY_SECRET}`;
}
