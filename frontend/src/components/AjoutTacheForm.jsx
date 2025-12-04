import React, { useState } from 'react';

function AjoutTacheForm({ onAjoutTache }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (titre.trim() !== '') {
      onAjoutTache(titre, description);
      setTitre('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre de la tâche"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description (facultative)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AjoutTacheForm;