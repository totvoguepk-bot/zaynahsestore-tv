'use client';

import React, { useState } from 'react';
import { StoreSettings } from '@/lib/types';
import { updateSettings } from '@/lib/services/settings';
import { toast } from 'sonner';
import { Loader2, Check, X, Eye, EyeOff, RefreshCw, Save, Truck } from '@/components/common/Icons';

interface MerchantAddress {
  addressCode: string;
  address: string;
  cityName: string;
  addressType: string;
}

interface CourierManagerProps {
  settings: StoreSettings;
}

export default function CourierManager({ settings: initialSettings }: CourierManagerProps) {
  const [enabled, setEnabled] = useState(initialSettings.postex_enabled ?? false);
  const [apiToken, setApiToken] = useState(initialSettings.postex_api_token || '');
  const [mode, setMode] = useState(initialSettings.postex_mode || 'sandbox');
  const [pickupCode, setPickupCode] = useState(initialSettings.postex_pickup_address || '');
  const [returnCode, setReturnCode] = useState(initialSettings.postex_return_address || '');
  const [pickupDisplay, setPickupDisplay] = useState(initialSettings.postex_pickup_display || '');
  const [returnDisplay, setReturnDisplay] = useState(initialSettings.postex_return_display || '');
  const [returnCity, setReturnCity] = useState(initialSettings.postex_return_city || '');
  const [orderType, setOrderType] = useState(initialSettings.postex_order_type || 'Normal');
  const [handlingType, setHandlingType] = useState(initialSettings.postex_handling_type || 'No');
  const [defaultWeight, setDefaultWeight] = useState(initialSettings.postex_default_weight || '0.5');
  const [defaultItems, setDefaultItems] = useState(initialSettings.postex_default_items || '3');
  const [defaultProduct, setDefaultProduct] = useState(initialSettings.postex_default_product || 'Kids Clothes');
  const [defaultRemarks, setDefaultRemarks] = useState(initialSettings.postex_default_remarks || 'Call before delivery, customer is a serious buyer');
  const [productCheck, setProductCheck] = useState(initialSettings.postex_product_check || '1');
  const [skuCheck, setSkuCheck] = useState(initialSettings.postex_sku_check || '0');
  const [weightCheck, setWeightCheck] = useState(initialSettings.postex_weight_check || '1');
  const [piecesCheck, setPiecesCheck] = useState(initialSettings.postex_pieces_check || '1');
  const [codCheck, setCodCheck] = useState(initialSettings.postex_cod_check || '0');
  const [notesCheck, setNotesCheck] = useState(initialSettings.postex_notes_check || '1');
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    initialSettings.postex_whatsapp_template || 'Dear {name}, your order has been booked. You can track it here: {url}\n{note}'
  );
  const [whatsappNote, setWhatsappNote] = useState(initialSettings.postex_whatsapp_note || 'Thank you for shopping with us!');
  const [autoDownloadLabel, setAutoDownloadLabel] = useState(initialSettings.postex_auto_download_label ?? false);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [addresses, setAddresses] = useState<MerchantAddress[]>([]);
  const [orderTypes, setOrderTypes] = useState<string[]>([]);
  const [showToken, setShowToken] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        postex_enabled: enabled,
        postex_api_token: apiToken,
        postex_mode: mode,
        postex_pickup_address: pickupCode,
        postex_return_address: returnCode,
        postex_pickup_display: pickupDisplay,
        postex_return_display: returnDisplay,
        postex_return_city: returnCity,
        postex_order_type: orderType,
        postex_handling_type: handlingType,
        postex_default_remarks: defaultRemarks,
        postex_product_check: productCheck,
        postex_sku_check: skuCheck,
        postex_weight_check: weightCheck,
        postex_pieces_check: piecesCheck,
        postex_cod_check: codCheck,
        postex_notes_check: notesCheck,
        postex_default_weight: defaultWeight,
        postex_default_items: defaultItems,
        postex_default_product: defaultProduct,
        postex_whatsapp_template: whatsappTemplate,
        postex_whatsapp_note: whatsappNote,
        postex_auto_download_label: autoDownloadLabel,
      });
      toast.success('Courier settings saved successfully');
    } catch {
      toast.error('Failed to save courier settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestLoad = async () => {
    if (!apiToken) {
      setTestResult({ ok: false, message: 'Please enter a PostEx token first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/courier/postex/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiToken, mode }),
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        const pickupAddrs = data.addresses.filter((a: MerchantAddress) => a.addressType !== 'Return Address');
        const returnAddrs = data.addresses.filter((a: MerchantAddress) => a.addressType === 'Return Address');

        if (pickupAddrs.length > 0 && !pickupCode) {
          const defaultPickup = pickupAddrs[0];
          setPickupCode(defaultPickup.addressCode);
          setPickupDisplay(`${defaultPickup.address} — ${defaultPickup.cityName}`);
        } else if (pickupCode && !pickupDisplay) {
          const match = pickupAddrs.find((a: MerchantAddress) => a.addressCode === pickupCode);
          if (match) setPickupDisplay(`${match.address} — ${match.cityName}`);
        }

        if (!returnCode) {
          const defaultReturn = returnAddrs.length > 0 ? returnAddrs[0] : (data.addresses.length > 0 ? data.addresses[0] : null);
          if (defaultReturn) {
            setReturnCode(defaultReturn.addressCode);
            setReturnCity((defaultReturn.cityName || '').toUpperCase());
            setReturnDisplay(`${defaultReturn.address} — ${defaultReturn.cityName}`);
          }
        } else {
          if (!returnDisplay) {
            const match = returnAddrs.find((a: MerchantAddress) => a.addressCode === returnCode);
            if (match) setReturnDisplay(`${match.address} — ${match.cityName}`);
          }
          if (!returnCity) {
            const matchingAddress = data.addresses.find((a: MerchantAddress) => a.addressCode === returnCode);
            if (matchingAddress?.cityName) setReturnCity(matchingAddress.cityName.toUpperCase());
          }
        }

        if (data.orderTypes) {
          setOrderTypes(data.orderTypes);
        }

        setTestResult({ ok: true, message: `Token valid! ${data.addresses.length} address(es) found.` });
      } else {
        setTestResult({ ok: false, message: `Invalid token: ${data.error || 'Unknown error'}` });
      }
    } catch {
      setTestResult({ ok: false, message: 'Could not reach PostEx API' });
    } finally {
      setTesting(false);
    }
  };

  const pickupAddresses = addresses.filter(a => a.addressType !== 'Return Address');
  const returnAddresses = addresses;

  const handlePickupChange = (code: string) => {
    setPickupCode(code);
    const selected = pickupAddresses.find(a => a.addressCode === code);
    setPickupDisplay(selected ? `${selected.address} — ${selected.cityName}` : '');
  };

  const handleReturnChange = (code: string) => {
    setReturnCode(code);
    const selected = returnAddresses.find(a => a.addressCode === code);
    if (selected) {
      setReturnCity((selected.cityName || '').toUpperCase());
      setReturnDisplay(`${selected.address} — ${selected.cityName}`);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Courier Manager
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure PostEx courier integration settings
        </p>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">PostEx Courier Settings</h2>
          </div>
          <a
            href="https://merchant.postex.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Merchant Portal →
          </a>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Enable Toggle */}
          <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Enable PostEx Courier Integration</span>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Toggle to activate automated dispatch via PostEx</p>
              </div>
            </label>
          </div>

          {/* Token Validation Deck */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">API Token</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Paste PostEx API token..."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleTestLoad}
                disabled={testing || !apiToken}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                {testing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</>
                ) : (
                  <><RefreshCw size={16} /> Test & Load</>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner — drops down between Token Deck and Mode selector on failure */}
          {testResult && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${testResult.ok ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'}`}>
              {testResult.ok ? (
                <Check className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
              <div>
                <p className={`text-sm font-semibold ${testResult.ok ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {testResult.ok ? 'Connection Successful' : 'Validation Failed'}
                </p>
                <p className={`text-xs mt-0.5 ${testResult.ok ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Environment Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Environment Mode</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all select-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750/50"
                style={{
                  borderColor: mode === 'production' ? '#059669' : '',
                  backgroundColor: mode === 'production' ? '#ecfdf5' : '',
                }}
              >
                <input
                  type="radio"
                  name="postexMode"
                  checked={mode === 'production'}
                  onChange={() => setMode('production')}
                  className="accent-emerald-600 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Production</span>
                  <p className="text-[10px] text-gray-400">Live PostEx API</p>
                </div>
              </label>
              <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all select-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750/50"
                style={{
                  borderColor: mode === 'sandbox' ? '#d97706' : '',
                  backgroundColor: mode === 'sandbox' ? '#fffbeb' : '',
                }}
              >
                <input
                  type="radio"
                  name="postexMode"
                  checked={mode === 'sandbox'}
                  onChange={() => setMode('sandbox')}
                  className="accent-amber-600 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Sandbox</span>
                  <p className="text-[10px] text-gray-400">Staging Environment</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pickup Address */}
          {pickupAddresses.length > 0 ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Pickup Address</label>
              <select
                value={pickupCode || ''}
                onChange={(e) => handlePickupChange(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200"
              >
                <option value="">— Select Pickup Address —</option>
                {pickupAddresses.map(a => (
                  <option key={a.addressCode} value={a.addressCode}>
                    {a.address} — {a.cityName} [Code: {a.addressCode}] ({a.addressType})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Pickup Address Code</label>
              <input
                type="text"
                value={pickupCode || ''}
                onChange={(e) => setPickupCode(e.target.value)}
                placeholder="Address code from PostEx"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Return Address */}
          {returnAddresses.length > 0 ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Return Address</label>
              <select
                value={returnCode || ''}
                onChange={(e) => handleReturnChange(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200"
              >
                <option value="">— Select Return Address —</option>
                {returnAddresses.map(a => (
                  <option key={a.addressCode} value={a.addressCode}>
                    {a.address} — {a.cityName} [Code: {a.addressCode}] ({a.addressType})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Return Address Code</label>
              <input
                type="text"
                value={returnCode || ''}
                onChange={(e) => setReturnCode(e.target.value)}
                placeholder="Return address code"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Return City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Return City</label>
            <input
              type="text"
              value={returnCity}
              onChange={(e) => setReturnCity(e.target.value.toUpperCase())}
              placeholder="e.g. KARACHI"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Enter the city name in uppercase. Auto-filled when you select a return address above.</p>
          </div>

          {/* Shipment Type */}
          {orderTypes.length > 0 ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Shipment Type</label>
              <select
                value={orderType || 'Normal'}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200"
              >
                {orderTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Shipment Type</label>
              <input
                type="text"
                value={orderType || 'Normal'}
                onChange={(e) => setOrderType(e.target.value)}
                placeholder="Normal"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Special Handling */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Special Handling</label>
            <select
              value={handlingType || 'No'}
              onChange={(e) => setHandlingType(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200"
            >
              <option value="No">Normal (Standard)</option>
              <option value="Yes">Fragile (Careful Handling)</option>
            </select>
          </div>

          {/* Sync & Print Rules */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Sync & Print Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={productCheck === '1'}
                  onChange={(e) => setProductCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Print Item Name in Label</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Include parsed details on shipment invoice</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={skuCheck === '1'}
                  onChange={(e) => setSkuCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Print SKU Name in Label</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Append items' unique code to shipping labels</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={weightCheck === '1'}
                  onChange={(e) => setWeightCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Auto Calculate Weight</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Use order item weight or fall back to default</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={piecesCheck === '1'}
                  onChange={(e) => setPiecesCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Auto Calculate Pieces</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Extract quantity automatically or use defaults</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={codCheck === '1'}
                  onChange={(e) => setCodCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Calculate Non-COD (Prepaid) as Zero</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Set booking amount to 0 for prepaid/advance paid orders</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={notesCheck === '1'}
                  onChange={(e) => setNotesCheck(e.target.checked ? '1' : '0')}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Print Order Notes in Remarks</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Combine custom customer notes with default remarks</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={autoDownloadLabel}
                  onChange={(e) => setAutoDownloadLabel(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Auto-Download Shipping Label PDF After Fulfillment</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">When enabled, a browser download trigger launches for postex-labels.pdf on booking success</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Parcel Defaults */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Parcel Defaults
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Default Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={defaultWeight}
                onChange={(e) => setDefaultWeight(e.target.value)}
                placeholder="0.5"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="cursor-help" title="Default number of pieces per parcel. If left empty, it will default to 1 piece.">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 flex items-center justify-between">
                <span>Default Items Per Parcel</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 font-normal">Defaults to 1 if empty</span>
              </label>
              <input
                type="number"
                value={defaultItems}
                onChange={(e) => setDefaultItems(e.target.value)}
                placeholder="3"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Default Product / Detail</label>
              <input
                type="text"
                value={defaultProduct}
                onChange={(e) => setDefaultProduct(e.target.value)}
                placeholder="Kids Clothes"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Default Delivery Note</label>
              <input
                type="text"
                value={defaultRemarks}
                onChange={(e) => setDefaultRemarks(e.target.value)}
                placeholder="Call before delivery"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Settings */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp Senders & Templates
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">WhatsApp Message Template</label>
            <textarea
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              rows={3}
              placeholder="Template text..."
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Placeholder Format Guide:</span> Use
              <code className="mx-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-blue-600 dark:text-blue-400 font-semibold">{`{name}`}</code> for customer name,
              <code className="mx-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-blue-600 dark:text-blue-400 font-semibold">{`{url}`}</code> for PostEx tracking link, and
              <code className="mx-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-blue-600 dark:text-blue-400 font-semibold">{`{note}`}</code> for custom remarks note.
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Default Suffix Note</label>
            <input
              type="text"
              value={whatsappNote}
              onChange={(e) => setWhatsappNote(e.target.value)}
              placeholder="e.g. Thank you for shopping with us!"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a2e] dark:bg-[#e94560] hover:bg-[#e94560] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
          <span>Save Courier Settings</span>
        </button>
      </div>
    </div>
  );
}
