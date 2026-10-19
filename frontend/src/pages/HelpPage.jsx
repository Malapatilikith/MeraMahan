import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Shield,
  PhoneCall,
  Scale,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'Why does MeraMahan use neutral terminology like "Alleged Incident" or "Suspected Bribery"?',
      a: 'MeraMahan is a citizen reporting platform, not an enforcement agency or a court. To protect citizens, uphold legal principles, and maintain platform credibility, user reports are presented as citizen submissions under review rather than proven facts.',
    },
    {
      q: 'Why is there no automatic GPS or map tracking?',
      a: 'We strictly respect citizen privacy. Location is entered manually via State, City, and area description. We do not collect or request device geolocation, browser coordinates, Aadhaar, or home addresses.',
    },
    {
      q: 'What happens after I submit a report?',
      a: 'Your report enters "Screening" status. Community moderators verify that the submission adheres to constructive civic guidelines and contains valid photographs. Once approved, it appears in the public feed where fellow citizens can support and comment.',
    },
    {
      q: 'How can I take an effective evidence photo?',
      a: 'Ensure good lighting, capture the immediate issue (e.g. pothole depth, garbage pile) along with recognizable surroundings (e.g. street sign or landmark) while avoiding people\'s private property or personal faces.',
    },
    {
      q: 'Can I report harassment or false submissions?',
      a: 'Yes. Every public report and comment features an "Inaccuracy or Abuse" flag that immediately alerts the moderation team.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF9933]" />
            Citizen Knowledge & Guidelines
          </div>
          <h1 className="text-3xl font-black text-slate-900">How MeraMahan Works</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Learn how to document public problems responsibly and uphold community standards.
          </p>
        </div>

        {/* Legal & Neutral Principles Banner */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
            <Scale className="w-4 h-4 text-[#FF9933]" />
            Our Legal & Editorial Principle
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Every submission on MeraMahan represents an allegation reported by a citizen. The
            platform never passes premature judgment. Submissions undergo screening and use neutral
            terms such as <strong>"Citizen Report"</strong>, <strong>"Under Review"</strong>,{' '}
            <strong>"Alleged Incident"</strong>, and <strong>"Verified Report"</strong>.
          </p>
        </div>

        {/* 3 Step Reporting Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            Reporting Best Practices
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-bold text-xs text-slate-900">Clear Photography</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Photograph the issue clearly. Up to 4 photos can be attached showing the wider
                context and close-up damage.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-bold text-xs text-slate-900">Specific Location</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manually pick your State and City, and write a helpful landmark (e.g. Near Bus Stand
                #3, Opposite SBI ATM).
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="font-bold text-xs text-slate-900">Constructive Language</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                State facts objectively. Avoid unverified accusations, defamation, profanity, or
                personal identities.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FF9933]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="pt-5 first:pt-0">
                <h3 className="text-xs font-bold text-slate-900">{faq.q}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <PhoneCall className="w-5 h-5 text-[#FF9933]" />
            <h2 className="text-base font-bold">Pan-India Emergency Numbers</h2>
          </div>
          <p className="text-xs text-slate-300 mb-6">
            For urgent life-threatening crises, fires, or immediate safety threats, contact official
            national emergency lines directly:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Emergency</span>
              <span className="text-lg font-mono font-bold text-[#FF9933]">112</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Police</span>
              <span className="text-lg font-mono font-bold text-white">100</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Ambulance</span>
              <span className="text-lg font-mono font-bold text-white">102</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Women Helpline</span>
              <span className="text-lg font-mono font-bold text-white">1091</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Cybercrime</span>
              <span className="text-lg font-mono font-bold text-emerald-400">1930</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            File a Citizen Report Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
