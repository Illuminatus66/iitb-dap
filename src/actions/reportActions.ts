import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllReports,
  triggerReportGeneration,
  uploadAudio,
  uploadDetailsWithoutAudio,
} from "../api";

interface FetchReportsResponse {
  _id: string;
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

interface ReportGenerationRequest {
  audio_url: string;
  reference_text_id: string;
  uid: string;
  request_time: string;
}

interface ReportGenerationResponse {
  _id: string;
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

interface AudioUploadRequest {
  _id?: string;
  uid: string;
  name: string;
  story: string;
  audioFile: string;
}

interface AudioUploadResponse {
  _id: string;
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
  audio_url: string;
}

interface DetailsUploadRequest {
  uid: string;
  name: string;
  story: string;
}

interface DetailsUploadResponse {
  _id: string;
  uid: string;
  name: string;
  is_audio_uploaded: boolean;
  is_report_generated: boolean;
  story: string;
}

interface ReportsState {
  reports: FetchReportsResponse[];
  loading: boolean;
  error: string | null;
}

export const fetch_all_reports = createAsyncThunk<
  FetchReportsResponse[],
  void,
  { state: ReportsState; rejectValue: string }
>("reports/fetch_all_reports", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllReports();
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch reports";
    return rejectWithValue(errorMessage);
  }
});

export const trigger_report_generation = createAsyncThunk<
  ReportGenerationResponse,
  ReportGenerationRequest,
  { state: ReportsState; rejectValue: string }
>(
  "reports/trigger_report_generation",
  async (reportGenerationData, { rejectWithValue }) => {
    try {
      const response = await triggerReportGeneration(reportGenerationData);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate a report";
      return rejectWithValue(errorMessage);
    }
  }
);

export const upload_audio = createAsyncThunk<
  AudioUploadResponse,
  AudioUploadRequest,
  { state: ReportsState; rejectValue: string }
>("reports/upload_audio", async (audioUploadData, { rejectWithValue }) => {
  try {
    const response = await uploadAudio(audioUploadData);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to upload student details and audio file";
    return rejectWithValue(errorMessage);
  }
});

export const upload_details_without_audio = createAsyncThunk<
  DetailsUploadResponse,
  DetailsUploadRequest,
  { state: ReportsState; rejectValue: string }
>(
  "reports/upload_details_without_audio",
  async (detailsUploadData, { rejectWithValue }) => {
    try {
      const response = await uploadDetailsWithoutAudio(detailsUploadData);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload student details";
      return rejectWithValue(errorMessage);
    }
  }
);
