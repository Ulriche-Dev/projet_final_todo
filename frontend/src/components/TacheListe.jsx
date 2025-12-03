import React, { useState, useEffect } from 'react';

function TacheListe() {
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/taches/api/taches/', {
          headers: {
            'Authorization': 'Token 0a0130a7ae459d84e03d0a3b3c632aeda47c8119', 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        setTaches(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
      }
    };

    fetchTaches();
  }, []);

  return (
    <ul>
      {taches.map((tache) => (
        <li key={tache.id}>{tache.titre}</li>
      ))}
    </ul>
  );
}

export default TacheListe;