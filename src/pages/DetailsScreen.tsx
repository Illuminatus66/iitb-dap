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
import { ReportGenerationResponse } from "../api";

const DetailsScreen = () => {
  const location = useLocation();
  const { reportDetails } = location.state as {
    reportDetails: ReportGenerationResponse;
  };

  return (
    <div style={{alignItems:'center'}}>
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
            {new Date(reportDetails.response_time).toLocaleDateString("en-GB")}{" "}
            at{" "}
            {new Date(reportDetails.response_time).toLocaleTimeString("en-GB")}
          </Typography>
        </CardContent>
      </Card>

      <Card style={{ margin: "20px", padding: "20px", maxWidth: "80%" }}>
        <FormattedTextDisplay
          del_details={reportDetails.del_details}
          ins_details={reportDetails.ins_details}
          subs_details={reportDetails.subs_details}
          correct_text={reportDetails.correct_text}
        />
      </Card>

      {/* Audio Player */}
      {reportDetails.audio_url && (
        <Box sx={{ width: "80%", margin: "20px auto", textAlign: "center" }}>
          <audio
            controls
            src={reportDetails.audio_url}
            style={{ width: "50%" }}
          >
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}

      {/* Two-Column Metrics Table */}
      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "80%" }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  Total Words
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.no_words}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  {" "}
                  Number of Correct Words
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.no_corr}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  Number of Miscues
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.no_miscue}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  Number of Substituted Words
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.no_subs}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  Insertions
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.no_ins}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  Words Correct Per Minute
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.wcpm}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  Speaking Rate
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                  {reportDetails.speech_rate}syll/sec
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  Pronunciation Score
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
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
