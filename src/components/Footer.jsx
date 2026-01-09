import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Quote Section */}
          <div className="flex flex-col items-start">
            <div className="mb-6">
              <img 
                src="/assets/logo.png" 
                alt="The FCC Logo" 
                className="h-20 w-auto"
              />
            </div>
            <div className="italic text-gray-400 leading-relaxed">
              <p className="mb-2">
                We aim to promote financial literacy on campus and inform its members about career opportunities in the financial industry.
                </p>
              
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">FINANCE & CONSULTING CLUB</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#aavartan" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Mudra
                </a>
              </li>
              <li>
                <a href="/#vigyaan" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Non-Core Week
                </a>
              </li>
              <li>
                <a href="/#ignite" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Earn
                </a>
              </li>
              <li>
                <a href="/#sponsors" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Sponsors
                </a>
              </li>
              <li>
                <a href="/#team" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Team
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">CONTACT</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:fcc@nitrr.ac.in" 
                  className="flex items-start text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>fcc@nitrr.ac.in</span>
                </a>
              </li>
              
              <li>
                <a 
                  href="https://www.google.com/maps/place/National+Institute+of+Technology,+Raipur/@21.2497222,81.6028404,17z"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>NIT Raipur, Raipur, CG 492013</span>
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">LETS CONNECT</h4>
              <div className="flex space-x-4">
                
                <a 
                  href="https://www.instagram.com/fccnitrr/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/finance-nitrr/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                
                
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500">
            Made With <span className="text-pink-400 font-bold">LOVE</span> by Tech Team
          </p>
        </div>

        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gray-800 text-gray-300 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:bg-gray-700"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;