import React, { useState } from "react";
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
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Header from "../components/Header";
import AudioUploadModal from "../components/AudioUploadModal";
import { useAppSelector } from "../hooks";
import { ReportDetails, selectReports } from "../reducers/reportsSlice";
import { trigger_report_generation } from "../actions/reportActions";

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

interface PreviouslyEnteredStudentData {
  _id: string;
  standard: string;
  division: string;
  roll_no: string;
  studentName: string;
  storyName: string;
}

// Usually I do not import typed interfaces and keep the entire code in
// one file for better readability but the correct way to do it is to
// import interfaces from a single file like I have done for ReportDetails here.
// The purpose of this function is for additional typesafety even though the backend
// already ensures the Report Details will be Complete if is_report_generated
function isReportDetailsComplete(
  student: ReportDetails
): student is ReportDetailsComplete {
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
  const students = useAppSelector(selectReports);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previouslyEnteredStudentData, setPreviouslyEnteredStudentData] =
    useState<PreviouslyEnteredStudentData | null>(null);

  //Applies the search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToDetails = (report: ReportDetailsComplete) => {
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
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search for a student's name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, maxWidth: "300px" }}
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
          <Button variant="contained" onClick={() => setOpen(true)}>
            +Create New
          </Button>
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
                                color="primary"
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
                                <Button
                                  variant="contained"
                                  color="primary"
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
                              </>
                            )
                          ) : (
                            <>
                              <span> No audio uploaded</span>
                              <Button
                                variant="contained"
                                color="primary"
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
                                  color="primary"
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
                                onClick={() => {
                                  if (isReportDetailsComplete(student)) {
                                    trigger_report_generation({
                                      _id: student._id,
                                      reference_text_id: "EN-OL-RC-247-1",
                                      audio_url: student.audio_url,
                                      uid: student.uid,
                                      request_time: student.request_time,
                                    });
                                  } else {
                                    console.error(
                                      "Student object is not complete",
                                      student
                                    );
                                  }
                                }}
                              >
                                Generate Report
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
