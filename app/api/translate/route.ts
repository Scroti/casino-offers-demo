/**
 * Translation API endpoint
 * 
 * This endpoint handles translation requests from the frontend.
 * It supports multiple translation providers:
 * - Google Translate API
 * - DeepL API
 * - LibreTranslate (public API)
 */

import { NextRequest, NextResponse } from 'next/server';

type TranslationProvider = 'google' | 'deepl' | 'libretranslate';

interface TranslateRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
  provider?: TranslationProvider;
}

/**
 * Translate using Google Translate API
 * Requires GOOGLE_TRANSLATE_API_KEY in environment variables
 */
async function translateWithGoogle(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Translate API key not configured');
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      target: targetLang,
      source: sourceLang,
    }),
  });

  if (!response.ok) {
    throw new Error('Google Translate API error');
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

/**
 * Translate using DeepL API
 * Requires DEEPL_API_KEY in environment variables
 */
async function translateWithDeepL(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  
  if (!apiKey) {
    throw new Error('DeepL API key not configured');
  }

  const url = 'https://api-free.deepl.com/v2/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang.toUpperCase(),
      source_lang: sourceLang.toUpperCase(),
    }),
  });

  if (!response.ok) {
    throw new Error('DeepL API error');
  }

  const data = await response.json();
  return data.translations[0].text;
}

/**
 * Translate using LibreTranslate (public API, rate limited)
 * No API key required, but rate limited
 */
async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const url = 'https://libretranslate.com/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  if (!response.ok) {
    throw new Error('LibreTranslate API error');
  }

  const data = await response.json();
  return data.translatedText;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    const { text, targetLang, sourceLang = 'en', provider = 'libretranslate' } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text, targetLang' },
        { status: 400 }
      );
    }

    // Don't translate if same language
    if (targetLang === sourceLang) {
      return NextResponse.json({ translatedText: text });
    }

    let translatedText: string;

    switch (provider) {
      case 'google':
        translatedText = await translateWithGoogle(text, targetLang, sourceLang);
        break;
      case 'deepl':
        translatedText = await translateWithDeepL(text, targetLang, sourceLang);
        break;
      case 'libretranslate':
        translatedText = await translateWithLibreTranslate(text, targetLang, sourceLang);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported provider: ${provider}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}

