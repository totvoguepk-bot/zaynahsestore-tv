'use client';

import React, { useState } from 'react';
import { ExternalLink, Zap } from '@/components/common/Icons';

interface AITabProps {
  aiEnabled: boolean;
  setAiEnabled: (val: boolean) => void;
  contentProvider: string;
  setContentProvider: (val: string) => void;
  contentModel: string;
  setContentModel: (val: string) => void;
  contentKeys: string;
  setContentKeys: (val: string) => void;
  visionProvider: string;
  setVisionProvider: (val: string) => void;
  visionModel: string;
  setVisionModel: (val: string) => void;
  visionKeys: string;
  setVisionKeys: (val: string) => void;
  aiTone: string;
  setAiTone: (val: string) => void;
  aiLanguage: string;
  setAiLanguage: (val: string) => void;
  aiCustomInstructions: string;
  setAiCustomInstructions: (val: string) => void;
  autoContentSeo: boolean;
  setAutoContentSeo: (val: boolean) => void;
  autoMediaAi: boolean;
  setAutoMediaAi: (val: boolean) => void;
  targetAudiences: string;
  setTargetAudiences: (val: string) => void;
  productTypes: string;
  setProductTypes: (val: string) => void;
  categoryDefaultTemplate: string;
  setCategoryDefaultTemplate: (val: string) => void;
  productDefaultTemplate: string;
  setProductDefaultTemplate: (val: string) => void;
  categoryDescriptionPrompt: string;
  setCategoryDescriptionPrompt: (val: string) => void;
  categoryDescriptionLimit: number;
  setCategoryDescriptionLimit: (val: number) => void;
  productDescriptionPrompt: string;
  setProductDescriptionPrompt: (val: string) => void;
  productDescriptionLimit: number;
  setProductDescriptionLimit: (val: number) => void;
  productShortPrompt: string;
  setProductShortPrompt: (val: string) => void;
  productShortLimit: number;
  setProductShortLimit: (val: number) => void;
}

const PROVIDERS = [
  { group: '🆓 FREE', options: ['groq', 'gemini', 'cerebras', 'mistral', 'cloudflare', 'nvidia', 'openrouter'] },
  { group: '💲 CHEAP', options: ['deepseek', 'together', 'fireworks', 'siliconflow', 'kimi', 'qwen'] },
  { group: '💎 PREMIUM', options: ['openai', 'anthropic', 'minimax'] }
];

const TEXT_MODELS: Record<string, string[]> = {
  // ── FREE PROVIDERS ──────────────────────────────────────────────
  groq: [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'llama3-8b-8192',
    'llama3-70b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
    'gemma-7b-it',
    'llama-3.3-70b-specdec',
    'llama-3.2-1b-preview',
    'llama-3.2-3b-preview',
    'llama-3.2-11b-text-preview',
    'llama-3.2-90b-text-preview',
    'deepseek-r1-distill-llama-70b',
    'qwen-qwq-32b',
    'mistral-saba-24b',
    'llama-4-scout-17b-16e-instruct',
    'llama-4-maverick-17b-128e-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'playai-tts'
  ],
  gemini: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-pro-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemma-3-27b-it',
    'gemma-3-12b-it',
    'gemma-3-4b-it',
    'gemma-3-1b-it'
  ],
  cerebras: [
    'llama-3.3-70b',
    'llama-3.1-8b',
    'llama-3.1-70b',
    'llama3-70b-8k',
    'llama3-8b-8k'
  ],
  mistral: [
    'mistral-small-latest',
    'mistral-small-2506',
    'mistral-small-2503',
    'open-mistral-nemo',
    'mistral-nemo-2407',
    'ministral-3b-latest',
    'ministral-8b-latest',
    'mistral-large-latest',
    'mistral-large-2411',
    'mistral-large-2407',
    'mistral-medium-latest',
    'mistral-medium-2505',
    'codestral-latest',
    'codestral-2405',
    'codestral-mamba-2407',
    'mathstral-temp-id',
    'magistral-small-2509',
    'magistral-medium-2509',
    'devstral-small-2505',
    'pixtral-large-2411',
    'pixtral-12b-2409'
  ],
  cloudflare: [
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    '@cf/meta/llama-3.3-70b-instruct',
    '@cf/meta/llama-3.1-70b-instruct',
    '@cf/meta/llama-3.1-8b-instruct',
    '@cf/meta/llama-3.2-3b-instruct',
    '@cf/meta/llama-3.2-1b-instruct',
    '@cf/meta/llama-4-scout-17b-16e-instruct',
    '@cf/google/gemma-3n-e4b-it',
    '@cf/google/gemma-3-12b-it',
    '@cf/google/gemma-2-2b-it',
    '@cf/qwen/qwen2.5-72b-instruct',
    '@cf/qwen/qwen2.5-coder-32b-instruct',
    '@cf/mistralai/mistral-7b-instruct-v0.2',
    '@cf/mistralai/mistral-small-3.1-24b-instruct',
    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
    '@cf/microsoft/phi-2'
  ],
  nvidia: [
    'meta/llama-3.3-70b-instruct',
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-8b-instruct',
    'meta/llama-4-maverick-17b-128e-instruct',
    'meta/llama-4-scout-17b-16e-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'nvidia/nemotron-4-340b-instruct',
    'nvidia/nemotron-mini-4b-instruct',
    'mistralai/mistral-large-2-instruct',
    'mistralai/mistral-nemo-12b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1',
    'mistralai/mixtral-8x22b-instruct-v0.1',
    'google/gemma-3-27b-it',
    'google/gemma-3-12b-it',
    'microsoft/phi-3-mini-128k-instruct',
    'microsoft/phi-3-medium-128k-instruct',
    'microsoft/phi-3.5-mini-instruct',
    'qwen/qwen2.5-72b-instruct',
    'qwen/qwen2.5-7b-instruct',
    'deepseek-ai/deepseek-r1',
    'deepseek-ai/deepseek-coder-6.7b-instruct'
  ],
  openrouter: [
    // Free
    'google/gemma-3-27b-it:free',
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    'meta-llama/llama-4-maverick:free',
    'meta-llama/llama-4-scout:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'deepseek/deepseek-r1:free',
    'deepseek/deepseek-chat:free',
    'deepseek/deepseek-v3-base:free',
    'mistralai/mistral-7b-instruct:free',
    'mistralai/mistral-nemo:free',
    'qwen/qwen3-235b-a22b:free',
    'qwen/qwen3-30b-a3b:free',
    'qwen/qwen3-8b:free',
    'qwen/qwen2.5-vl-7b-instruct:free',
    'microsoft/phi-4-reasoning-plus:free',
    'microsoft/phi-4-reasoning:free',
    'microsoft/phi-4-mini-reasoning:free',
    'thudm/glm-z1-32b:free',
    'thudm/glm-4-32b:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'openchat/openchat-7b:free',
    'huggingfaceh4/zephyr-7b-beta:free'
  ],
  // ── CHEAP PROVIDERS ──────────────────────────────────────────────
  deepseek: [
    'deepseek-chat',
    'deepseek-reasoner',
    'deepseek-coder'
  ],
  together: [
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    'meta-llama/Llama-4-Scout-17B-16E-Instruct',
    'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'mistralai/Mistral-7B-Instruct-v0.3',
    'Qwen/Qwen2.5-72B-Instruct-Turbo',
    'Qwen/QwQ-32B',
    'deepseek-ai/DeepSeek-R1',
    'deepseek-ai/DeepSeek-V3',
    'google/gemma-2-27b-it',
    'google/gemma-2-9b-it'
  ],
  fireworks: [
    'accounts/fireworks/models/llama-v3p3-70b-instruct',
    'accounts/fireworks/models/llama-v3p2-3b-instruct',
    'accounts/fireworks/models/llama-v3p1-8b-instruct',
    'accounts/fireworks/models/mixtral-8x7b-instruct',
    'accounts/fireworks/models/mixtral-8x22b-instruct',
    'accounts/fireworks/models/gemma2-9b-it',
    'accounts/fireworks/models/qwen2p5-72b-instruct',
    'accounts/fireworks/models/deepseek-r1',
    'accounts/fireworks/models/deepseek-v3'
  ],
  siliconflow: [
    'Qwen/Qwen3-235B-A22B',
    'Qwen/Qwen3-30B-A3B',
    'Qwen/Qwen2.5-72B-Instruct',
    'Qwen/Qwen2.5-32B-Instruct',
    'Qwen/Qwen2.5-7B-Instruct',
    'meta-llama/Meta-Llama-3.1-70B-Instruct',
    'meta-llama/Meta-Llama-3.1-8B-Instruct',
    'deepseek-ai/DeepSeek-R1',
    'deepseek-ai/DeepSeek-V3',
    'deepseek-ai/DeepSeek-V2.5',
    'THUDM/glm-4-9b-chat',
    '01-ai/Yi-1.5-34B-Chat-16K',
    'internlm/internlm2_5-20b-chat',
    'mistralai/Mistral-7B-Instruct-v0.2'
  ],
  kimi: [
    'moonshot-v1-8k',
    'moonshot-v1-32k',
    'moonshot-v1-128k',
    'kimi-latest',
    'kimi-thinking-preview'
  ],
  qwen: [
    'qwen3-235b-a22b',
    'qwen3-30b-a3b',
    'qwen3-32b',
    'qwen3-14b',
    'qwen3-8b',
    'qwen2.5-72b-instruct',
    'qwen2.5-32b-instruct',
    'qwen2.5-14b-instruct',
    'qwen2.5-7b-instruct',
    'qwq-32b',
    'qwen2.5-coder-32b-instruct',
    'qwen2.5-coder-7b-instruct'
  ],
  // ── PREMIUM PROVIDERS ───────────────────────────────────────────
  openai: [
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'o4-mini',
    'o3',
    'o3-mini',
    'o1',
    'o1-mini',
    'o1-preview'
  ],
  anthropic: [
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-3-5',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ],
  minimax: [
    'MiniMax-Text-01',
    'abab6.5s-chat',
    'abab6.5g-chat',
    'abab5.5-chat'
  ]
};

const VISION_MODELS: Record<string, string[]> = {
  // ── FREE PROVIDERS ──────────────────────────────────────────────
  groq: [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'llama-3.2-11b-vision-preview',
    'llama-3.2-90b-vision-preview',
    'llama-3.2-11b-vision-instruct',
    'llama-3.2-90b-vision-instruct'
  ],
  gemini: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ],
  cerebras: [
    'llama-3.2-11b-vision-instruct'
  ],
  mistral: [
    'pixtral-large-2411',
    'pixtral-12b-2409',
    'mistral-large-2411',
    'mistral-medium-2505'
  ],
  cloudflare: [
    '@cf/meta/llama-3.2-11b-vision-instruct',
    '@cf/meta/llama-4-scout-17b-16e-instruct',
    '@cf/mistralai/mistral-small-3.1-24b-instruct',
    '@cf/qwen/qwen2.5-vl-7b-instruct',
    '@cf/google/gemma-3-12b-it',
    '@cf/microsoft/phi-4-multimodal-instruct'
  ],
  nvidia: [
    'meta/llama-4-maverick-17b-128e-instruct',
    'meta/llama-4-scout-17b-16e-instruct',
    'meta/llama-3.2-90b-vision-instruct',
    'meta/llama-3.2-11b-vision-instruct',
    'nvidia/llama-3.1-nemotron-nano-vl-8b-v1',
    'nvidia/neva-22b',
    'google/paligemma',
    'microsoft/phi-3.5-vision-instruct',
    'microsoft/phi-4-multimodal-instruct',
    'mistralai/pixtral-12b-vision',
    'qwen/qwen2.5-vl-72b-instruct',
    'qwen/qwen2-vl-7b-instruct'
  ],
  openrouter: [
    'google/gemini-2.5-flash-preview:free',
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-4-maverick:free',
    'meta-llama/llama-4-scout:free',
    'meta-llama/llama-3.2-11b-vision-instruct:free',
    'qwen/qwen2.5-vl-7b-instruct:free',
    'microsoft/phi-4-multimodal-instruct:free'
  ],
  // ── CHEAP PROVIDERS ──────────────────────────────────────────────
  deepseek: [
    'deepseek-chat',
    'deepseek-reasoner'
  ],
  together: [
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
    'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
    'Qwen/Qwen2-VL-72B-Instruct'
  ],
  fireworks: [
    'accounts/fireworks/models/llama-v3p2-11b-vision-instruct',
    'accounts/fireworks/models/llama-v3p2-90b-vision-instruct',
    'accounts/fireworks/models/phi-3-vision-128k-instruct'
  ],
  siliconflow: [
    'Qwen/Qwen2.5-VL-72B-Instruct',
    'Qwen/Qwen2.5-VL-7B-Instruct',
    'meta-llama/Llama-3.2-11B-Vision-Instruct',
    'meta-llama/Llama-3.2-90B-Vision-Instruct',
    'deepseek-ai/DeepSeek-VL2',
    'THUDM/glm-4v-9b'
  ],
  kimi: [
    'moonshot-v1-8k',
    'moonshot-v1-32k',
    'moonshot-v1-128k'
  ],
  qwen: [
    'qwen-vl-max',
    'qwen-vl-plus',
    'qwen2.5-vl-72b-instruct',
    'qwen2.5-vl-7b-instruct',
    'qwen2-vl-72b-instruct',
    'qwen2-vl-7b-instruct'
  ],
  // ── PREMIUM PROVIDERS ───────────────────────────────────────────
  openai: [
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'o4-mini',
    'o3'
  ],
  anthropic: [
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-3-5',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229'
  ],
  minimax: [
    'MiniMax-VL-01',
    'abab6.5s-chat'
  ]
};

const AI_TONES = [
  { id: 'Professional', name: 'Professional & Informative' },
  { id: 'Casual', name: 'Casual & Friendly' },
  { id: 'Bold', name: 'Bold & Persuasive' },
  { id: 'Elegant', name: 'Elegant & Luxury-focused' },
  { id: 'Urgent', name: 'Urgent & Sale-driven' },
];

const AI_LANGUAGES = [
  { id: 'English', name: 'English' },
  { id: 'Urdu', name: 'Urdu (اردو)' },
  { id: 'Roman Urdu', name: 'Roman Urdu (Urdu written in English alphabets)' },
];

const PROVIDER_KEY_LINKS: Record<string, string> = {
  groq: 'https://console.groq.com/keys',
  gemini: 'https://aistudio.google.com/apikey',
  openai: 'https://platform.openai.com/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  deepseek: 'https://platform.deepseek.com/api_keys',
  nvidia: 'https://build.nvidia.com/explore/discover',
  mistral: 'https://console.mistral.ai/api-keys/',
  cloudflare: 'https://dash.cloudflare.com/profile/api-tokens',
  openrouter: 'https://openrouter.ai/keys',
  together: 'https://api.together.xyz/settings/api-keys',
  fireworks: 'https://fireworks.ai/api-keys',
  siliconflow: 'https://cloud.siliconflow.cn/account/ak',
  minimax: 'https://platform.minimaxi.com/user-center/basic-information/interface-key',
  kimi: 'https://platform.moonshot.cn/console/api-keys',
  qwen: 'https://dashscope.console.aliyun.com/apiKey',
  cerebras: 'https://cloud.cerebras.ai/platform'
};

const AUDIENCE_PRESETS = ['Men', 'Women', 'Kids'];
const TYPE_PRESETS = ['Clothes', 'Shoes', 'Accessories', 'Jewellery', 'Bags'];

export default function AITab({
  aiEnabled,
  setAiEnabled,
  contentProvider,
  setContentProvider,
  contentModel,
  setContentModel,
  contentKeys,
  setContentKeys,
  visionProvider,
  setVisionProvider,
  visionModel,
  setVisionModel,
  visionKeys,
  setVisionKeys,
  aiTone,
  setAiTone,
  aiLanguage,
  setAiLanguage,
  aiCustomInstructions,
  setAiCustomInstructions,
  autoContentSeo,
  setAutoContentSeo,
  autoMediaAi,
  setAutoMediaAi,
  targetAudiences,
  setTargetAudiences,
  productTypes,
  setProductTypes,
  categoryDefaultTemplate,
  setCategoryDefaultTemplate,
  productDefaultTemplate,
  setProductDefaultTemplate,
  categoryDescriptionPrompt,
  setCategoryDescriptionPrompt,
  categoryDescriptionLimit,
  setCategoryDescriptionLimit,
  productDescriptionPrompt,
  setProductDescriptionPrompt,
  productDescriptionLimit,
  setProductDescriptionLimit,
  productShortPrompt,
  setProductShortPrompt,
  productShortLimit,
  setProductShortLimit,
}: AITabProps) {
  const [customAudience, setCustomAudience] = useState('');
  const [customType, setCustomType] = useState('');

  const handleContentProviderChange = (val: string) => {
    setContentProvider(val);
    const defaultModel = TEXT_MODELS[val]?.[0] || '';
    setContentModel(defaultModel);
  };

  const handleVisionProviderChange = (val: string) => {
    setVisionProvider(val);
    const defaultModel = VISION_MODELS[val]?.[0] || '';
    setVisionModel(defaultModel);
  };

  const audiencesList = targetAudiences.split(',').map(s => s.trim()).filter(Boolean);
  const typesList = productTypes.split(',').map(s => s.trim()).filter(Boolean);

  const toggleAudience = (aud: string) => {
    let updated = [...audiencesList];
    if (updated.includes(aud)) {
      updated = updated.filter(a => a !== aud);
    } else {
      updated.push(aud);
    }
    setTargetAudiences(updated.join(', '));
  };

  const addCustomAudience = () => {
    if (!customAudience.trim()) return;
    const clean = customAudience.trim();
    if (!audiencesList.includes(clean)) {
      setTargetAudiences([...audiencesList, clean].join(', '));
    }
    setCustomAudience('');
  };

  const toggleProductType = (t: string) => {
    let updated = [...typesList];
    if (updated.includes(t)) {
      updated = updated.filter(x => x !== t);
    } else {
      updated.push(t);
    }
    setProductTypes(updated.join(', '));
  };

  const addCustomProductType = () => {
    if (!customType.trim()) return;
    const clean = customType.trim();
    if (!typesList.includes(clean)) {
      setProductTypes([...typesList, clean].join(', '));
    }
    setCustomType('');
  };

  return (
    <div className="space-y-8 col-span-1 md:col-span-2">
      {/* Master Switch Card */}
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4 transition-colors">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Enable AI Copilot globally
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Turn the AI system ON or OFF. When disabled, "Write AI" description generators and background indexing checks will be suspended.
          </p>
        </div>
        <input
          type="checkbox"
          checked={aiEnabled}
          onChange={(e) => setAiEnabled(e.target.checked)}
          className="w-10 h-6 rounded-full bg-gray-200 checked:bg-[#e94560] appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] checked:after:left-[18px] after:transition-all shrink-0"
        />
      </div>

      {aiEnabled ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel: Models & Credentials */}
          <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Models & Credentials</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select model providers and supply your API credentials. API keys are stored securely in the database.
            </p>

            {/* Text/SEO Provider */}
            <div className="space-y-4 pt-2 border-t border-gray-150 dark:border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#e94560]">Text & SEO Copywriter</h4>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Model Provider</label>
                <select
                  value={contentProvider}
                  onChange={(e) => handleContentProviderChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                >
                  {Object.keys(TEXT_MODELS).map((prov) => (
                    <option key={prov} value={prov}>{prov.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Model Identifier</label>
                <select
                  value={contentModel}
                  onChange={(e) => setContentModel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                >
                  {(TEXT_MODELS[contentProvider] || []).map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">API Key / Access Secret</label>
                <textarea
                  rows={2}
                  value={contentKeys}
                  onChange={(e) => setContentKeys(e.target.value)}
                  placeholder="Enter API Key(s), one per line for rotation"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2 text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                {PROVIDER_KEY_LINKS[contentProvider] && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>Need keys?</span>
                    <a 
                      href={PROVIDER_KEY_LINKS[contentProvider]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Get keys from {contentProvider.toUpperCase()} Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Vision/Image Analyzer Provider */}
            <div className="space-y-4 pt-4 border-t border-gray-150 dark:border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#e94560]">Media & Vision Analyzer</h4>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Vision Provider</label>
                <select
                  value={visionProvider}
                  onChange={(e) => handleVisionProviderChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                >
                  {Object.keys(VISION_MODELS).map((prov) => (
                    <option key={prov} value={prov}>{prov.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Vision Model Identifier</label>
                <select
                  value={visionModel}
                  onChange={(e) => setVisionModel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                >
                  {(VISION_MODELS[visionProvider] || []).map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">API Key / Access Secret</label>
                <textarea
                  rows={2}
                  value={visionKeys}
                  onChange={(e) => setVisionKeys(e.target.value)}
                  placeholder="Enter Vision API key"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2 text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                {PROVIDER_KEY_LINKS[visionProvider] && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>Need keys?</span>
                    <a 
                      href={PROVIDER_KEY_LINKS[visionProvider]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Get keys from {visionProvider.toUpperCase()} Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Persona & Toggles */}
          <div className="space-y-8">
            {/* Behavior configuration */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Copywriting Persona & Behavior</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Tone of Voice</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                  >
                    {AI_TONES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Output Language</label>
                  <select
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all cursor-pointer"
                  >
                    {AI_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audiences Selector */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Target Audiences</label>
                  <div className="flex flex-wrap gap-4 items-center mt-1">
                    {AUDIENCE_PRESETS.map((aud) => (
                      <label key={aud} className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={audiencesList.includes(aud)}
                          onChange={() => toggleAudience(aud)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] cursor-pointer"
                        />
                        {aud}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      value={customAudience}
                      onChange={(e) => setCustomAudience(e.target.value)}
                      placeholder="Custom audience..."
                      className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none h-[36px]"
                    />
                    <button
                      type="button"
                      onClick={addCustomAudience}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl text-xs font-bold h-[36px]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Product Types Presets */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Product Types</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {TYPE_PRESETS.map((t) => {
                      const isActive = typesList.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleProductType(t)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                            isActive
                              ? 'bg-blue-50 border-blue-400 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                              : 'bg-white border-gray-200 text-gray-600 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Custom product type..."
                      className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none h-[36px]"
                    />
                    <button
                      type="button"
                      onClick={addCustomProductType}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl text-xs font-bold h-[36px]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Custom System Instructions</label>
                  <textarea
                    rows={3}
                    value={aiCustomInstructions}
                    onChange={(e) => setAiCustomInstructions(e.target.value)}
                    placeholder="e.g. Always write descriptions targeting young Pakistani fashion enthusiasts..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Automation toggles */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#e94560]">Automation Switches</h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoContentSeo}
                    onChange={(e) => setAutoContentSeo(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Enable auto-generation of SEO titles/meta descriptions on save
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoMediaAi}
                    onChange={(e) => setAutoMediaAi(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Enable auto-tagging & description analysis for uploaded product media
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Full-width Row: Custom prompt instructions & word limits */}
          <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors col-span-1 md:col-span-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Writing Prompts & Word Limits</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure target word limits and custom copywriting guidelines/prompts for category descriptions, product descriptions, and product short descriptions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Description */}
              <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-[#0f0f1b]/50 border border-gray-100 dark:border-gray-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500">Category Description</h4>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Prompt Instructions</label>
                  <textarea
                    rows={4}
                    value={categoryDescriptionPrompt}
                    onChange={(e) => setCategoryDescriptionPrompt(e.target.value)}
                    placeholder="e.g. Focus on fabric care instructions, sizing recommendations for kids age 1-14 years, and summer/festive styling tips."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Word Limit</label>
                  <input
                    type="number"
                    value={categoryDescriptionLimit || ''}
                    onChange={(e) => setCategoryDescriptionLimit(e.target.value ? Number(e.target.value) : 0)}
                    placeholder="150"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-[#0f0f1b]/50 border border-gray-100 dark:border-gray-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e94560]">Product Description</h4>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Prompt Instructions</label>
                  <textarea
                    rows={4}
                    value={productDescriptionPrompt}
                    onChange={(e) => setProductDescriptionPrompt(e.target.value)}
                    placeholder="e.g. Include detailed features, premium fabric quality, color choices, and wash instructions in list format."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Word Limit</label>
                  <input
                    type="number"
                    value={productDescriptionLimit || ''}
                    onChange={(e) => setProductDescriptionLimit(e.target.value ? Number(e.target.value) : 0)}
                    placeholder="250"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-all"
                  />
                </div>
              </div>

              {/* Product Short Description */}
              <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-[#0f0f1b]/50 border border-gray-100 dark:border-gray-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Product Short Description</h4>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Prompt Instructions</label>
                  <textarea
                    rows={4}
                    value={productShortPrompt}
                    onChange={(e) => setProductShortPrompt(e.target.value)}
                    placeholder="e.g. Write a catchy single paragraph highlight of the outfit to grab immediate attention with a call-to-action."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-855 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Word Limit</label>
                  <input
                    type="number"
                    value={productShortLimit || ''}
                    onChange={(e) => setProductShortLimit(e.target.value ? Number(e.target.value) : 0)}
                    placeholder="100"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-855 bg-white dark:bg-[#16162a] px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Row: Rich default templates */}
          <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors col-span-1 md:col-span-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Default HTML copy guidelines</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provide default structured guidelines/HTML code skeleton wrappers that the AI Copywriter should follow when generating long description fields.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Category Default Template (HTML)</label>
                <textarea
                  rows={4}
                  value={categoryDefaultTemplate}
                  onChange={(e) => setCategoryDefaultTemplate(e.target.value)}
                  placeholder="e.g., <p>Discover premium {{category_name}} crafted for daily wear...</p>"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-xs font-mono text-gray-900 dark:text-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-455">Product Default Template (HTML)</label>
                <textarea
                  rows={4}
                  value={productDefaultTemplate}
                  onChange={(e) => setProductDefaultTemplate(e.target.value)}
                  placeholder="e.g., <p>Get {{product_name}} with soft cotton fabric...</p>"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-xs font-mono text-gray-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16162a] p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-455 transition-colors col-span-1 md:col-span-2">
          <Zap className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">AI System Disabled</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            AI copywriting and image analysis capabilities are currently disabled globally. Turn on the switch above to configure API keys, models, behavior parameters, and default templates.
          </p>
        </div>
      )}
    </div>
  );
}
