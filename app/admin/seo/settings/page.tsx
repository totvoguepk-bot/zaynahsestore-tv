'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ChevronRight, 
  Loader2, 
  Save, 
  Settings, 
  Zap, 
  Layout, 
  Globe,
  ExternalLink
} from '@/components/common/Icons';
import { toast } from 'sonner';

const PROVIDERS = [
  { group: '🆓 FREE', options: ['groq', 'gemini', 'cerebras', 'mistral', 'cloudflare', 'nvidia', 'openrouter'] },
  { group: '💲 CHEAP', options: ['deepseek', 'together', 'fireworks', 'siliconflow', 'kimi', 'qwen'] },
  { group: '💎 PREMIUM', options: ['openai', 'anthropic', 'minimax'] }
];

const TEXT_MODELS: Record<string, string[]> = {
  groq: [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'deepseek-r1-distill-llama-70b',
    'qwen-qwq-32b',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
    'mistral-saba-24b',
  ],
  gemini: [
    'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite',
    'gemma-3-27b-it', 'gemma-3-12b-it', 'gemma-3-4b-it', 'gemma-3-1b-it'
  ],
  cerebras: ['llama-3.3-70b', 'llama-3.1-8b', 'llama-3.1-70b', 'llama3-70b-8k', 'llama3-8b-8k'],
  mistral: [
    'open-mistral-nemo',
    'devstral-2512',
    'magistral-medium-2509',
    'magistral-small-2509',
  ],
  cloudflare: [
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.3-70b-instruct',
    '@cf/meta/llama-3.1-70b-instruct', '@cf/meta/llama-3.1-8b-instruct',
    '@cf/meta/llama-3.2-3b-instruct', '@cf/meta/llama-3.2-1b-instruct',
    '@cf/meta/llama-4-scout-17b-16e-instruct',
    '@cf/google/gemma-3n-e4b-it', '@cf/google/gemma-3-12b-it', '@cf/google/gemma-2-2b-it',
    '@cf/qwen/qwen2.5-72b-instruct', '@cf/qwen/qwen2.5-coder-32b-instruct',
    '@cf/mistralai/mistral-7b-instruct-v0.2', '@cf/mistralai/mistral-small-3.1-24b-instruct',
    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', '@cf/microsoft/phi-2'
  ],
  nvidia: [
    'meta/llama-3.3-70b-instruct', 'meta/llama-3.1-70b-instruct', 'meta/llama-3.1-8b-instruct',
    'meta/llama-4-maverick-17b-128e-instruct', 'meta/llama-4-scout-17b-16e-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct', 'nvidia/nemotron-4-340b-instruct', 'nvidia/nemotron-mini-4b-instruct',
    'mistralai/mistral-large-2-instruct', 'mistralai/mistral-nemo-12b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1', 'mistralai/mixtral-8x22b-instruct-v0.1',
    'google/gemma-3-27b-it', 'google/gemma-3-12b-it',
    'microsoft/phi-3-mini-128k-instruct', 'microsoft/phi-3-medium-128k-instruct', 'microsoft/phi-3.5-mini-instruct',
    'qwen/qwen2.5-72b-instruct', 'qwen/qwen2.5-7b-instruct',
    'deepseek-ai/deepseek-r1', 'deepseek-ai/deepseek-coder-6.7b-instruct'
  ],
  openrouter: [
    'meta-llama/llama-3.3-70b-instruct:free',
    'meta-llama/llama-4-maverick:free',
    'meta-llama/llama-4-scout:free',
    'deepseek/deepseek-r1:free',
    'deepseek/deepseek-chat:free',
    'deepseek/deepseek-v3-base:free',
    'qwen/qwen3-235b-a22b:free',
    'qwen/qwen3-30b-a3b:free',
    'qwen/qwen3-8b:free',
    'google/gemma-3-27b-it:free',
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    'microsoft/phi-4-reasoning-plus:free',
    'microsoft/phi-4-reasoning:free',
    'microsoft/phi-4-mini-reasoning:free',
    'mistralai/mistral-7b-instruct:free',
    'mistralai/mistral-nemo:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'thudm/glm-z1-32b:free',
    'thudm/glm-4-32b:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'openchat/openchat-7b:free',
    'huggingfaceh4/zephyr-7b-beta:free'
  ],
  deepseek: ['deepseek-v4-flash', 'deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
  together: [
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
    'meta-llama/Llama-3.3-70B-Instruct-Turbo', 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'mistralai/Mixtral-8x7B-Instruct-v0.1', 'mistralai/Mistral-7B-Instruct-v0.3',
    'Qwen/Qwen2.5-72B-Instruct-Turbo', 'Qwen/QwQ-32B',
    'deepseek-ai/DeepSeek-R1', 'deepseek-ai/DeepSeek-V3',
    'google/gemma-2-27b-it', 'google/gemma-2-9b-it'
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
    'Qwen/Qwen3-235B-A22B', 'Qwen/Qwen3-30B-A3B',
    'Qwen/Qwen2.5-72B-Instruct', 'Qwen/Qwen2.5-32B-Instruct', 'Qwen/Qwen2.5-7B-Instruct',
    'meta-llama/Meta-Llama-3.1-70B-Instruct', 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    'deepseek-ai/DeepSeek-R1', 'deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-V2.5',
    'THUDM/glm-4-9b-chat', '01-ai/Yi-1.5-34B-Chat-16K',
    'internlm/internlm2_5-20b-chat', 'mistralai/Mistral-7B-Instruct-v0.2'
  ],
  kimi: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k', 'kimi-latest', 'kimi-thinking-preview'],
  qwen: [
    'qwen3-235b-a22b', 'qwen3-30b-a3b', 'qwen3-32b', 'qwen3-14b', 'qwen3-8b',
    'qwen2.5-72b-instruct', 'qwen2.5-32b-instruct', 'qwen2.5-14b-instruct', 'qwen2.5-7b-instruct',
    'qwq-32b', 'qwen2.5-coder-32b-instruct', 'qwen2.5-coder-7b-instruct'
  ],
  openai: [
    'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo',
    'o4-mini', 'o3', 'o3-mini', 'o1', 'o1-mini', 'o1-preview'
  ],
  anthropic: [
    'claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-3-5',
    'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'
  ],
  minimax: ['MiniMax-Text-01', 'abab6.5s-chat', 'abab6.5g-chat', 'abab5.5-chat']
};

const VISION_MODELS: Record<string, string[]> = {
  groq: [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'llama-3.2-11b-vision-preview',
    'llama-3.2-90b-vision-preview',
  ],
  gemini: [
    'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite',
  ],
  cerebras: ['llama-3.2-11b-vision-instruct'],
  mistral: [
    'mistral-small-2506',
    'ministral-3b-2512',
    'ministral-8b-2512',
    'ministral-14b-2512',
    'mistral-large-2512',
    'mistral-medium-2508',
  ],
  cloudflare: [
    '@cf/meta/llama-3.2-11b-vision-instruct', '@cf/meta/llama-4-scout-17b-16e-instruct',
    '@cf/mistralai/mistral-small-3.1-24b-instruct', '@cf/qwen/qwen2.5-vl-7b-instruct',
    '@cf/google/gemma-3-12b-it', '@cf/microsoft/phi-4-multimodal-instruct'
  ],
  nvidia: [
    'meta/llama-4-maverick-17b-128e-instruct', 'meta/llama-4-scout-17b-16e-instruct',
    'meta/llama-3.2-90b-vision-instruct', 'meta/llama-3.2-11b-vision-instruct',
    'nvidia/llama-3.1-nemotron-nano-vl-8b-v1', 'nvidia/neva-22b',
    'google/paligemma', 'microsoft/phi-3.5-vision-instruct', 'microsoft/phi-4-multimodal-instruct',
    'mistralai/pixtral-12b-vision', 'qwen/qwen2.5-vl-72b-instruct', 'qwen/qwen2-vl-7b-instruct'
  ],
  openrouter: [
    'google/gemini-2.5-flash-preview:free', 'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-4-maverick:free', 'meta-llama/llama-4-scout:free',
    'meta-llama/llama-3.2-11b-vision-instruct:free',
    'qwen/qwen2.5-vl-7b-instruct:free', 'microsoft/phi-4-multimodal-instruct:free'
  ],
  deepseek: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-v4-flash'],
  together: [
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo', 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
    'Qwen/Qwen2-VL-72B-Instruct'
  ],
  fireworks: [
    'accounts/fireworks/models/llama-v3p2-11b-vision-instruct',
    'accounts/fireworks/models/llama-v3p2-90b-vision-instruct',
    'accounts/fireworks/models/phi-3-vision-128k-instruct'
  ],
  siliconflow: [
    'Qwen/Qwen2.5-VL-72B-Instruct', 'Qwen/Qwen2.5-VL-7B-Instruct',
    'meta-llama/Llama-3.2-11B-Vision-Instruct', 'meta-llama/Llama-3.2-90B-Vision-Instruct',
    'deepseek-ai/DeepSeek-VL2', 'THUDM/glm-4v-9b'
  ],
  kimi: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  qwen: [
    'qwen-vl-max', 'qwen-vl-plus',
    'qwen2.5-vl-72b-instruct', 'qwen2.5-vl-7b-instruct',
    'qwen2-vl-72b-instruct', 'qwen2-vl-7b-instruct'
  ],
  openai: [
    'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o4-mini', 'o3'
  ],
  anthropic: [
    'claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-3-5',
    'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'
  ],
  minimax: ['MiniMax-VL-01', 'abab6.5s-chat']
};

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

export default function SEOSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customAudience, setCustomAudience] = useState('');
  const [customType, setCustomType] = useState('');
  const [form, setForm] = useState({
    ai_enabled: false,
    ai_model_credentials: {} as Record<string, Record<string, string>>,
    content_provider: 'groq',
    content_model: 'llama-3.3-70b-versatile',
    content_keys: '',
    vision_provider: 'gemini',
    vision_model: 'gemini-2.5-flash',
    vision_keys: '',
    brand_name: '',
    store_type: 'General',
    target_market: 'Pakistan',
    tone: 'Professional',
    language: 'English',
    custom_instructions: '',
    auto_content_seo: true,
    auto_media_ai: true,
    target_audiences: 'Kids',
    product_types: 'Clothes, Shoes',
    category_default_template: '',
    product_default_template: '',
    category_description_prompt: '',
    category_description_limit: 150,
    product_description_prompt: '',
    product_description_limit: 250,
    product_short_prompt: '',
    product_short_limit: 100
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('id', '00000000-0000-4000-8000-000000000002')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setForm({
          ai_enabled: data.ai_enabled ?? false,
          ai_model_credentials: typeof data.ai_model_credentials === 'string' ? JSON.parse(data.ai_model_credentials) : (data.ai_model_credentials ?? {}),
          content_provider: data.content_provider || 'groq',
          content_model: data.content_model || 'llama-3.3-70b-versatile',
          content_keys: data.content_keys || '',
          vision_provider: data.vision_provider || 'gemini',
          vision_model: data.vision_model || 'gemini-2.5-flash',
          vision_keys: data.vision_keys || '',
          brand_name: data.brand_name || '',
          store_type: data.store_type || 'General',
          target_market: data.target_market || 'Pakistan',
          tone: data.tone || 'Professional',
          language: data.language || 'English',
          custom_instructions: data.custom_instructions || '',
          auto_content_seo: data.auto_content_seo ?? true,
          auto_media_ai: data.auto_media_ai ?? true,
          target_audiences: data.target_audiences || 'Kids',
          product_types: data.product_types || 'Clothes, Shoes',
          category_default_template: data.category_default_template || '',
          product_default_template: data.product_default_template || '',
          category_description_prompt: data.category_description_prompt || '',
          category_description_limit: data.category_description_limit ?? 150,
          product_description_prompt: data.product_description_prompt || '',
          product_description_limit: data.product_description_limit ?? 250,
          product_short_prompt: data.product_short_prompt || '',
          product_short_limit: data.product_short_limit ?? 100
        });
      }
    } catch (err: any) {
      console.error('[SEO Settings] Load failed:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (field: 'content_provider' | 'vision_provider', val: string) => {
    const defaultModel = field === 'content_provider' 
      ? TEXT_MODELS[val]?.[0] || ''
      : VISION_MODELS[val]?.[0] || '';

    setForm(prev => ({
      ...prev,
      [field]: val,
      [field === 'content_provider' ? 'content_model' : 'vision_model']: defaultModel
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          id: '00000000-0000-4000-8000-000000000002',
          ...form,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('AI & SEO Settings saved successfully!');
    } catch (err: any) {
      console.error('[SEO Settings] Save failed:', err);
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Helper arrays for parsing and saving custom chips & checkboxes
  const audiencesList = form.target_audiences.split(',').map(s => s.trim()).filter(Boolean);
  const typesList = form.product_types.split(',').map(s => s.trim()).filter(Boolean);

  const toggleAudience = (aud: string) => {
    let updated = [...audiencesList];
    if (updated.includes(aud)) {
      updated = updated.filter(a => a !== aud);
    } else {
      updated.push(aud);
    }
    setForm(prev => ({ ...prev, target_audiences: updated.join(', ') }));
  };

  const addCustomAudience = () => {
    if (!customAudience.trim()) return;
    const cleanCustom = customAudience.trim();
    if (!audiencesList.includes(cleanCustom)) {
      const updated = [...audiencesList, cleanCustom];
      setForm(prev => ({ ...prev, target_audiences: updated.join(', ') }));
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
    setForm(prev => ({ ...prev, product_types: updated.join(', ') }));
  };

  const addCustomProductType = () => {
    if (!customType.trim()) return;
    const cleanCustom = customType.trim();
    if (!typesList.includes(cleanCustom)) {
      const updated = [...typesList, cleanCustom];
      setForm(prev => ({ ...prev, product_types: updated.join(', ') }));
    }
    setCustomType('');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 max-w-xl mx-auto mt-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
        <span>Loading AI Configurations...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <Link href="/admin/seo" className="hover:text-blue-600">SEO Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-950 dark:text-white">AI Config Settings</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AI Copywriting Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select text/vision models, set brand voice properties, and configure API keys.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Global AI Switch Card */}
        <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                ENABLE AI SYSTEM GLOBALLY
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Turn the AI copywriting and vision system ON or OFF globally. When disabled, all "Write AI" actions, background integrations, and bulk tasks are suspended.
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.ai_enabled}
              onChange={(e) => setForm(prev => ({ ...prev, ai_enabled: e.target.checked }))}
              className="w-10 h-6 rounded-full bg-gray-200 checked:bg-[#e94560] appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] checked:after:left-[18px] after:transition-all shrink-0"
            />
          </div>
        </div>

        {form.ai_enabled ? (
          <>
            {/* Content SEO AI Settings */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                CONTENT SEO AI SETTINGS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Provider</label>
                  <select
                    value={form.content_provider}
                    onChange={(e) => handleProviderChange('content_provider', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    {PROVIDERS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Text Model</label>
                  <select
                    value={form.content_model}
                    onChange={(e) => setForm(prev => ({ ...prev, content_model: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    {(TEXT_MODELS[form.content_provider] || []).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">API Keys (1 per line for rotation)</label>
                <textarea
                  value={form.ai_model_credentials?.content?.[form.content_provider] || ''}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    ai_model_credentials: {
                      ...prev.ai_model_credentials,
                      content: {
                        ...(prev.ai_model_credentials?.content || {}),
                        [prev.content_provider]: e.target.value,
                      },
                    },
                  }))}
                  placeholder="Paste API keys here..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-sm font-mono text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
                {PROVIDER_KEY_LINKS[form.content_provider] && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <span>Need keys?</span>
                    <a 
                      href={PROVIDER_KEY_LINKS[form.content_provider]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                    >
                      Get keys from {form.content_provider.toUpperCase()} Console <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Image SEO AI Settings */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                IMAGE SEO VISION SETTINGS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Vision Provider</label>
                  <select
                    value={form.vision_provider}
                    onChange={(e) => handleProviderChange('vision_provider', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    {PROVIDERS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Vision Model</label>
                  <select
                    value={form.vision_model}
                    onChange={(e) => setForm(prev => ({ ...prev, vision_model: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    {(VISION_MODELS[form.vision_provider] || []).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Vision API Keys (1 per line)</label>
                <textarea
                  value={form.ai_model_credentials?.vision?.[form.vision_provider] || ''}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    ai_model_credentials: {
                      ...prev.ai_model_credentials,
                      vision: {
                        ...(prev.ai_model_credentials?.vision || {}),
                        [prev.vision_provider]: e.target.value,
                      },
                    },
                  }))}
                  placeholder="Paste Vision API keys here..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-sm font-mono text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
                {PROVIDER_KEY_LINKS[form.vision_provider] && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <span>Need keys?</span>
                    <a 
                      href={PROVIDER_KEY_LINKS[form.vision_provider]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                    >
                      Get keys from {form.vision_provider.toUpperCase()} Console <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Target Presets & Audiences */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                AI PROMPT PRESETS & TARGET AUDIENCES
              </h3>

              <div className="space-y-4">
                {/* Audiences Checkboxes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Target Audiences</label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {AUDIENCE_PRESETS.map((aud) => (
                      <label key={aud} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-900 dark:text-gray-300 font-semibold">
                        <input
                          type="checkbox"
                          checked={audiencesList.includes(aud)}
                          onChange={() => toggleAudience(aud)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        {aud}
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center max-w-sm mt-2">
                    <input
                      type="text"
                      value={customAudience}
                      onChange={(e) => setCustomAudience(e.target.value)}
                      placeholder="Add custom audience..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none h-[36px]"
                    />
                    <button
                      type="button"
                      onClick={addCustomAudience}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-white rounded-lg text-xs font-bold h-[36px]"
                    >
                      Add
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Current targets: {form.target_audiences || '—'}
                  </div>
                </div>

                {/* Product Type Presets */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Product Types Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPE_PRESETS.map((t) => {
                      const isActive = typesList.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleProductType(t)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            isActive
                              ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                              : 'bg-white border-gray-200 text-gray-600 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 items-center max-w-sm mt-2">
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Add custom product type..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none h-[36px]"
                    />
                    <button
                      type="button"
                      onClick={addCustomProductType}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-white rounded-lg text-xs font-bold h-[36px]"
                    >
                      Add
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Current types: {form.product_types || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Store Settings & Brand voice */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                BRAND GUIDELINES & VOICE
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Brand Name</label>
                  <input
                    type="text"
                    value={form.brand_name}
                    onChange={(e) => setForm(prev => ({ ...prev, brand_name: e.target.value }))}
                    placeholder="e.g. TotVogue"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Store Type</label>
                  <select
                    value={form.store_type}
                    onChange={(e) => setForm(prev => ({ ...prev, store_type: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="Kids">Kids</option>
                    <option value="Adults">Adults</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Target Market</label>
                  <select
                    value={form.target_market}
                    onChange={(e) => setForm(prev => ({ ...prev, target_market: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="Global">Global</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Tone of Voice</label>
                  <select
                    value={form.tone}
                    onChange={(e) => setForm(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Catchy & Salesy">Catchy & Salesy</option>
                    <option value="Hinglish">Hinglish</option>
                    <option value="Educational">Educational</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Target Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="English">English</option>
                    <option value="Urdu Roman">Urdu Roman</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Custom Brand Instructions (e.g., We specialize in Eid Wear)</label>
                <textarea
                  value={form.custom_instructions}
                  onChange={(e) => setForm(prev => ({ ...prev, custom_instructions: e.target.value }))}
                  placeholder="Describe your brand features, delivery parameters, etc..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Custom AI Prompts & Word Limits */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-500" />
                AI WRITING PROMPTS & WORD LIMITS
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure target word limits and custom copywriting guidelines/prompts for category descriptions, product descriptions, and product short descriptions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Description */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500">Category Description</h4>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Prompt Instructions</label>
                    <textarea
                      rows={4}
                      value={form.category_description_prompt}
                      onChange={(e) => setForm(prev => ({ ...prev, category_description_prompt: e.target.value }))}
                      placeholder="e.g. Focus on fabric care instructions, sizing recommendations for kids age 1-14 years, and summer/festive styling tips."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Word Limit</label>
                    <input
                      type="number"
                      value={form.category_description_limit || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, category_description_limit: e.target.value ? Number(e.target.value) : 0 }))}
                      placeholder="150"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none min-h-[36px]"
                    />
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#e94560]">Product Description</h4>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Prompt Instructions</label>
                    <textarea
                      rows={4}
                      value={form.product_description_prompt}
                      onChange={(e) => setForm(prev => ({ ...prev, product_description_prompt: e.target.value }))}
                      placeholder="e.g. Include detailed features, premium fabric quality, color choices, and wash instructions in list format."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-[#e94560] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Word Limit</label>
                    <input
                      type="number"
                      value={form.product_description_limit || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, product_description_limit: e.target.value ? Number(e.target.value) : 0 }))}
                      placeholder="250"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-[#e94560] focus:outline-none min-h-[36px]"
                    />
                  </div>
                </div>

                {/* Product Short Description */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Product Short Description</h4>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Prompt Instructions</label>
                    <textarea
                      rows={4}
                      value={form.product_short_prompt}
                      onChange={(e) => setForm(prev => ({ ...prev, product_short_prompt: e.target.value }))}
                      placeholder="e.g. Write a catchy single paragraph highlight of the outfit to grab immediate attention with a call-to-action."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-700 dark:text-gray-300">Word Limit</label>
                    <input
                      type="number"
                      value={form.product_short_limit || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, product_short_limit: e.target.value ? Number(e.target.value) : 0 }))}
                      placeholder="100"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-gray-900 dark:text-white text-xs focus:border-emerald-500 focus:outline-none min-h-[36px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Default templates textareas */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-500" />
                DEFAULT DESCRIPTION HTML TEMPLATES
              </h3>
              <p className="text-xs text-gray-500">
                These default templates will guide the copywriting layouts. You can use standard HTML tags like <code>&lt;p&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;ul&gt;</code>, etc. Use template variables: <code>{"{{brand_name}}"}</code>, <code>{"{{product_name}}"}</code>, or <code>{"{{category_name}}"}</code>.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Default Category HTML Template</label>
                  <textarea
                    value={form.category_default_template}
                    onChange={(e) => setForm(prev => ({ ...prev, category_default_template: e.target.value }))}
                    placeholder="Enter default HTML category description template..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-sm font-mono text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Default Product HTML Template</label>
                  <textarea
                    value={form.product_default_template}
                    onChange={(e) => setForm(prev => ({ ...prev, product_default_template: e.target.value }))}
                    placeholder="Enter default HTML product description template..."
                    rows={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a30] text-sm font-mono text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Auto modes */}
            <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-500" />
                AUTOMATION MODE TOGGLES
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Auto Content SEO</span>
                    <span className="text-xs text-gray-500">Run LLM copy generation on product/category creation/save.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.auto_content_seo}
                    onChange={(e) => setForm(prev => ({ ...prev, auto_content_seo: e.target.checked }))}
                    className="w-10 h-6 rounded-full bg-gray-200 checked:bg-blue-600 appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] checked:after:left-[18px] after:transition-all shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Auto Media AI</span>
                    <span className="text-xs text-gray-500">Run vision models to fill tags when an image is uploaded.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.auto_media_ai}
                    onChange={(e) => setForm(prev => ({ ...prev, auto_media_ai: e.target.checked }))}
                    className="w-10 h-6 rounded-full bg-gray-200 checked:bg-blue-600 appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] checked:after:left-[18px] after:transition-all shrink-0"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-[#16162a] p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
            <Zap className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">AI System Disabled</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              AI copywriter and vision features are currently globally disabled. Turn on the switch above to configure API keys, tone of voice, templates, and target presets.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/seo"
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#16162a] hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm cursor-pointer min-h-[44px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm text-sm cursor-pointer min-h-[44px] active:scale-95"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
