import React, { useEffect, useState } from "react";
import axios from "axios";
import { projet } from "./projet"; 


/* const initialPieces = [
  { id: 1, titre: "Le Roi Lear", auteur: "William Shakespeare", genre: "Tragédie", duree: 120, prix: 50, capacite: 180, ticketsvendu: 80 },
  { id: 2, titre: "Le Malade Imaginaire", auteur: "Molière", genre: "Comédie", duree: 90, prix: 40, capacite: 220, ticketsvendu: 190 },
]; */


export default function App() {
    
    return (
      <div>
        <h1>Liste des posts</h1>
        <projet/>
      </div>
    )
  /* const [pieces, setPieces] = useState(initialPieces);
  const [search, setSearch] = useState("");
  const [genreFiltre, setGenreFiltre] = useState("");
  const [pieceAModifier, setPieceAModifier] = useState({ titre: "", auteur: "", genre: "", prix: "", duree: "", capacite: "" })

  const ajouterPiece = (p) => setPieces([...pieces, p]);
  const supprimerPiece = (i) => setPieces(pieces.filter((_, index) => index !== i))
  const modifierPiece = (i) => setPieceAModifier({ ...pieces[i] });
  const validerModification = (p) => {
    setPieces(pieces.map((pi) => (pi.id === p.id ? p : pi)));
    setPieceAModifier({ titre: "", auteur: "", genre: "", prix: "", duree: "", capacite: "" })
  }
  const annulerModification = () => setPieceAModifier({ titre: "", auteur: "", genre: "", prix: "", duree: "", capacite: "" })

  const piecesFiltrees = pieces.filter(p => {
    const matchTitre = search === "" || p.titre.includes(search);
    const matchGenre = genreFiltre === "" || p.genre === genreFiltre;
    return matchTitre && matchGenre;
  });
 */
 {
  /* return (
    <div>
      

      <FormPiece
        ajouterPiece={ajouterPiece}
        pieceAModifier={pieceAModifier}
        validerModification={validerModification}
        annulerModification={annulerModification}
        setPieceAModifier={setPieceAModifier}
      />

      <fieldset>
        <legend>Recherche</legend>
        <input
          type="text"
          placeholder="Rechercher par titre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genreFiltre} onChange={(e) => setGenreFiltre(e.target.value)}>
          <option value="">Tous les genres</option>
          <option value="Tragédie">Tragédie</option>
          <option value="Comédie">Comédie</option>
          <option value="Drame">Drame</option>
        </select>
      </fieldset>

      <ListePieces
        pieces={piecesFiltrees}
        supprimerPiece={supprimerPiece}
        modifierPiece={modifierPiece}
      />

      <TicketManager pieces={pieces} setPieces={setPieces} />
    </div>
  ); */
  
 } 
}
