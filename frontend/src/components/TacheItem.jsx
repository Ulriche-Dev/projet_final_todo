import React from 'react';

function TacheItem({ tache, onSupprime, onToggle }) {
  const handleDelete = () => {
    onSupprime(tache.id);
  };

  const handleToggle = () => {
    onToggle(tache.id, tache.termine);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={tache.termine}
        onChange={handleToggle}
        style={{ marginRight: '0.5rem' }}
      />
      <span style={{ textDecoration: tache.termine ? 'line-through' : 'none' }}>
        {tache.titre}
      </span>
      <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>
        Supprimer
      </button>
    </li>
  );
}

export default TacheItem;