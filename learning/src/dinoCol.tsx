import './DinoCol.css'; // your custom styling
import type { dino } from './types.ts';

interface props{
    dino:dino,
    isOpen:boolean,
    onToggle:() => void;
}



const DinoItem = ({ dino, isOpen, onToggle }:props) => {
  return (
    <div className="dino-item">
      <div className="dino-header" tabIndex={0} onClick={onToggle}
       onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // prevents scrolling on Space
      onToggle();
    }
  }}>
        <span className="dino-name">{dino.name}</span>
      </div>

      <div className={`dino-details ${isOpen ? 'open' : ''}`}>
        <p><strong>Family</strong> {dino.family}</p>
        <p><strong>Time Period:</strong> {dino.start_period} – {dino.end_period}</p>
        <p><strong>Continents:</strong> {dino.continents.join(', ')}</p>
        <p><strong>Regions:</strong> {dino.regions.join(', ')}</p>
      </div>
    </div>
  );
};

export default DinoItem;
