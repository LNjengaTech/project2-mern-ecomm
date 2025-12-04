import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assuming you have these solid icons available from previous steps
import { faFacebookF, faTwitter, faInstagram, faPinterest, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  // Helper component for rendering a column of links
  const FooterColumn = ({ title, links }) => (
    <div className="flex flex-col space-y-3">
      <h3 className="text-lg font-bold uppercase mb-2">{title}</h3>
      {links.map((link, index) => (
        <a key={index} href={link.href} className="text-sm text-gray-400 hover:text-white transition duration-150">
          {link.text}
        </a>
      ))}
    </div>
  );

  return (
    <footer className="bg-gray-800 w-full m-0 text-white mt-auto">
      
      {/* --- 1. Main Content Area (4-Column Layout) --- */}
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Column 1: Logo and Contact Info */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-4">
            {/* 🔑 Logo Placeholder - Replace with your actual logo component or image */}
            <div className="flex items-center">
              <span className="text-xl font-black text-white">ProTech Electronics</span> 
            </div>
            
            <p className="text-sm text-gray-400">223 Beach Avenue, Mombasa City, CA 00000</p>
            <p className="text-sm text-gray-400">contact@protech.ke</p>
            <p className="text-sm text-gray-400">+254 113 697 897</p>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" aria-label="Pinterest" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faPinterest} /></a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>

          {/* Column 2: COMPANY */}
          <FooterColumn 
            title="COMPANY"
            links={[
              { text: "About Us", href: "/about" },
              { text: "Careers", href: "/careers" },
              { text: "Affiliates", href: "/affiliates" },
              { text: "Blog", href: "/blog" },
              { text: "Contact Us", href: "/contact" },
            ]}
          />

          {/* Column 3: SHOP */}
          <FooterColumn 
            title="SHOP"
            links={[
              { text: "New Arrivals", href: "/" },
              { text: "Accessories", href: "/shop/accessories" },
              { text: "Men", href: "/shop/men" },
              { text: "Women", href: "/shop/women" },
              { text: "Shop All", href: "/shop" },
            ]}
          />

          {/* Column 4: HELP */}
          <FooterColumn 
            title="HELP"
            links={[
              { text: "Customer Service", href: "/help/customer-service" },
              { text: "My Account", href: "/account" },
              { text: "Find a Store", href: "/find-store" },
              { text: "Legal & Privacy", href: "/legal" },
              { text: "Gift Card", href: "/gift-card" },
            ]}
          />

          {/* Column 5: CATEGORIES */}
          <FooterColumn 
            title="CATEGORIES"
            links={[
              { text: "Shirts", href: "/category/shirts" },
              { text: "Jeans", href: "/category/jeans" },
              { text: "Shoes", href: "/category/shoes" },
              { text: "Bags", href: "/category/bags" },
              { text: "Shop All", href: "/shop" },
            ]}
          />
        </div>
      </div>

      {/* --- 2. Bottom Legal/Copyright Bar --- */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} ProTech Electronics. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-white">Terms & Conditions</a>
          </div>
          {/* 🔑 Scroll to Top Arrow (Optional) */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hidden lg:block bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
            aria-label="Scroll to top"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          </button>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;