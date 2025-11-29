// /client/src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 w-full m-0 text-white mt-auto">
      <div className="container mx-auto py-4 text-center">
        <p>&copy; {new Date().getFullYear()} ProTech Electronics. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;