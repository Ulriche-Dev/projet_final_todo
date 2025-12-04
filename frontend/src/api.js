const API_BASE = 'http://127.0.0.1:8000/taches/api/taches/';

export async function fetchTaches(token) {
  const response = await fetch(API_BASE, {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return await response.json();
}

export async function ajouterTache(token, titre, description) {
  const response = await fetch(API_BASE, {
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
  const response = await fetch(`${API_BASE}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 204) throw new Error(`Erreur HTTP : ${response.status}`);
}

export async function toggleTache(token, tache) {
  const response = await fetch(`${API_BASE}${tache.id}/`, {
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