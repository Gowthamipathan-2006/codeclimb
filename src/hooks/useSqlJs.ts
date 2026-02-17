
import { useState, useEffect, useCallback, useRef } from 'react';
import initSqlJs, { Database } from 'sql.js';

export interface SqlResult {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
}

const SAMPLE_SCHEMA = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  salary INTEGER,
  department TEXT,
  role TEXT
);
INSERT INTO employees (name, salary, department, role) VALUES
  ('Ravi', 60000, 'IT', 'Developer'),
  ('Anu', 45000, 'HR', 'Manager'),
  ('Kiran', 75000, 'Finance', 'Analyst'),
  ('Meena', 52000, 'IT', 'Developer'),
  ('Suresh', 80000, 'IT', 'Lead'),
  ('Priya', 48000, 'HR', 'Recruiter'),
  ('Arjun', 70000, 'Finance', 'Manager'),
  ('Divya', 55000, 'Sales', 'Executive');

CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT,
  marks INTEGER,
  grade TEXT
);
INSERT INTO students (name, marks, grade) VALUES
  ('Alice', 92, 'A'),
  ('Bob', 78, 'B'),
  ('Charlie', 85, 'A'),
  ('Diana', 65, 'C'),
  ('Eve', 90, 'A'),
  ('Frank', 72, 'B');
`;

export const useSqlJs = (enabled: boolean) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<Database | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const init = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file: string) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
        });
        if (cancelled) return;
        const db = new SQL.Database();
        db.run(SAMPLE_SCHEMA);
        dbRef.current = db;
        setReady(true);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      }
    };

    init();

    return () => {
      cancelled = true;
      dbRef.current?.close();
      dbRef.current = null;
      setReady(false);
    };
  }, [enabled]);

  const resetDatabase = useCallback(async () => {
    if (!enabled) return;
    try {
      dbRef.current?.close();
      const SQL = await initSqlJs({
        locateFile: (file: string) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
      });
      const db = new SQL.Database();
      db.run(SAMPLE_SCHEMA);
      dbRef.current = db;
    } catch (err: any) {
      setError(err.message);
    }
  }, [enabled]);

  const executeQuery = useCallback(
    (query: string): { results: SqlResult[]; error: string | null } => {
      if (!dbRef.current) {
        return { results: [], error: 'SQL environment not ready.' };
      }
      try {
        const raw = dbRef.current.exec(query);
        const results: SqlResult[] = raw.map((r) => ({
          columns: r.columns,
          values: r.values,
        }));
        return { results, error: null };
      } catch (err: any) {
        return { results: [], error: err.message };
      }
    },
    []
  );

  return { ready, error, executeQuery, resetDatabase };
};
