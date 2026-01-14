import { Ban } from "lucide-react";

export default function SearchError({ message }) {
  return (
    <div className="search-error-message" style={{
      display: 'flex',
      justifyContent: 'center',
      
      
      alignItems: 'center',
      gap: '10px',
      marginTop: '15px',
      color: '#ffffff'
    }}>
     <h1>Nenhum resultado de pesquisa encontrado</h1>
    </div>
  );
}