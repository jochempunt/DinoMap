import { useEffect, useMemo, useState } from 'react';
import Map from './map.tsx';
import dinoList from './dino_data.json';
import type { dino } from './types.ts';
import DinoItem from './dinoCol.tsx';
import './where.css';

export default function Guess() {
  const [continent, setContinent] = useState("");
  const [popfilter, setPopFilter] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [dinos, setDinos] = useState<dino[]>([]);

  useEffect(() => {
    setDinos(dinoList);
  }, []);

  useEffect(() => {
    const validFamilies = new Set(
      dinos
        .filter(d => continent === "" || d.continents.includes(continent))
        .map(d => d.family)
    );
    if (!validFamilies.has(selectedFamily)) {
      setSelectedFamily("");
    }
  }, [continent, dinos, selectedFamily]);

  /// This gives all dinos based on continent and popular filter only
const preFilteredDinos = useMemo(() => {
  return dinos
    .filter(d => continent === "" || d.continents.includes(continent))
    .filter(d => !popfilter || d.popular);
}, [continent, popfilter, dinos]);

// Actual full filter 
const filteredDinos = useMemo(() => {
  return preFilteredDinos.filter(d =>
    selectedFamily === "" || d.family === selectedFamily
  );
}, [preFilteredDinos, selectedFamily]);

// Families for dropdown
const uniqueFamilies = useMemo(() => {
  const invalidFamilies = new Set(["-", "NO_FAMILY_SPECIFIED"]);
  const familySet = new Set(
    preFilteredDinos.map(d => d.family?.trim() || "")
  );
  return [...familySet].filter(f => !invalidFamilies.has(f));
}, [preFilteredDinos]);


  return (
    <>
      <Map cont={continent} setCont={setContinent} />

      <header className="header">
        <h2>{continent === "" ? "Everywhere" : continent}</h2>
        <span className="number">
          <strong>{filteredDinos.length}</strong> dinosaur species,
          <strong> {selectedFamily !== "" ? 1 : uniqueFamilies.length}</strong> {selectedFamily===""?"families":"family"}
        </span>
      </header>

      <div className="filters">

        <label htmlFor="popular" id="popularLabel">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={popfilter}
              onChange={() => setPopFilter(prev => !prev)}
              className="sc-gJwTLC ikxBAC"
              name='popular'
              id='popular'
            />
          </div>
          popular
        </label>

        <label  htmlFor='selectFamiliy'>
          <span id='familyLabel'>Family{" "}</span>
          <select
            id='selectFamiliy'
            name='selectFamiliy'
            value={selectedFamily}
            onChange={e => setSelectedFamily(e.target.value)}
          >
            <option value={""}>none</option>
            {uniqueFamilies.map(family => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="dino-list">
        {filteredDinos.map(dino => (
          <DinoItem
            key={dino.id}
            dino={dino}
            isOpen={dino.id === openId}
            onToggle={() => setOpenId(openId === dino.id ? null : dino.id)}
          />
        ))}
      </section>

      <footer className="app-footer">
        <p>
          <strong>Note:</strong> This dataset does not include all discovered dinosaur species.
          It focuses on well-described and confirmed dinosaurs based on available data.
          Source:{" "}
          <a href="https://paleobiodb.org" target="_blank" rel="noopener noreferrer">
            PaleoDB
          </a>
        </p>
      </footer>
    </>
  );
}
