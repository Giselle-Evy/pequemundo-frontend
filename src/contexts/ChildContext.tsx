import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Child } from '../types';

interface ChildContextData {
  child: Child | null;
  setChild: (child: Child | null) => void;
  clearChild: () => void;
}

const ChildContext = createContext<ChildContextData | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [child, setChildState] = useState<Child | null>(null);

  // Al iniciar, cargar el perfil guardado
  useEffect(() => {
    const savedChild = localStorage.getItem('pequemundo_child');
    if (savedChild) {
      setChildState(JSON.parse(savedChild));
    }
  }, []);

  function setChild(newChild: Child | null) {
    if (newChild) {
      localStorage.setItem('pequemundo_child', JSON.stringify(newChild));
    } else {
      localStorage.removeItem('pequemundo_child');
    }
    setChildState(newChild);
  }

  function clearChild() {
    localStorage.removeItem('pequemundo_child');
    setChildState(null);
  }

  return (
    <ChildContext.Provider value={{ child, setChild, clearChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild debe usarse dentro de ChildProvider');
  }
  return context;
}