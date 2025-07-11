// DevTools.tsx
import { useState } from 'react';
import dinoList from './clean_dino_list.json';
import './dev.css';

interface DinoRow {
  name: string;
  enriched?: EnrichedDino;
  found?: boolean;
}

interface EnrichedDino {
  occurrences?: number;
  regionList?: string[];
  earliest?: string;
  latest?: string;
  family?: string;
}

export default function DevTools() {
  const [rows, setRows] = useState<DinoRow[]>(
    dinoList.map((name: string) => ({ name }))
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof EnrichedDino | 'name'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [progress, setProgress] = useState<number>(0);

  const enrichAll = async () => {
    const updated = [...rows];
    let done = 0;

    for (let row of updated) {
      try {
        const res = await fetch(`https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(row.name)}&show=loc,time,phylo,strat`);
        const data = await res.json();
        const records = data.records || [];

        if (records.length > 0) {
          const regions = new Set<string>();
          let earliest = records[0].oei || '?';
          let latest = records[0].oli || '?';
          let family = records[0].fml || '-';

          for (const rec of records) {
            if (rec.cc2) regions.add(rec.cc2);
          }

          row.enriched = {
            occurrences: records.length,
            regionList: Array.from(regions),
            earliest,
            latest,
            family
          };
          row.found = true;
        } else {
          row.found = false;
        }
      } catch (e) {
        row.found = false;
      }

      done++;
      setProgress(done);
      setLogs(l => [...l, `${row.name}: ${row.found ? '✔ Found' : '✖ Not found'}`]);
      setRows([...updated]);
      await new Promise(res => setTimeout(res, 500));
    }
  };

  const saveJSON = () => {
    const enriched = rows.filter(r => r.enriched);
    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dino_enriched.json';
    a.click();
  };

  const handleSort = (key: keyof EnrichedDino | 'name') => {
    setSortBy(key);
    setSortAsc(prev => (key === sortBy ? !prev : true));
    setRows(prev => [...prev].sort((a, b) => {
      const aVal = key === 'name' ? a.name : a.enriched?.[key] ?? '';
      const bVal = key === 'name' ? b.name : b.enriched?.[key] ?? '';

      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortAsc ? aVal - bVal : bVal - aVal;
      return sortAsc ? ('' + aVal).localeCompare('' + bVal) : ('' + bVal).localeCompare('' + aVal);
    }));
  };

  return (
    <div className="devtools-container">
      <h2>Dino Enrichment Dev Tools</h2>
      <div className="controls">
        <button onClick={enrichAll}>Run (All)</button>
        <button onClick={saveJSON}>Save JSON</button>
      </div>
      <div className="status-bar">
        {progress} / {rows.length} processed
      </div>
      <table className="dino-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th>Found</th>
            <th onClick={() => handleSort('occurrences')}>Occurrences</th>
            <th onClick={() => handleSort('family')}>Family</th>
            <th onClick={() => handleSort('earliest')}>Time Range</th>
            <th onClick={() => handleSort('regionList')}>Regions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.found ? '✔' : '✖'}</td>
              <td>{row.enriched?.occurrences ?? '-'}</td>
              <td>{row.enriched?.family || '-'}</td>
              <td>{row.enriched?.earliest || '?'} - {row.enriched?.latest || '?'}</td>
              <td>{row.enriched?.regionList?.join(', ') || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="log">
        <h4>Log</h4>
        <pre>{logs.join('\n')}</pre>
      </div>
    </div>
  );
}
