// api.js
const API_BASE = import.meta.env.VITE_API_BASE;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// Fonction utilitaire pour construire l'URL complète
function getFullUrl(path) {
  // Utilise le même domaine et protocole que le frontend
  return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}${path}`;
}

export async function fetchTaches(token) {
  const response = await fetch(getFullUrl(API_BASE), {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return await response.json();
}

export async function ajouterTache(token, titre, description) {
  const response = await fetch(getFullUrl(API_BASE), {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ titre, description: description || '', termine: false }),
  });
  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return await response.json();
}

export async function supprimerTache(token, id) {
  const response = await fetch(getFullUrl(`${API_BASE}${id}/`), {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 204) throw new Error(`Erreur HTTP : ${response.status}`);
}

export async function toggleTache(token, tache) {
  const response = await fetch(getFullUrl(`${API_BASE}${tache.id}/`), {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      titre: tache.titre,
      description: tache.description || '',
      termine: !tache.termine,
    }),
  });
  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return await response.json();
}

// Pour la connexion
export async function login(username, password) {
  const response = await fetch(getFullUrl(API_TOKEN), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Échec de la connexion');
  return await response.json();
}
