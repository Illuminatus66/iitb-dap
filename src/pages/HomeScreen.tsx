import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableContainer,
  Paper,
  InputAdornment,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ClearIcon from "@mui/icons-material/Clear";
import Header from "../components/Header";
import AudioUploadModal from "../components/AudioUploadModal";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  selectIfReportsFetched,
  selectReports,
  selectReportsLoading,
} from "../reducers/reportsSlice";
import {
  fetch_all_reports,
  trigger_report_generation,
} from "../actions/reportActions";
import { FetchReportsResponse, ReportGenerationResponse } from "../api";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PreviouslyEnteredStudentData {
  _id: string;
  standard: string;
  division: string;
  roll_no: string;
  studentName: string;
  storyName: string;
}

// The purpose of this function is for additional typesafety even though the backend
// already ensures the Report Details will be Complete if is_report_generated
function isReportDetailsComplete(
  student: FetchReportsResponse
): student is ReportGenerationResponse {
  return (
    student.is_report_generated &&
    student.file_id !== undefined &&
    student.audio_type !== undefined &&
    student.decoded_text !== undefined &&
    student.no_words !== undefined &&
    student.no_del !== undefined &&
    student.del_details !== undefined &&
    student.no_ins !== undefined &&
    student.ins_details !== undefined &&
    student.no_subs !== undefined &&
    student.subs_details !== undefined &&
    student.no_miscue !== undefined &&
    student.no_corr !== undefined &&
    student.wcpm !== undefined &&
    student.speech_rate !== undefined &&
    student.pron_score !== undefined &&
    student.percent_attempt !== undefined &&
    student.audio_url !== undefined &&
    student.request_time !== undefined &&
    student.response_time !== undefined
  );
}

const HomeScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectReports);
  const loading = useAppSelector(selectReportsLoading);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previouslyEnteredStudentData, setPreviouslyEnteredStudentData] =
    useState<PreviouslyEnteredStudentData | null>(null);
  const reportsFetched = useAppSelector(selectIfReportsFetched);

  useEffect(() => {
    if (!reportsFetched) {
      dispatch(fetch_all_reports());
    }
  }, [dispatch, reportsFetched]);

  const handleRefreshReports = () => {
    dispatch(fetch_all_reports());
  };

  //Applies the search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToDetails = (report: ReportGenerationResponse) => {
    navigate("/details", { state: { reportDetails: report } });
  };

  const handleOpenModalFromTable = async (student: {
    _id: string;
    studentName: string;
    storyName: string;
    uid: string;
  }) => {
    const { _id, studentName, uid, storyName } = student;
    const [standard, division, roll_no] = uid.split("_");
    setPreviouslyEnteredStudentData({
      _id: _id,
      studentName: studentName,
      standard: standard,
      division: division,
      roll_no: roll_no,
      storyName: storyName,
    });
    setOpen(true);
  };

  const handleGenerateReport = async (student: FetchReportsResponse) => {
    if (!student.audio_url) return;

    try {
      dispatch(
        trigger_report_generation({
          _id: student._id,
          reference_text_id: "EN-OL-RC-247-1",
          audio_url: student.audio_url,
          request_time: dayjs()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        })
      );
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        {/* Search Bar + Create New Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search for a student's name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ display: "flex", flex: 1, maxWidth: "400px" }}
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
          <ButtonGroup variant="contained">
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              color="primary"
            >
              +Create New
            </Button>

            <Button
              variant="contained"
              onClick={handleRefreshReports}
              disabled={loading}
              color="primary"
            >
              {loading ? "Refreshing..." : "Refresh Entries"}
            </Button>
          </ButtonGroup>
        </div>

        {/* Student Details Table */}
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
                      <strong>Report</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.uid}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.story}</TableCell>
                        <TableCell>
                          {student.is_audio_uploaded ? (
                            student.is_report_generated ? (
                              <Button
                                variant="contained"
                                style={{ backgroundColor: "black" }}
                                onClick={() =>
                                  handleOpenModalFromTable({
                                    _id: student._id,
                                    uid: student.uid,
                                    studentName: student.name,
                                    storyName: student.story,
                                  })
                                }
                              >
                                Upload New Audio
                              </Button>
                            ) : (
                              <>
                                <span> Audio Uploaded </span>
                                <div style={{ marginTop: 8 }}>
                                  <Button
                                    variant="contained"
                                    style={{ backgroundColor: "black" }}
                                    onClick={() =>
                                      handleOpenModalFromTable({
                                        _id: student._id,
                                        uid: student.uid,
                                        studentName: student.name,
                                        storyName: student.story,
                                      })
                                    }
                                  >
                                    Upload Again
                                  </Button>
                                </div>
                              </>
                            )
                          ) : (
                            <>
                              <span> No audio uploaded</span>
                              <div style={{ marginTop: 8 }}>
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: "black" }}
                                  onClick={() =>
                                    handleOpenModalFromTable({
                                      _id: student._id,
                                      uid: student.uid,
                                      studentName: student.name,
                                      storyName: student.story,
                                    })
                                  }
                                >
                                  Upload Here
                                </Button>
                              </div>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.is_audio_uploaded ? (
                            student.is_report_generated &&
                            student.response_time ? (
                              <>
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: "black" }}
                                  onClick={() => {
                                    if (isReportDetailsComplete(student)) {
                                      goToDetails(student);
                                    } else {
                                      console.error(
                                        "Student object is not complete",
                                        student
                                      );
                                    }
                                  }}
                                >
                                  View Latest Report
                                </Button>
                                <div style={{ marginTop: 8 }}>
                                  {new Date(
                                    student.response_time
                                  ).toLocaleDateString("en-GB")}{" "}
                                  {new Date(
                                    student.response_time
                                  ).toLocaleTimeString("en-GB")}
                                </div>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={() => handleGenerateReport(student)}
                              >
                                {loading ? "Processing" : "Generate Report"}
                              </Button>
                            )
                          ) : (
                            "Upload an Audio file first"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* 'Create New' or 'Update Existing' Modal */}
        <AudioUploadModal
          open={open}
          // This reverse prop allows the child Modal to control when it closes
          onClose={() => setOpen(false)}
          // This reverse prop clears the state when modal closes, so that on a fresh
          // open from the '+Create New' button, no defaultData is passed to the Modal
          onClear={() => setPreviouslyEnteredStudentData(null)}
          defaultData={previouslyEnteredStudentData ?? undefined}
        />
      </div>
    </div>
  );
};

export default HomeScreen;
