import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChildStudent {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  educationalLevel: 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA';
  courseName: string; // e.g. "Sala de 4 - Turno Tarde" o "3° A - Primaria"
  relationship: string;
}

interface StudentContextType {
  students: ChildStudent[];
  activeStudent: ChildStudent | null;
  setActiveStudent: (student: ChildStudent) => void;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType>({
  students: [],
  activeStudent: null,
  setActiveStudent: () => {},
  isLoading: false,
});

export const StudentProvider: React.FC<{ children: React.ReactNode; initialStudents?: ChildStudent[] }> = ({
  children,
  initialStudents = [],
}) => {
  const [students, setStudents] = useState<ChildStudent[]>(initialStudents);
  const [activeStudent, setActiveStudent] = useState<ChildStudent | null>(
    initialStudents.length > 0 ? initialStudents[0] : null
  );

  useEffect(() => {
    if (initialStudents.length > 0 && !activeStudent) {
      setActiveStudent(initialStudents[0]);
    }
    setStudents(initialStudents);
  }, [initialStudents]);

  return (
    <StudentContext.Provider
      value={{
        students,
        activeStudent,
        setActiveStudent,
        isLoading: false,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useActiveStudent = () => useContext(StudentContext);

