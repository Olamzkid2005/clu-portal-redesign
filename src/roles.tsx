import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "student" | "lecturer" | "bursar" | "ict" | "vc" | "registrar";

export interface RoleMeta {
  label: string;
  short: string;
  name: string;
  detail: string;
  email: string;
  home: string;
  photo?: string;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  student: {
    label: "Student",
    short: "Student",
    name: "Adaeze N. Okonkwo",
    detail: "CLU210118-042",
    email: "adaeze.okonkwo@chrislanduniversity.edu.ng",
    home: "dashboard",
    photo: "/student-avatar.jpg",
  },
  lecturer: {
    label: "Lecturer",
    short: "Lecturer",
    name: "Dr. Bamidele Adeyemi",
    detail: "Software Engineering",
    email: "b.adeyemi@chrislanduniversity.edu.ng",
    home: "lecturer",
  },
  bursar: {
    label: "Bursar",
    short: "Bursar",
    name: "Mrs. Folake Adekunle",
    detail: "Chief Finance Officer",
    email: "f.adekunle@chrislanduniversity.edu.ng",
    home: "bursar",
  },
  ict: {
    label: "ICT personnel",
    short: "ICT",
    name: "Mr. Tochukwu Okafor",
    detail: "Directorate of ICT",
    email: "t.okafor@chrislanduniversity.edu.ng",
    home: "ict",
  },
  vc: {
    label: "Vice Chancellor",
    short: "VC",
    name: "Prof. Chinedu Eze",
    detail: "Office of the Vice Chancellor",
    email: "c.eze@chrislanduniversity.edu.ng",
    home: "vc",
  },
  registrar: {
    label: "Registrar",
    short: "Registrar",
    name: "Dr. Maryam Bello",
    detail: "Registry · Academic Affairs",
    email: "m.bello@chrislanduniversity.edu.ng",
    home: "registrar",
  },
};

export const ROLE_ORDER: Role[] = ["student", "lecturer", "bursar", "ict", "vc", "registrar"];

interface RoleApi {
  role: Role;
  setRole: (role: Role) => void;
  signedIn: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
}

const AUTH_VERSION = "quad-gate-2026-11-10";
const AUTH_VERSION_KEY = "clu-auth-version";
const SESSION_KEY = "clu-portal-session";
const ROLE_KEY = "clu-portal-role";

// Retire the demo's original persistent login. A fresh visit must always reach the gate.
const retirePreviousSessions = () => {
  try {
    localStorage.removeItem("clu-session");
  } catch {
    // Storage can be unavailable in a restricted preview.
  }
  try {
    sessionStorage.removeItem("clu-session");
  } catch {
    // Storage can be unavailable in a restricted preview.
  }
  try {
    if (localStorage.getItem(AUTH_VERSION_KEY) !== AUTH_VERSION) {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
      localStorage.removeItem("clu-role");
    }
  } catch {
    // The gate still starts signed out when storage is unavailable.
  }
};

const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "active";
  } catch {
    return false;
  }
};

const readRole = (): Role => {
  try {
    const stored = sessionStorage.getItem(ROLE_KEY);
    return stored && stored in ROLE_META ? (stored as Role) : "student";
  } catch {
    return "student";
  }
};

const RoleContext = createContext<RoleApi>({
  role: "student",
  setRole: () => {},
  signedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(readRole);
  const [signedIn, setSignedIn] = useState(() => {
    retirePreviousSessions();
    return readSession();
  });

  useEffect(() => {
    if (!signedIn) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) !== "active") setSignedIn(false);
    } catch {
      // Keep the in-memory session when storage is unavailable.
    }
  }, [signedIn]);

  const setRole = useCallback((next: Role) => {
    try {
      sessionStorage.setItem(ROLE_KEY, next);
    } catch {
      // The in-memory role still changes.
    }
    setRoleState(next);
  }, []);

  const signIn = useCallback((next: Role) => {
    try {
      sessionStorage.setItem(ROLE_KEY, next);
      sessionStorage.setItem(SESSION_KEY, "active");
      localStorage.removeItem("clu-session");
    } catch {
      // The in-memory session still opens the selected workspace.
    }
    setRoleState(next);
    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("clu-session");
    } catch {
      // The in-memory session still closes.
    }
    setSignedIn(false);
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, signedIn, signIn, signOut }}>
      {children}
    </RoleContext.Provider>
  );
}

export const initialsFor = (name: string) =>
  name
    .split(" ")
    .filter((word) => /^[A-Za-z]/.test(word))
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
