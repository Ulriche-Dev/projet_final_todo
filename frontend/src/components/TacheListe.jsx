import React from 'react';
import TacheItem from './TacheItem';

function TacheListe({ taches, onSupprimeTache, onToggleTache }) {
  return (
    <ul>
      {taches.map((tache) => (
        <TacheItem
          key={tache.id}
          tache={tache}
          onSupprime={onSupprimeTache}
          onToggle={onToggleTache}
        />
      ))}
    </ul>
  );
}

export default TacheListe;