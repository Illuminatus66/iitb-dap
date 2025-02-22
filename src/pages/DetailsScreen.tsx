import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import FormattedTextDisplay from "../components/FormattedTextDisplay";
import Header from "../components/Header";

interface ReportDetails {
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

const reportDetails: ReportDetails = {
  uid: "5_A_01",
  name: "Aarav Sharma",
  is_audio_uploaded: true,
  is_report_generated: true,
  file_id: "12345",
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
  audio_url: "",
  story: "Sheep Story idk?",
  request_time: "2025-02-19T06:46:23.179+00:00",
  response_time: "2025-02-19T06:46:24.179+00:00",
};

export default function DetailsScreen() {
  const responseTime = new Date(reportDetails.response_time);
  return (
    <div>
      <Header />

      {/* Details Section*/}
      <Card style={{ margin: "20px", padding: "20px" }}>
        <CardContent
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h6" fontWeight="bold">
            UID: {reportDetails.uid}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Student Name: {reportDetails.name}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Story Name: {reportDetails.story}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Report generated on {responseTime.toLocaleDateString()} at {responseTime.toLocaleTimeString()} 
          </Typography>
        </CardContent>
      </Card>

      {/* Scrollable but Immutable text box */}
      <Box
        sx={{
          width: "80%",
          height: "25vh",
          margin: "auto",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <FormattedTextDisplay
          decoded_text={reportDetails.decoded_text}
          del_details={reportDetails.del_details}
          ins_details={reportDetails.ins_details}
          subs_details={reportDetails.subs_details}
        />
      </Box>

      {/* Two-Column Metrics Table */}
      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "80%" }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Total Words</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.no_words}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Correct Words</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.no_corr}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Miscues</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.no_miscue}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Substituted Words</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.no_subs}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Insertions</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.no_ins}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">WCPM</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.wcpm}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Speaking Rate</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.speech_rate}syll/sec
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Pronunciation Score</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {reportDetails.pron_score}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
