import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetch_all_reports,
  trigger_report_generation,
  upload_audio,
  upload_details_without_audio
} from "../actions/reportActions";

interface ReportDetails {
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

interface ReportsState {
  reports: ReportDetails[];
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
        (state, action: PayloadAction<ReportDetails[]>) => {
          state.reports = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetch_all_reports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reports";
      })
      .addCase(trigger_report_generation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        trigger_report_generation.fulfilled,
        (state, action: PayloadAction<ReportDetails>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(trigger_report_generation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create a report";
      })
      .addCase(upload_audio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        upload_audio.fulfilled,
        (state, action: PayloadAction<ReportDetails>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(upload_audio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload audio";
      })
      .addCase(upload_details_without_audio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        upload_details_without_audio.fulfilled,
        (state, action: PayloadAction<ReportDetails>) => {
          state.reports.push(action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(upload_details_without_audio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload details";
      });
  },
});

export const selectReports = (state: { reports: ReportsState }) =>
  state.reports.reports;
export const selectReportsLoading = (state: { reports: ReportsState }) =>
  state.reports.loading;
export const selectReportsError = (state: { reports: ReportsState }) =>
  state.reports.error;

export default reportsSlice.reducer;
