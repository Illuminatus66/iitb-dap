import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllReports,
  triggerReportGeneration,
  uploadAudio,
  uploadDetailsWithoutAudio,
} from "../api";
import {
  FetchReportsResponse,
  DetailsUploadRequest,
  DetailsUploadResponse,
  AudioUploadRequest,
  AudioUploadResponse,
  ReportGenerationRequest,
  ReportGenerationResponse,
} from "../api";

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
      error.response?.data?.message ||
      "Failed to upload student details and audio file";
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
