import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/bemyrider.svg" 
                alt="bemyrider" 
                width={32} 
                height={32}
              />
              <span className="text-2xl font-bold text-[#333366] font-manrope">
                bemyrider
              </span>
              <span className="text-2xl font-bold text-[#333366] font-manrope">
                Jobs
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              La piattaforma che connette esercenti locali e rider autonomi. 
              Trova l&apos;ingaggio perfetto o il candidato ideale per la tua attività.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="mailto:info@bemyrider.it" 
                className="text-[#333366] hover:underline"
              >
                info@bemyrider.it
              </a>
              <a 
                href="https://bemyrider.it" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#333366] hover:text-[#333366]/80 transition-colors"
              >
                bemyrider.it
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.app.bemyrider" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#333366] hover:text-[#333366]/80 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/publish" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Pubblica Annuncio
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Supporto</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@bemyrider.it" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Contattaci
                </a>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-600 hover:text-[#333366] transition-colors"
                >
                  Termini di Servizio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm mb-2">
              © {currentYear} bemyrider Jobs. Tutti i diritti riservati.
            </p>
            <p className="text-gray-500 text-xs">
              GO!Food Italia di Giorgio Di Martino - Via Mariano Stabile, 160 - 90139 Palermo - P. IVA: 06955440828
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">
              Made with ❤️ in Italia
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
