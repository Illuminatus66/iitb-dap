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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  TableContainer,
  Paper,
  InputAdornment,
  IconButton,
  DialogContentText,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Header from "../components/Header";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  upload_audio,
  upload_details_without_audio,
} from "../actions/reportActions";
import { selectReports } from "../reducers/reportsSlice";

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
interface AudioUploadRequest {
  _id?: string;
  uid: string;
  name: string;
  story: string;
  audioFile: string;
}
interface DetailsUploadRequest {
  uid: string;
  name: string;
  story: string;
}

const HomeScreen = () => {
  const navigate = useNavigate();
  const students = useAppSelector(selectReports);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("");
  const [standard, setStandard] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [roll_no, setRollNo] = useState<string>("");
  const [storyName, setStoryName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToDetails = (report: ReportDetailsComplete) => {
    navigate("/details", { state: { reportDetails: report } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmitFromModal = async () => {
    if (!studentName || !standard || !division || !roll_no || !storyName) {
      alert("Please fill in all required fields.");
      return;
    }

    const commonPayload = {
      uid: `${standard}_${division}_${roll_no}`,
      name: studentName,
      story: storyName,
    };
    // If audio file is uploaded, dispatch upload_audio without _id
    // since we're creating a new document.
    if (file) {
      try {
        const base64Audio = await convertFileToBase64(file);
        const audioUploadData: AudioUploadRequest = {
          ...commonPayload,
          audioFile: base64Audio,
        };
        dispatch(upload_audio(audioUploadData));
      } catch (error) {
        console.error("Error converting file:", error);
      }
    } else {
      // Audio not uploaded, dispatch upload_details_without_audio.
      const detailsUploadData: DetailsUploadRequest = {
        ...commonPayload,
      };
      dispatch(upload_details_without_audio(detailsUploadData));
    }
    setOpen(false);
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

        {/* Student Table */}
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
                        {student.is_report_generated ? (
                            student.is_report_generated &&
                            student.response_time ? (
                              <>
                              <span> No audio uploaded</span>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => goToDetails(student)}
                                >
                                  Upload Here
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => generateReport(student)}
                              >
                                Generate Report
                              </Button>
                            )
                          ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => audioColumnHandler(student)}
                              >
                                Upload New
                              </Button>
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
                                  onClick={() => goToDetails(student)}
                                >
                                  View Latest Report
                                </Button>
                                <div style={{ marginTop: 8 }}>
                                  {new Date(student.response_time).toLocaleDateString("en-GB")}{' '}
                                  {new Date(student.response_time).toLocaleTimeString("en-GB")}
                                </div>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => generateReport(student)}
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

        {/* Create New Modal */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create New Student Record</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "20px",
            }}
          >
            <TextField
              label="Student Name"
              fullWidth
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <TextField
              label="Standard"
              fullWidth
              required
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
            />
            <TextField
              label="Division"
              fullWidth
              required
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            />
            <TextField
              label="Roll Number"
              fullWidth
              required
              value={roll_no}
              onChange={(e) => setRollNo(e.target.value)}
            />
            <TextField
              label="Story Name"
              fullWidth
              required
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
            />
            <DialogContentText>
              You can choose to upload an Audio file now or keep it empty to
              upload later
            </DialogContentText>
            <input type="file" accept="" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleSubmitFromModal}>
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HomeScreen;
