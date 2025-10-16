import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-b-lg">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        1 Menit Disiplin
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Bangun konsistensi, satu tugas kecil setiap saat.
      </p>
    </header>
  );
};

export default Header;