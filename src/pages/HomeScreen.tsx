import React, { useState } from "react";
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
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Header from "../components/Header";

interface ReportDetails {
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

const students: ReportDetails[] = [
  {
    uid: "5_A_01",
    name: "Ishika Nebhnani",
    is_audio_uploaded: true,
    is_report_generated: true,
    audio_url: "",
    file_id: "147424",
    audio_type: "Ok",
    decoded_text:
      "he went out looking for the lost sheep he walked all the way back to the river at last ला as late in the night he found the sheep in a bush the bush was full of toll he got the sheep out and carried it home he was happy he showed he the sheep to his friends all of them were happy too",
    no_words: 61,
    no_del: 0,
    del_details: "",
    no_ins: 2,
    ins_details: "20-late:ला as,51-the:he",
    no_subs: 1,
    subs_details: "36-thorns:toll",
    no_miscue: 1,
    no_corr: 60,
    wcpm: 83,
    speech_rate: 1.5,
    pron_score: 0.96,
    percent_attempt: 100,
    story: "Sheep Story idk?",
    request_time: "2025-02-19T06:46:23.179+00:00",
    response_time: "2025-02-19T06:46:24.179+00:00",
  },
  {
    uid: "5_A_02",
    name: "Aarav Sharma",
    is_audio_uploaded: true,
    is_report_generated: true,
    audio_url: "",
    file_id: "348627",
    audio_type: "Ok",
    decoded_text: "mina and nina are friends",
    no_words: 113,
    no_del: 108,
    del_details:
      "6-one,7-sunday,8-they,9-go,10-with,11-their,12-mothers,13-to,14-the,15-park,16-for,17-a,18-picnic,19-there,20-mina,21-sees,22-a,23-baby,24-squirrel,25-under,26-a,27-tree,28-it,29-is,30-hurt,31-and,32-cannot,33-move,34-nina,35-picks,36-it,37-up,38-carefully,39-and,40-takes,41-it,42-to,43-her,44-mother,45-nina's,46-mother,47-gives,48-it,49-some,50-water,51-then,52-the,53-girls,54-see,55-a,56-mother,57-squirrel,58-she,59-is,60-looking,61-for,62-her,63-baby,64-they,65-take,66-the,67-baby,68-back,69-and,70-leave,71-it,72-on,73-the,74-ground,75-close,76-to,77-the,78-mother,79-the,80-mother,81-squirrel,82-comes,83-to,84-her,85-baby,86-slowly,87-she,88-takes,89-it,90-back,91-to,92-their,93-hole,94-in,95-the,96-tree,97-mina,98-and,99-nina,100-go,101-back,102-to,103-their,104-mothers,105-they,106-are,107-happy,108-they,109-could,110-help,111-the,112-baby,113-squirrel",
    no_ins: 0,
    ins_details: "",
    no_subs: 0,
    subs_details: "",
    no_miscue: 56,
    no_corr: 5,
    wcpm: 123,
    speech_rate: 2.8,
    pron_score: 0.03,
    percent_attempt: 4,
    story: "Mina and Nina's story",
    request_time: "2025-02-20T06:46:23.179+00:00",
    response_time: "2025-02-20T06:46:24.179+00:00",
  },
  {
    uid: "5_A_03",
    name: "Aarav Sharma",
    is_audio_uploaded: true,
    is_report_generated: true,
    audio_url: "",
    file_id: "26322",
    audio_type: "Ok",
    decoded_text:
      "सब देख सोनी के पास एक माला है उसमें बहुत उसमें बहुत सारे मोती हैं मोती पीले रंग के हैं सोनी उसे पहनती है",
    no_words: 20,
    no_del: 0,
    del_details: "",
    no_ins: 2,
    ins_details: "1-सोनी:सब देख,7-उसमें:उसमें बहुत",
    no_subs: 0,
    subs_details: "",
    no_miscue: 0,
    no_corr: 20,
    wcpm: 152,
    speech_rate: 3,
    pron_score: 0.99,
    percent_attempt: 100,
    story: "Pearls",
    request_time: "2025-02-18T06:46:23.179+00:00",
    response_time: "2025-02-18T06:46:24.179+00:00",
  },
  {
    uid: "5_B_01",
    name: "Janhavi Sharma",
    is_audio_uploaded: true,
    is_report_generated: true,
    audio_url: "",
    file_id: "71670",
    audio_type: "Ok",
    decoded_text:
      "बहुत दिनों से बारिश हो रही है थी गाँव में सभी जा जगह बादल पानी भर गया था सभी बारिश के रुकने की कहा हरा राह देख देख कर अचानक एक दिन बारिश रुक गई सो सूरज निकल आया सब लोग खुश हो गये बाह आसमान में चिड़ियाँ उड़ने लगीं लोग अपने अपने पकड़ उड़ने सुखने लगे बच्चे की घरों में बाहर निकलकर खेल खेलने लगे",
    no_words: 57,
    no_del: 0,
    del_details: "",
    no_ins: 7,
    ins_details:
      "7-थी:है,11-जगह:जा,22-राह:कहा हरा,32-सूरज:सो,40-आसमान:बाह,47-कपड़े:अपने,56-खेलने:खेल",
    no_subs: 7,
    subs_details:
      "12-गंदा:बादल,24-रहे:देख,25-थे:कर,47-कपड़े:पकड़_उड़ने,48-सुखाने:सुखने,51-भी:की,53-से:में",
    no_miscue: 7,
    no_corr: 50,
    wcpm: 56,
    speech_rate: 1.5,
    pron_score: 0.84,
    percent_attempt: 100,
    story: "Time to stop the rain",
    request_time: "2025-02-12T06:46:23.179+00:00",
    response_time: "2025-02-12T06:46:24.179+00:00",
  },
  {
    uid: "5_B_02",
    name: "Ishita Verma",
    is_audio_uploaded: true,
    is_report_generated: false,
    story: "The Hare and the Tortoise",
    audio_url: "",
  },
  {
    uid: "5_B_03",
    name: "Rohan Desai",
    is_audio_uploaded: false,
    is_report_generated: false,
    story: "The Fox and the Grapes",
  },
];

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            InputProps={{
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
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
                      <TableRow key={student.uid}>
                        <TableCell>{student.uid}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.story}</TableCell>
                        <TableCell>
                          {student.is_audio_uploaded
                            ? "Audio uploaded. Upload new?"
                            : "Upload Audio"}
                        </TableCell>
                        <TableCell>
                          {student.response_time && student.is_report_generated
                            ? `Report generated on ${new Date(
                                student.response_time
                              ).toLocaleDateString} at ${new Date(
                                student.response_time
                              ).toLocaleTimeString}. View Here`
                            : "Generate Report"}
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
            <TextField label="Student Name" fullWidth />
            <TextField label="Standard" fullWidth />
            <TextField label="Division" fullWidth />
            <TextField label="Story Name" fullWidth />
            <input type="file" />
            <Button variant="contained" onClick={() => setOpen(false)}>
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
