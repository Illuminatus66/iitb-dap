import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogContentText,
} from "@mui/material";
import { useAppDispatch } from "../hooks";
import {
  upload_audio,
  upload_details_without_audio,
} from "../actions/reportActions";

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

interface AudioUploadModalProps {
  open: boolean;
  onClose: () => void; // Whenever this is called it closes this modal in HomeScreen
  onClear: () => void; // Whenever this is called it clears the previouslyEnteredStudentData in HomeScreen
  defaultData?:
    | {
        _id: string;
        studentName: string;
        standard: string;
        division: string;
        roll_no: string;
        storyName: string;
      }
    | undefined;
}

const AudioUploadModal: React.FC<AudioUploadModalProps> = ({
  open,
  onClose,
  onClear,
  defaultData,
}) => {
  const dispatch = useAppDispatch();
  // Initialize state with defaultData if provided from handleOpenModalFromTable
  // in the parent HomeScreen component
  const [mongoID, setMongoID] = useState<string>(defaultData?._id || "");
  const [studentName, setStudentName] = useState<string>(
    defaultData?.studentName || ""
  );
  const [standard, setStandard] = useState<string>(defaultData?.standard || "");
  const [division, setDivision] = useState<string>(defaultData?.division || "");
  const [roll_no, setRollNo] = useState<string>(defaultData?.roll_no || "");
  const [storyName, setStoryName] = useState<string>(
    defaultData?.storyName || ""
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setMongoID(defaultData?._id || "");
      setStudentName(defaultData?.studentName || "");
      setStandard(defaultData?.standard || "");
      setDivision(defaultData?.division || "");
      setRollNo(defaultData?.roll_no || "");
      setStoryName(defaultData?.storyName || "");
    }
  }, [open, defaultData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  // Converts the selected audio file to Base64 string
  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmitFromModal = async () => {
    if (
      !studentName.trim() ||
      !standard.trim() ||
      !division.trim() ||
      !roll_no.trim() ||
      !storyName.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const commonPayload = {
      uid: `${standard}_${division}_${roll_no}`,
      name: studentName,
      story: storyName,
    };
    // If audio file is uploaded, dispatch upload_audio with or without
    // _id depending upon where the AudioUploadModal was opened from
    if (file) {
      try {
        const base64Audio = await convertFileToBase64(file);
        const audioUploadData: AudioUploadRequest = {
          ...commonPayload,
          audioFile: base64Audio,
          ...(mongoID && { _id: mongoID }),
        };
        dispatch(upload_audio(audioUploadData));
      } catch (error) {
        console.error("Error converting file:", error);
        return;
      }
    } else {
      // Audio not uploaded, dispatch upload_details_without_audio.
      const detailsUploadData: DetailsUploadRequest = {
        ...commonPayload,
      };
      dispatch(upload_details_without_audio(detailsUploadData));
    }
    onClear();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mongoID ? "Update Student Record" : "Create New Student Record"}
      </DialogTitle>
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
          You can choose to upload an Audio file now or keep it empty to upload
          later
        </DialogContentText>
        <input type="file" accept="" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleSubmitFromModal}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AudioUploadModal;
