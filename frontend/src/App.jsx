import React, { useState, useEffect } from 'react';
import TacheListe from './components/TacheListe';
import AjoutTacheForm from './components/AjoutTacheForm';

function App() {
  const [taches, setTaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const token = '63c3972ec0bf3f6f09da312be152f1c79138a1dc'; // tjk
  // const token = '0a0130a7ae459d84e03d0a3b3c632aeda47c8119'; // user2

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const response = await fetch('http://localhost:8000/taches/api/taches/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        setTaches(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        setErreur("Impossible de charger les tâches.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaches();
  }, []);

  const handleAjoutTache = async (titre, description) => {
    try {
      const response = await fetch('http://localhost:8000/taches/api/taches/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre,
          description: description || '',
          termine: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API (ajout) :', errorData);
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const nouvelleTache = await response.json();
      setTaches((prev) => [...prev, nouvelleTache]);
    } catch (error) {
      console.error('Erreur lors de l’ajout de la tâche :', error);
      setErreur("Impossible d’ajouter la tâche.");
    }
  };

  const handleSupprimeTache = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/taches/api/taches/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 204) {
        setTaches((prev) => prev.filter((tache) => tache.id !== id));
      } else {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
      setErreur("Impossible de supprimer la tâche.");
    }
  };

  const handleToggleTache = async (id, termine) => {
    const tache = taches.find((t) => t.id === id);
    if (!tache) {
      console.error("Tâche introuvable pour le toggle :", id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/taches/api/taches/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: tache.titre,
          description: tache.description || '',
          termine: !termine,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API (toggle) :', errorData);
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const tacheModifiee = await response.json();

      setTaches((prevTaches) =>
        prevTaches.map((t) =>
          t.id === id ? { ...t, termine: tacheModifiee.termine } : t
        )
      );
    } catch (error) {
      console.error('Erreur lors du changement d’état de la tâche :', error);
      setErreur("Impossible de modifier la tâche.");
    }
  };

  return (
    <div>
      <h1>Ma Liste de Tâches</h1>
      <AjoutTacheForm onAjoutTache={handleAjoutTache} />
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <TacheListe
          taches={taches}
          onSupprimeTache={handleSupprimeTache}
          onToggleTache={handleToggleTache}
        />
      )}
    </div>
  );
}

export default App;