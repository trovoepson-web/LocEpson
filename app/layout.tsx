import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Epson Locação Têxtil - Simulador & Gerador de Propostas',
  description: 'Sistema comercial e administrativo Epson para simulação financeira de locação de impressoras de sublimação têxtil (F6470, F9570, F20070), amortização e propostas comerciais com IA.',
  openGraph: {
    title: 'Epson Locação Têxtil - Simulador & Gerador de Propostas',
    description: 'Sistema comercial e administrativo Epson para simulação financeira de locação de impressoras de sublimação têxtil (F6470, F9570, F20070), amortização e propostas comerciais com IA.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epson Locação Têxtil - Simulador & Gerador de Propostas',
    description: 'Sistema comercial e administrativo Epson para simulação financeira de locação de impressoras de sublimação têxtil (F6470, F9570, F20070), amortização e propostas comerciais com IA.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
