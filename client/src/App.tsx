import { useState, useEffect } from 'react'
import type { Proyect } from "@prisma/client";
import './App.css'

function App() {
  const [proyects, setProyects] = useState<Proyect[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000');
        const data : Proyect[] = await response.json();
        setProyects(data);
        // Process the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <>
      <div>
        <h1>Proyectos</h1>
        {proyects.map((proyect: Proyect) => (
          <div key={proyect.id}>
            <h2>{proyect.name}</h2>
          </div>
        ))}
      </div>
    </>
  )
}

export default App