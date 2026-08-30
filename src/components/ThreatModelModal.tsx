import React from 'react';
import { Shield, Lock, Cpu, Database, Network, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ThreatModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatModelModal: React.FC<ThreatModelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const threatMatrix = [
    {
      domain: '1. Input Surfaces',
      icon: Shield,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      risks: [
        'Oversized payloads & token exhaustion DoS',
        'XSS injection via unsanitized journal titles/notes',
        'Control character or null-byte payload tampering'
      ],
      countermeasures: [
        'Body parser capped at 1MB with strict schema validation',
        'Input sanitization stripping control chars and null-bytes',
        'Safe React rendering preventing HTML/script execution'
      ]
    },
    {
      domain: '2. Prompt Injection & Reasoning',
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      risks: [
        'Direct prompt injection seeking to alter AI persona',
        'Jailbreak attempts trying to bypass medical/diagnostic guardrails',
        'Indirect system instruction leakage'
      ],
      countermeasures: [
        'Untrusted user inputs bounded in explicit delimiters',
        'Hard system instructions establishing reflective, non-diagnostic persona',
        'Strict output JSON schema validation for Mood Insights'
      ]
    },
    {
      domain: '3. Tool & API Execution',
      icon: Lock,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      risks: [
        'Exposure of GEMINI_API_KEY to client browser bundles',
        'API quota exhaustion or unexpected upstream 503/429/500 errors',
        'Arbitrary code execution or unsafe dynamic evaluations'
      ],
      countermeasures: [
        'Server-side Express proxy (Zero client-side secrets)',
        'Resilient 4-tier model fallback: 3.6-flash → 3.1-flash-lite → flash-latest → 3.7-flash',
        'Strictly isolated static handlers without dynamic code evaluation'
      ]
    },
    {
      domain: '4. Memory, State & Firestore',
      icon: Database,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      risks: [
        'Cross-user data leakage (User A viewing User B’s private reflections)',
        'Unauthenticated or unauthorized read/write/delete operations',
        'Insecure wildcard Firestore security rules'
      ],
      countermeasures: [
        'Strict UID-isolated paths: /users/{userId}/journal_entries/{id}',
        'Deployed Firestore Security Rules: request.auth.uid == userId',
        'Default deny-all rule for all root document collections'
      ]
    },
    {
      domain: '5. Inter-System Communication',
      icon: Network,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      risks: [
        'Man-in-the-Middle token interception or session hijacking',
        'CORS exploitation and credential forwarding'
      ],
      countermeasures: [
        'HTTPS/TLS enforced on all API and Firebase transport channels',
        'Standard OAuth 2.0 Google Sign-In with Firebase Auth session tokens',
        'Environment variables injected server-side via runtime secrets'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-400/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-display text-white">Threat Modeling & Security Architecture</h2>
              <p className="text-xs text-stone-300">Hack2Skill Gen AI Academy Ideathon Security Directives & OWASP Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold">Security Assertion:</span> All user reflections, multi-turn conversations, and mood analytics are protected by end-to-end user UID isolation, server-side secret encapsulation, and resilient multi-model Gemini fallbacks.
            </div>
          </div>

          <div className="space-y-4">
            {threatMatrix.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                  <div className={`px-4 py-3 border-b flex items-center gap-2.5 font-semibold text-sm ${item.color}`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.domain}</span>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50/50 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-medium text-rose-700 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Identified Threat Vectors</span>
                      </div>
                      <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
                        {item.risks.map((risk, rIdx) => (
                          <li key={rIdx}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-medium text-emerald-700 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Implemented Countermeasures</span>
                      </div>
                      <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
                        {item.countermeasures.map((measure, mIdx) => (
                          <li key={mIdx}>{measure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            Close Threat Model
          </button>
        </div>
      </div>
    </div>
  );
};
