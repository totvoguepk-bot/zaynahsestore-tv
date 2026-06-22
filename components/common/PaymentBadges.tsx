import React from 'react';

const renderPaymentBadgeByCode = (code: string, id: string) => {
  const base = 'h-5 px-2.5 rounded text-[8px] font-extrabold flex items-center justify-center tracking-wider shadow-sm select-none border border-black/5 dark:border-white/5';
  switch (code.toLowerCase()) {
    case 'visa':
      return <div key={id} className={`${base} bg-[#1A1F71] text-white`} style={{ fontFamily: 'sans-serif' }}>VISA</div>;
    case 'mastercard':
      return (
        <div key={id} className={`${base} bg-[#0A0A0A] text-white gap-1 flex items-center`}>
          <div className="flex -space-x-1 w-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EB001B]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#F79E1B] opacity-90 -ml-0.5"></div>
          </div>
          <span className="text-[7px] font-semibold tracking-normal lowercase">mastercard</span>
        </div>
      );
    case 'paypal':
      return <div key={id} className={`${base} bg-[#003087] text-[#0079C1]`} style={{ fontStyle: 'italic' }}>Pay<span className="text-white">Pal</span></div>;
    case 'amex':
      return <div key={id} className={`${base} bg-[#016FD0] text-white`} style={{ letterSpacing: '0.05em' }}>AMEX</div>;
    case 'klarna':
      return <div key={id} className={`${base} bg-[#FFB3C7] text-black font-semibold`} style={{ letterSpacing: '-0.02em' }}>Klarna.</div>;
    case 'cirrus':
      return <div key={id} className={`${base} bg-[#0079C1] text-white font-bold`}>cirrus</div>;
    case 'westernunion':
      return (
        <div key={id} className={`${base} bg-[#FFCC00] text-black flex flex-col items-center leading-none justify-center font-bold px-1.5 py-0.5`}>
          <span className="text-[4px] tracking-normal">WESTERN</span>
          <span className="text-[4px] tracking-normal">UNION</span>
        </div>
      );
    case 'cod':
      return <div key={id} className={`${base} bg-[#10b981] text-white px-2`}>💵 COD</div>;
    case 'easypaisa':
      return <div key={id} className={`${base} bg-[#3EBA4E] text-white px-2`}>EasyPaisa</div>;
    case 'jazzcash':
      return <div key={id} className={`${base} bg-[#e94560] text-white px-2`}>JazzCash</div>;
    case 'banktransfer':
    case 'bank':
      return <div key={id} className={`${base} bg-[#1a1a2e] text-white px-2`}>🏦 Bank</div>;
    default:
      return <div key={id} className={`${base} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[7px]`}>{code}</div>;
  }
};

interface PaymentBadgesProps {
  methods: string[];
  className?: string;
}

export default function PaymentBadges({ methods, className = "flex flex-wrap items-center gap-1.5" }: PaymentBadgesProps) {
  if (!methods || methods.length === 0) return null;
  
  return (
    <div className={className}>
      {methods.map(code => renderPaymentBadgeByCode(code, code))}
    </div>
  );
}
