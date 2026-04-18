import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { Button } from './components/Button';
import './index.css';

const SimulatedButton = ({ children, variant, size, onClick }: { children: React.ReactNode, variant: 'primary' | 'secondary' | 'ghost' | 'danger', size: 'sm' | 'md' | 'lg', onClick?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Button isLoading={isLoading} onClick={handleClick} variant={variant} size={size}>
      {children}
    </Button>
  );
};

function App() {
  const [persistentSearch, setPersistentSearch] = useLocalStorage<string>('search-query', '');
  const debouncedSearch = useDebounce(persistentSearch, 500);
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    console.log("API CALL:", debouncedSearch);
    if (debouncedSearch) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setResults([
          `Result for "${debouncedSearch}" 1`,
          `Result for "${debouncedSearch}" 2`,
          `Result for "${debouncedSearch}" 3`,
        ]);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  const handleClear = () => {
    setPersistentSearch('');
  };

  return (
    <div className="container">
      <h1>Search Interface</h1>

      <div className="card">
        <div className="input-group">
          <label htmlFor="search">Search Database</label>
          <input
            id="search"
            type="text"
            placeholder="Type to search..."
            value={persistentSearch}
            onChange={(e) => setPersistentSearch(e.target.value)}
          />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
            {isLoading ? 'Searching...' : results.length > 0 ? `Showing results for: ${debouncedSearch}` : 'No results to display'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {results.map((res, i) => (
              <li key={i} style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', 
                marginBottom: '0.5rem',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                {res}
              </li>
            ))}
          </ul>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />

        <div style={{ textAlign: 'left' }}>
          <label>Button Component Variants</label>
          <div className="button-grid">
            <SimulatedButton variant="primary" size="md" onClick={() => console.log('Primary clicked')}>
              Primary Action
            </SimulatedButton>
            <SimulatedButton variant="secondary" size="md" onClick={() => console.log('Secondary clicked')}>
              Secondary
            </SimulatedButton>
            <SimulatedButton variant="ghost" size="md" onClick={() => console.log('Ghost clicked')}>
              Ghostly
            </SimulatedButton>
            <SimulatedButton variant="danger" size="md" onClick={() => { console.log('Danger clicked'); handleClear(); }}>
              Clear Search
            </SimulatedButton>
          </div>
        </div>

        <div style={{ textAlign: 'left', marginTop: '2rem' }}>
          <label>Loading States & Sizes (Independent)</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <SimulatedButton variant="primary" size="sm">
              Small
            </SimulatedButton>
            <SimulatedButton variant="primary" size="md">
              Medium
            </SimulatedButton>
            <SimulatedButton variant="primary" size="lg">
              Large
            </SimulatedButton>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
