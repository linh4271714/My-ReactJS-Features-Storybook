/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Stack } from "@mui/material";

import { EliceButton } from "../button";
import { red200Color, red900Color } from "../tokenColorTemporary";

export interface EliceVideoRecorderProps {
  onSubmit: (videoBlob: Blob) => void;
  initVideo?: File | string;
  onRecording?: () => void;
  disabled?: boolean;
  maxTime?: number;
}

type RecordingStepType = "ready" | "recording" | "recorded";

const VideoRecorder = ({
  disabled = false,
  onSubmit,
  onRecording,
  maxTime = 180,
  initVideo,
}: EliceVideoRecorderProps) => {
  const [recordingStep, setRecordingStep] =
    useState<RecordingStepType>("ready");

  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [wasInit, setWasInit] = useState(false);

  // [RECORDING STATUS]
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordTime, setRecordTime] = useState(0);

  const startRecording = async () => {
    setRecordingStep("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      const videoRecordedPreview: any = document.getElementById(
        "videoRecordedPreview"
      );

      mediaRecorderRef.current = new MediaRecorder(stream);

      let recordedChunks: Blob[] = [];

      if (onRecording) {
        onRecording();
      }

      setRecordTime(0);

      const timer = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        recordedChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const tracks = mediaRecorderRef.current?.stream.getTracks();
        tracks?.forEach((track) => track.stop());
        clearInterval(timer);

        const videoBlob = new Blob(recordedChunks, { type: "video/webm" });

        recordedChunks = [];
        setVideoBlob(videoBlob);

        const videoUrl = URL.createObjectURL(videoBlob);
        videoRecordedPreview.src = videoUrl;
        videoRecordedPreview.load();
      });
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error init recording:", error);
    }
  };

  const stopRecording = useCallback(async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecordingStep("recorded");
  }, []);

  const handleRecordClick = async () => {
    if (disabled) {
      return;
    }

    switch (recordingStep) {
      case "ready":
        void startRecording();
        break;

      case "recording":
        if (recordTime < 1) {
          return;
        }
        await stopRecording();
        break;

      case "recorded":
        setVideoBlob(null);
        void startRecording();
        break;
    }
  };

  const connectCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const videoRecordingPreview: any = document.getElementById(
        "videoRecordingPreview"
      );

      if (videoRecordingPreview) {
        videoRecordingPreview.srcObject = stream;
      }
    } catch (error) {
      console.error("Error connecting camera:", error);
    }
  };

  useEffect(() => {
    void connectCamera();

    return () => {
      if (mediaRecorderRef?.current?.stream) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (recordingStep === "recorded" && videoBlob) {
      onSubmit(videoBlob);
    }
  }, [videoBlob, recordingStep]);

  useEffect(() => {
    if (initVideo && !wasInit) {
      const videoRecordedPreview: any = document.getElementById(
        "videoRecordedPreview"
      );

      videoRecordedPreview.src =
        typeof initVideo === "string"
          ? initVideo
          : URL.createObjectURL(initVideo);
      videoRecordedPreview.load();
      setRecordingStep("recorded");
      setWasInit(true);
    }
  }, [wasInit, initVideo]);

  useEffect(() => {
    if (recordTime >= maxTime) {
      void stopRecording();
    }
  }, [maxTime, recordTime, stopRecording]);

  return (
    <Stack gap="0.8rem">
      <Stack p="2rem 0">
        <video
          id="videoRecordedPreview"
          style={{
            height: "27rem",
            borderRadius: "2.4rem",
            display: recordingStep === "recorded" ? "flex" : "none",
          }}
          controls
        />
        <video
          id="videoRecordingPreview"
          autoPlay
          muted
          style={{
            height: "27rem",
            borderRadius: "2.4rem",
            display: recordingStep !== "recorded" ? "flex" : "none",
          }}
        />
      </Stack>
      <EliceButton
        disabled={disabled}
        style={{
          backgroundColor:
            recordingStep === "recording" ? red200Color : red900Color,
          color: recordingStep === "recording" ? red900Color : "white",
          width: "100%",
          gap: "0.8rem",
        }}
        onClick={handleRecordClick}
      >
        {recordingStep === "recording" ? (
          <StopCircleOutlinedIcon fontSize="large" />
        ) : (
          <RadioButtonCheckedOutlinedIcon fontSize="large" />
        )}
        {recordingStep === "ready"
          ? "녹화 시작"
          : recordingStep === "recording"
          ? "녹화 완료"
          : "다시 녹화"}
      </EliceButton>
    </Stack>
  );
};

export default VideoRecorder;
