import React, { useState } from 'react';
import { TemplateInfo } from '@/domain/template';
import { CheckCircle2, CreditCard, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateInfo | null;
  onUnlockDemo: () => void;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, template, onUnlockDemo }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  if (!isOpen || !template) return null;

  const handlePay = () => {
    if (!selectedMethod) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    
    // Show toast
    setToastVisible(true);
    
    // Demo mode: auto unlock and close after toast
    setTimeout(() => {
      setToastVisible(false);
      onUnlockDemo();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] transform transition-all">
        
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">프리미엄 템플릿 잠금 해제</h3>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          <div className="flex flex-col items-center mb-8 p-6 bg-black/30 rounded-2xl border border-white/5">
            <span className="text-white/60 font-medium mb-1">{template.name}</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              ₩{template.price.toLocaleString()}
            </span>
          </div>

          <p className="text-sm font-medium text-white/70 mb-3 px-1">결제 수단 선택</p>
          <div className="space-y-3 mb-8">
            <label className={`block w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'kakaopay' ? 'bg-yellow-400/10 border-yellow-400 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
              <input type="radio" name="payment" className="hidden" onChange={() => setSelectedMethod('kakaopay')} />
              <div className="w-8 h-8 rounded-lg bg-[#FEE500] flex items-center justify-center shrink-0">
                <span className="text-[#000000] font-black text-xs">P</span>
              </div>
              <span className="font-semibold">카카오페이</span>
              {selectedMethod === 'kakaopay' && <CheckCircle2 className="ml-auto text-yellow-400" size={20} />}
            </label>

            <label className={`block w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'naverpay' ? 'bg-green-500/10 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
              <input type="radio" name="payment" className="hidden" onChange={() => setSelectedMethod('naverpay')} />
              <div className="w-8 h-8 rounded-lg bg-[#03C75A] flex items-center justify-center shrink-0 text-white">
                <span className="font-black text-xs">N</span>
              </div>
              <span className="font-semibold">네이버페이</span>
              {selectedMethod === 'naverpay' && <CheckCircle2 className="ml-auto text-green-500" size={20} />}
            </label>

            <label className={`block w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'card' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
              <input type="radio" name="payment" className="hidden" onChange={() => setSelectedMethod('card')} />
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 text-white">
                <CreditCard size={16} />
              </div>
              <span className="font-semibold">신용/체크카드</span>
              {selectedMethod === 'card' && <CheckCircle2 className="ml-auto text-blue-500" size={20} />}
            </label>
          </div>

          <button
            onClick={handlePay}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            결제하기
          </button>
        </div>

        {/* Toast Message Overlay */}
        <div className={`absolute top-0 left-0 w-full p-4 transition-all duration-300 ease-out transform ${toastVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-center py-3 px-4 rounded-2xl shadow-lg font-medium flex justify-center items-center gap-2">
            🚧 준비 중입니다. (데모 시연용 자동 해제 적용됨)
          </div>
        </div>
      </div>
    </div>
  );
};
