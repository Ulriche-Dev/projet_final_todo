import React, { useState, useEffect } from 'react';
import TacheListe from './components/TacheListe';
import AjoutTacheForm from './components/AjoutTacheForm';
import LoginPage from './components/LoginPage';
import {
  fetchTaches,
  ajouterTache,
  supprimerTache,
  toggleTache,
} from './api';
import './styles.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [taches, setTaches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Connexion
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Échec de la connexion :', errorData);
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      const token = data.token || data.key || data.access || data.auth_token;

      if (!token) {
        throw new Error("Le token n'a pas été trouvé dans la réponse.");
      }

      localStorage.setItem('token', token);
      setToken(token);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      setErreur("Connexion échouée. Vérifie tes identifiants.");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTaches([]);
    setErreur(null);
  };

  // Chargement des tâches
  useEffect(() => {
    if (!token) return;

    const charger = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTaches(token);
        setTaches(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        setErreur("Impossible de charger les tâches.");
      } finally {
        setIsLoading(false);
      }
    };

    charger();
  }, [token]);

  // ➕ Ajout
  const handleAjoutTache = async (titre, description) => {
    try {
      const nouvelleTache = await ajouterTache(token, titre, description);
      setTaches((prev) => [...prev, nouvelleTache]);
    } catch (error) {
      console.error('Erreur lors de l’ajout de la tâche :', error);
      setErreur("Impossible d’ajouter la tâche.");
    }
  };

  // Suppression
  const handleSupprimeTache = async (id) => {
    try {
      await supprimerTache(token, id);
      setTaches((prev) => prev.filter((tache) => tache.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
      setErreur("Impossible de supprimer la tâche.");
    }
  };

  // Toggle
  const handleToggleTache = async (id, termine) => {
    const tache = taches.find((t) => t.id === id);
    if (!tache) return;

    try {
      const tacheModifiee = await toggleTache(token, tache);
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

  // Affichage conditionnel
  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Ma Liste de Tâches</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
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