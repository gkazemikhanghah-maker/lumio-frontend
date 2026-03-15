const API_BASE = "https://lumio-backend-production.up.railway.app";

export interface AnalyzeRequest {
  job_title: string;
  experience_level: string;
  work_type: string;
  country: string;
  max_jobs: number;
}

export interface SkillData {
  skill: string;
  percentage: number;
  trend: "up" | "down" | "stable";
}

export interface SalaryData {
  median: number;
  min: number;
  max: number;
}

export interface CompanyData {
  name: string;
  positions: number;
  industry: string;
}

export interface TrendData {
  skill: string;
  change: number;
  direction: "up" | "down";
  icon: string;
}

export interface AnalyzeResponse {
  skills: SkillData[];
  salary: SalaryData;
  companies: CompanyData[];
  trends: TrendData[];
  summary: string;
}

export async function analyzeJob(params: AnalyzeRequest, signal?: AbortSignal): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300000); // 5 minutes

  // If an external signal aborts, abort our controller too
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onExternalAbort);
  }
}
