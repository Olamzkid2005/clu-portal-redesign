import { createContext, useContext } from "react";

export interface NavApi {
  route: string;
  go: (path: string) => void;
}

export const NavContext = createContext<NavApi>({
  route: "dashboard",
  go: () => {},
});

export const useNav = () => useContext(NavContext);
