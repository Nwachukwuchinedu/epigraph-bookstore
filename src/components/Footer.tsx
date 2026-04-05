import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <a href="#" className="text-2xl font-semibold tracking-tighter text-stone-900 block mb-6">EPIGRAPH.</a>
            <p className="text-stone-500 text-sm mb-6 max-w-xs">
              A sanctuary for the curious mind. Curating the finest in literature, design, and thought.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-stone-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><a href="#" className="hover:text-stone-900 transition-colors">All Books</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Bestsellers</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Rare Editions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-900 mb-6">About</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><a href="#" className="hover:text-stone-900 transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Locations</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-900 mb-6">Newsletter</h4>
            <p className="text-sm text-stone-500 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-stone-400 transition-colors"
              />
              <button className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-stone-100 text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} Epigraph Bookstore. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
