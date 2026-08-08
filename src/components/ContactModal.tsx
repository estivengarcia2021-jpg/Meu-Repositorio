import React, { useState, useEffect } from 'react';
import { X, Send, Mail, CheckCircle2, AlertCircle, Loader2, User, FileText, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [fromName, setFromName] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // EmailJS Credentials from environment or configured user keys
  const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};
  const PUBLIC_KEY = (metaEnv.VITE_EMAILJS_PUBLIC_KEY || "JEPRw9DSu0ygJThYz").trim();
  const SERVICE_ID = (metaEnv.VITE_EMAILJS_SERVICE_ID || "service_o8oqz6f").trim();
  const TEMPLATE_ID = (metaEnv.VITE_EMAILJS_TEMPLATE_ID || "template_0y99r3e").trim();

  // Initialize EmailJS SDK
  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init(PUBLIC_KEY);
    }
  }, [PUBLIC_KEY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!fromName.trim() || !replyTo.trim() || !subject.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Por favor, preencha todos os campos do formulário.' });
      return;
    }

    setLoading(true);

    try {
      const templateParams = {
        from_name: fromName.trim(),
        reply_to: replyTo.trim(),
        subject: subject.trim(),
        message: message.trim(),
        to_name: 'Arnol Estiven Garcia Diaz'
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      console.log('EmailJS Response:', response);

      setStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso para o e-mail! Em breve entrarei em contato com você.'
      });

      // Reset form on success
      setFromName('');
      setReplyTo('');
      setSubject('');
      setMessage('');

      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 3500);

    } catch (error: any) {
      console.error('Erro no envio do EmailJS:', error);
      const errorDetail = error?.text || error?.message || (typeof error === 'string' ? error : 'Falha na resposta do serviço EmailJS.');
      setStatus({
        type: 'error',
        message: `Erro ao enviar mensagem: ${errorDetail}. Verifique se as chaves (Service ID, Template ID e Public Key) estão ativas no painel do EmailJS.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        id="contact-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Vamos conversar?</h3>
              <p className="text-xs text-slate-400">Envie uma mensagem direta para meu e-mail profissional</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                status.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="leading-relaxed">{status.message}</div>
            </div>
          )}

          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label htmlFor="from_name" className="block text-xs font-semibold text-slate-300">
              Nome Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* E-mail de Contato */}
          <div className="space-y-1.5">
            <label htmlFor="reply_to" className="block text-xs font-semibold text-slate-300">
              E-mail de Contato
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                id="reply_to"
                name="reply_to"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Assunto */}
          <div className="space-y-1.5">
            <label htmlFor="subject" className="block text-xs font-semibold text-slate-300">
              Assunto
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Motivo do contato ou orçamento"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-semibold text-slate-300">
              Mensagem
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem aqui..."
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Mensagem...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem via EmailJS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
