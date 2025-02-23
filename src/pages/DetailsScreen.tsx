import React from "react";
import { useLocation } from "react-router-dom";
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

const DetailsScreen = () => {
  const location = useLocation();
  const { reportDetails } = location.state as {
    reportDetails: ReportDetailsComplete;
  };

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
            Report generated on{" "}
            {new Date(reportDetails.response_time).toLocaleDateString("en-GB")} at{" "}
            {new Date(reportDetails.response_time).toLocaleTimeString("en-GB")}
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
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>Total Words</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.no_words}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 12}}> Number of Correct Words</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.no_corr}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 12}}>Number of Miscues</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.no_miscue}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 12}}>Number of Substituted Words</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.no_subs}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>Insertions</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.no_ins}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 12}}>Words Correct Per Minute</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>{reportDetails.wcpm}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>Speaking Rate</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.speech_rate}syll/sec
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 12}}>Pronunciation Score</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{fontWeight:"bold", fontSize: 15}}>
                  {reportDetails.pron_score}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DetailsScreen;
