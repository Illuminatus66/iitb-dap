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
import { AudioUploadRequest, DetailsUploadRequest } from "../api";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setLoading(false);
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
      const selectedFile = e.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/flac",
        "audio/mp4",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert(
          "Invalid file type! Please upload an audio file (MP3, WAV, OGG, FLAC, MP4)."
        );
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  // Converts the selected audio file to Base64 string
  // I chose not to remove the metadata prefix (data:audio/filetype;base64,) even though
  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL suggests
  // that removing it makes it a true base64 encoded string, but I'm assuming the metadata
  // is needed for the SAS API. It's definitely needed to be playable in an <audio> component
  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Validates the audio file using the Web Audio API
  // https://webaudio.github.io/web-audio-api/
  // I couldn't find a way to check the bitrate using AudioContext or
  // any other Web Audio APIs. Maybe there exists some specialized npm
  // package dedicated to extracting audio properties
  const validateAudioFile = async (file: File): Promise<boolean> => {
    const audioContext = new AudioContext();
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      // Duration should be less than a minute
      if (audioBuffer.duration >= 60) {
        alert(
          `Audio must be less than 1 minute, The duration of this audio is ${audioBuffer.duration}`
        );
        audioContext.close();
        setLoading(false);
        return false;
      }
      // Sample rate should be exactly 16kHz according to the documentation
      // Apparently the AudioContext defaults to its own preset sampling rate which is 48kHz
      // if (audioBuffer.sampleRate !== 16000) {
      //   alert(`Audio must have a 16kHz sampling rate,${audioBuffer.sampleRate}, ${audioBuffer.numberOfChannels}`);
      //   audioContext.close();
      //   setLoading(false);
      //   return false;
      // }
      audioContext.close();
      return true;
    } catch (error) {
      console.error("Error decoding audio data:", error);
      alert("Invalid audio file.");
      return false;
    }
  };

  const handleSubmitFromModal = async () => {
    setLoading(true);
    if (
      !studentName.trim() ||
      !standard.trim() ||
      !division.trim() ||
      !roll_no.trim() ||
      !storyName.trim()
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
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
      const isValid = await validateAudioFile(file);
      if (!isValid) return;
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
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown={loading}>
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
        <input type="file" accept="audio/" onChange={handleFileChange} />
        <Button
          variant="contained"
          onClick={handleSubmitFromModal}
          disabled={loading}
        >
          {loading ? "Processing" : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AudioUploadModal;
