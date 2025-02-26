import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectReports } from "../reducers/reportsSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ReportDetailsComplete {
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

interface AudioDetails {
  uid: string;
  audio_url: string;
  storyName: string;
  studentName: string;
}

const ReportsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioDetails | null>(null);
  const reportsPartial = useAppSelector(selectReports);

  const reports = reportsPartial.filter(
    (report) => report.is_audio_uploaded && report.is_report_generated
  ) as ReportDetailsComplete[];

  const goToDetails = (report: ReportDetailsComplete) => {
    navigate("/details", { state: { reportDetails: report } });
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const requestDate = dayjs(report.request_time);
    const matchesDateRange =
      (!startDate || requestDate >= startDate) &&
      (!endDate || requestDate <= endDate);

    return matchesSearch && matchesDateRange;
  });

  const handlePlayAudio = (
    uid: string,
    audio_url: string,
    storyName: string,
    studentName: string
  ) => {
    setSelectedAudio({ uid, audio_url, storyName, studentName });
  };

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        {/* Searching and filtering */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search for a student's name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, maxWidth: "400px" }}
            slotProps={{
              input: {
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DateTimePicker
              label="Start Date"
              name="startDate"
              value={startDate}
              onChange={(newDate) => {
                if (newDate && newDate.isValid()) {
                  setStartDate(newDate);
                } else {
                  setStartDate(null);
                }
              }}
              sx={{ width: 250 }}
              slotProps={{
                field: { clearable: true, onClear: () => setStartDate(null) },
              }}
            />

            <DateTimePicker
              label="End Date"
              name="endDate"
              value={endDate}
              onChange={(newDate) => {
                if (newDate && newDate.isValid()) {
                  setEndDate(newDate);
                } else {
                  setEndDate(null);
                }
              }}
              sx={{ width: 250 }}
              slotProps={{
                field: { clearable: true, onClear: () => setEndDate(null) },
              }}
            />
          </LocalizationProvider>
        </div>

        {/* Reports Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>UID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Student Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Story Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Audio File</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Call Time</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Resp. Time</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Report</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell>{report.uid}</TableCell>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>{report.story}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handlePlayAudio(
                                report.uid,
                                report.audio_url,
                                report.story,
                                report.name
                              )
                            }
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          {new Date(report.request_time).toLocaleDateString(
                            "en-GB"
                          )}{" "}
                          {new Date(report.request_time).toLocaleTimeString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell>
                          {(
                            (new Date(report.response_time).getTime() -
                              new Date(report.request_time).getTime()) /
                            1000
                          ).toFixed(2)}
                          s
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "black" }}
                            onClick={() => goToDetails(report)}
                          >
                            View Report
                          </Button>
                          <div style={{ marginTop: 8 }}>
                            {new Date(report.response_time).toLocaleDateString(
                              "en-GB"
                            )}{" "}
                            at{" "}
                            {new Date(report.response_time).toLocaleTimeString(
                              "en-GB"
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} style={{ textAlign: "center" }}>
                        No reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      {/* Audio Playback Modal */}
      <Dialog open={!!selectedAudio} onClose={() => setSelectedAudio(null)}>
        <DialogTitle>
          {selectedAudio
            ? `${selectedAudio.uid}_${selectedAudio.studentName} reading ${selectedAudio.storyName}`
            : "No audio selected"}
        </DialogTitle>
        <DialogContent>
          {selectedAudio && (
            <audio controls autoPlay style={{ width: "100%" }}>
              <source src={selectedAudio.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsScreen;
