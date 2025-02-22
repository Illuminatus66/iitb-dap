import axios from "axios";

const API = axios.create({
  baseURL: "https://baseURL.com/",
});

API.interceptors.request.use(async (req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    const parsedProfile = JSON.parse(profile);
    if (parsedProfile.token) {
      req.headers.authorization = `Bearer ${parsedProfile.token}`;
    }
  }

  return req;
});

interface FetchReportsResponse {
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  file_id?: string;
  audio_type?: string;
  decoded_text?: string;
  no_words?: number;
  no_del?: number;
  del_details?: string;
  no_ins?: number;
  ins_details?: string;
  no_subs?: number;
  subs_details?: string;
  no_miscue?: number;
  no_corr?: number;
  wcpm?: number;
  speech_rate?: number;
  pron_score?: number;
  percent_attempt?: number;
  audio_url?: string;
  story: string;
  request_time?: string;
  response_time?: string;
}

interface AudioUploadRequest {
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
}

interface AudioUploadResponse {
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
  audio_url: string;
}

interface ReportGenerationRequest {
  audio_url: string;
  reference_text_id: string;
  uid: string;
  request_time: string;
}

interface ReportGenerationResponse {
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  file_id: string;
  audio_type: string;
  decoded_text: string;
  no_words: number;
  no_del: number;
  del_details: string;
  no_ins: number;
  ins_details: string;
  no_subs: number;
  subs_details: string;
  no_miscue: number;
  no_corr: number;
  wcpm: number;
  speech_rate: number;
  pron_score: number;
  percent_attempt: number;
  audio_url: string;
  story: string;
  request_time: string;
  response_time: string;
}

export const fetchAllReports = () =>
  API.get<FetchReportsResponse[]>(`/fetch-all-reports`);

export const uploadAudio = (audioUploadData: AudioUploadRequest) =>
  API.post<AudioUploadResponse>("/upload-audio", audioUploadData);

export const triggerReportGeneration = (reportGenerationData: ReportGenerationRequest) =>
  API.post<ReportGenerationResponse>("/generate-report", reportGenerationData);



