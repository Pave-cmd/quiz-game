import React, { useEffect } from 'react';

interface TestComponentProps {
  items: string[];
}

export const TestComponent: React.FC<TestComponentProps> = ({ items }) => {
  const data: string[] = items;

  useEffect(() => {
    // Případná logika, která se má provést po montáži komponenty
  }, []);

  const handleClick = () => {
    // Přidat logiku pro obsluhu kliknutí
  };

  return (
    <div className="flex bg-blue-500 p-4 text-white hover:bg-blue-600">
      <img src="image.jpg" alt="Popis obrázku" />
      <button onClick={handleClick} onKeyDown={handleClick}>
        Click me
      </button>
      {data.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};