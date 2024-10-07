"use client";
import { CompanyI } from "@/app.interface";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface CompaniesContextType {
  companiesState: CompanyI[];
  setCompaniesState: Dispatch<SetStateAction<CompanyI[]>>;
}

interface CompaniesProviderI {
  children: ReactNode;
  companies: CompanyI[];
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(
  undefined
);

export const useCompaniesContext = () => {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error(
      "useCompaniesContext must be used within a CompaniesProvider"
    );
  }
  return context;
};

export const CompaniesProvider = ({
  children,
  companies,
}: CompaniesProviderI) => {
  const [companiesState, setCompaniesState] = useState(companies);

  useEffect(() => {
    setCompaniesState(companies);
  }, [companies]);
  return (
    <CompaniesContext.Provider value={{ companiesState, setCompaniesState }}>
      {children}
    </CompaniesContext.Provider>
  );
};
