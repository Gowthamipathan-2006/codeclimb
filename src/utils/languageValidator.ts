
// Language-specific syntax validation
// Returns an error message if the code doesn't match the expected language, or null if valid

const languagePatterns: Record<string, { required: RegExp[]; forbidden: RegExp[]; name: string }> = {
  c: {
    name: 'C',
    required: [/(printf|scanf|#include|int\s+main|void\s+main|return\s+0)/],
    forbidden: [/\bprint\s*\(/, /\bcout\s*<</, /\bSystem\.out/, /\bconsole\.log/, /\bdef\s+/, /\bclass\s+\w+\s*:/],
  },
  'c++': {
    name: 'C++',
    required: [/(cout|cin|#include|int\s+main|void\s+main|std::|printf)/],
    forbidden: [/\bprint\s*\((?!f)/, /\bSystem\.out/, /\bconsole\.log/, /\bdef\s+/, /\bclass\s+\w+\s*:/],
  },
  java: {
    name: 'Java',
    required: [/(System\.out|public\s+class|public\s+static\s+void\s+main|import\s+java)/],
    forbidden: [/\bprint\s*\((?!ln)/, /\bprintf\s*\(/, /\bcout/, /\bconsole\.log/, /\bdef\s+/],
  },
  python: {
    name: 'Python',
    required: [/(print\s*\(|def\s+|import\s+|input\s*\(|class\s+\w+)/],
    forbidden: [/\bprintf\s*\(/, /\bcout/, /\bSystem\.out/, /\bconsole\.log/, /int\s+main\s*\(/],
  },
  javascript: {
    name: 'JavaScript',
    required: [/(console\.log|function\s+|const\s+|let\s+|var\s+|=>|document\.)/],
    forbidden: [/\bprintf\s*\(/, /\bcout/, /\bSystem\.out/, /\bprint\s*\(/, /int\s+main\s*\(/],
  },
  html: {
    name: 'HTML',
    required: [/(<html|<div|<p|<h[1-6]|<body|<head|<span|<a\s|<img|<form|<input|<table|<ul|<ol|<li|<!DOCTYPE)/i],
    forbidden: [],
  },
  css: {
    name: 'CSS',
    required: [/[{}\s]*[\w-]+\s*:\s*[^;]+;/],
    forbidden: [/\bprintf\s*\(/, /\bconsole\.log/, /\bprint\s*\(/],
  },
};

export function validateLanguage(code: string, language: string): string | null {
  const lang = language.toLowerCase();
  const patterns = languagePatterns[lang];

  if (!patterns) return null; // No validation for unknown languages

  const trimmedCode = code.trim();
  if (!trimmedCode) return null;

  // Check if any forbidden patterns are found
  for (const forbidden of patterns.forbidden) {
    if (forbidden.test(trimmedCode)) {
      return `Please write the solution using ${patterns.name} syntax. Your code appears to use a different programming language.`;
    }
  }

  // Check if at least one required pattern is found
  const hasRequired = patterns.required.some(pattern => pattern.test(trimmedCode));
  if (!hasRequired && trimmedCode.length > 20) {
    return `Please write the solution using the ${patterns.name} language format.`;
  }

  return null;
}
