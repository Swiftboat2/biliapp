import React, { createContext, useContext, useState } from 'react';

/** La misma app sirve a familias y alumnos; el modo define qué navegación se muestra. */
export type AppMode = 'familia' | 'alumno';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextType>({ mode: 'familia', setMode: () => {} });

export const AppModeProvider: React.FC<{ children: React.ReactNode; initialMode?: AppMode }> = ({
  children,
  initialMode = 'familia',
}) => {
  const [mode, setMode] = useState<AppMode>(initialMode);
  return <AppModeContext.Provider value={{ mode, setMode }}>{children}</AppModeContext.Provider>;
};

export const useAppMode = () => useContext(AppModeContext);
