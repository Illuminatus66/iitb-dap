import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetch_all_reports,
  trigger_report_generation,
  upload_audio,
  upload_details_without_audio,
} from "../actions/reportActions";
import {
  AudioUploadResponse,
  DetailsUploadResponse,
  FetchReportsResponse,
  ReportGenerationResponse,
} from "../api";
import type { RootState } from './store'

interface ReportsState {
  reports: FetchReportsResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_all_reports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetch_all_reports.fulfilled,
        (state, action: PayloadAction<FetchReportsResponse[]>) => {
          state.reports = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetch_all_reports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reports";
      })
      .addCase(trigger_report_generation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        trigger_report_generation.fulfilled,
        (state, action: PayloadAction<ReportGenerationResponse>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(trigger_report_generation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to generatee a report";
      })
      .addCase(upload_audio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        upload_audio.fulfilled,
        (state, action: PayloadAction<AudioUploadResponse>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(upload_audio.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to upload student details and audio";
      })
      .addCase(upload_details_without_audio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        upload_details_without_audio.fulfilled,
        (state, action: PayloadAction<DetailsUploadResponse>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(upload_details_without_audio.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to upload student details";
      });
  },
});

export const selectReports = (state: RootState) =>
  state.reports.reports;
export const selectReportsLoading = (state: RootState) =>
  state.reports.loading;
export const selectReportsError = (state: RootState) =>
  state.reports.error;

export default reportsSlice.reducer;
