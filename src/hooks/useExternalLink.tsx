"use client";
import { GET_JOB_DETAIL } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import React, { createContext, useContext, useState, useEffect } from "react";


interface ExternalLinkContextProps {
  externalLink: string | null;
  setExternalLink: (link: string) => void;
  jobID: string | null;
  fetchJobID: (decodeId: string) => Promise<void>;
}

const ExternalLinkContext = createContext<ExternalLinkContextProps | null>(null);

export const ExternalLinkProvider = ({ children }: { children: React.ReactNode }) => {
  const [externalLink, setExternalLink] = useState<string | null>(null);
  const [jobID, setJobID] = useState<string | null>(null);

  const fetchJobID = async (decodeId: string) => {
    try {
      const response = await apiInstance.get(`${GET_JOB_DETAIL}/${decodeId}`);
      const job = response.data?.data;
      if (job?.id) {
        setJobID(job.id);
      } else {
        console.warn("Job ID not found in API response");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
    }
  };

  return (
    <ExternalLinkContext.Provider
      value={{
        externalLink,
        setExternalLink,
        jobID,
        fetchJobID,
      }}
    >
      {children}
    </ExternalLinkContext.Provider>
  );
};

/**
 * Hook to use external link context globally
 */
export function useExternalLink() {
  const context = useContext(ExternalLinkContext);
  if (!context) {
    throw new Error("useExternalLink must be used within an ExternalLinkProvider");
  }
  return context;
}
