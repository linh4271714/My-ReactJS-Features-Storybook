/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { Box, Button, LinearProgress, Stack } from '@mui/material';
import { v4 } from 'uuid';

import { EliceButton } from '../button';
import {
  gray200Color,
  main200Color,
  main300Color,
  red200Color,
  red900Color,
} from '../tokenColorTemporary';

import type { ReactNode } from 'react';

export interface EliceVoiceRecorderProps {
  onSubmit: (audioBlob: Blob) => void;
  initVoice?: File | string;
  onRecording?: () => void;
  disabled?: boolean;
  maxTime?: number;
  guide?: Partial<Record<RecordingStepType, ReactNode>>;
}

type RecordingStepType = 'ready' | 'recording' | 'recorded';

const VoiceRecorder = ({
  disabled = false,
  onSubmit,
  onRecording,
  maxTime = 180,
  initVoice,
  guide,
}: EliceVoiceRecorderProps) => {
  const [recordingStep, setRecordingStep] =
    useState<RecordingStepType>('ready');

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [wasInit, setWasInit] = useState(false);

  // [AUDIO STATUS]
  const audioRef = useRef<null | HTMLAudioElement>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // [RECORDING STATUS]
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  // [PLAYER STATUS]
  const [progress, setProgress] = useState(0);

  const stopPlaying = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const startRecording = async () => {
    setRecordingStep('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      if (onRecording) {
        onRecording();
      }

      setRecordTime(0);

      const timer = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);

      //Volume analysis
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      const volumeCheck = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const averageVolume =
          dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
        setCurrentVolume(averageVolume);
      }, 100);

      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const tracks = mediaRecorderRef.current?.stream.getTracks();
        tracks?.forEach(track => track.stop());
        clearInterval(timer);
        clearInterval(volumeCheck);

        const audioFile = new File(chunks, `chat-recording-${v4()}`, {
          type: 'audio/wav',
        });

        setAudioBlob(
          chunks.reduce(
            (acc, cur) => new Blob([acc, cur], { type: 'audio/wav' })
          )
        );

        audioRef.current = new Audio(URL.createObjectURL(audioFile));

        // for get duration before play
        const audioContext = new AudioContext();
        const audioReader = new FileReader();

        audioReader.onload = async event => {
          const arrayBuffer = event.target?.result;

          await audioContext.decodeAudioData(
            arrayBuffer as ArrayBuffer,
            audioBuffer => {
              const durationInSeconds = audioBuffer.duration;
              setDuration(durationInSeconds);
            }
          );
        };

        audioReader.readAsArrayBuffer(audioFile);
      });

      mediaRecorderRef.current.start();
    } catch (error) {
      setRecordingStep('ready');
      console.error({ startRecordingError: error });
    }
  };

  const stopRecording = useCallback(async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecordingStep('recorded');
    stopPlaying();
  }, []);

  const handlePlayClick = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      await audioRef.current?.play();
    }

    setPlaying(prev => !prev);
  };

  const handleRecordClick = async () => {
    if (disabled) {
      return;
    }

    switch (recordingStep) {
      case 'ready':
        void startRecording();
        break;

      case 'recording':
        if (recordTime < 1) {
          return;
        }
        await stopRecording();
        break;

      case 'recorded':
        setAudioBlob(null);
        void startRecording();
        break;
    }
  };

  useEffect(() => {
    if (recordingStep === 'recorded' && audioBlob) {
      onSubmit(audioBlob);
    }
  }, [audioBlob, recordingStep]);

  useEffect(() => {
    if (initVoice && !wasInit) {
      audioRef.current = new Audio(
        typeof initVoice === 'string'
          ? initVoice
          : URL.createObjectURL(initVoice)
      );
      setRecordingStep('recorded');
      setWasInit(true);
    }
  }, [wasInit, initVoice]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('durationchange', () => {
        if (audioRef.current?.duration !== Infinity) {
          setDuration(audioRef.current?.duration ?? 0);
        }
      });
    }
    return () => stopPlaying();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current]);

  useEffect(() => {
    if (recordTime >= maxTime) {
      void stopRecording();
    }
  }, [maxTime, recordTime, stopRecording]);

  useEffect(() => {
    let timer: any;

    if (audioRef.current && isPlaying) {
      timer = setInterval(() => {
        const progress = Math.floor(
          ((audioRef.current?.currentTime ?? 0) / (duration ?? 0)) * 100
        );

        setProgress(progress);

        if (progress === 100) {
          setTimeout(() => {
            stopPlaying();
            setProgress(0);
          }, 500);

          return clearInterval(timer);
        }
      }, 100);
    }

    return () => clearInterval(timer);
  }, [audioRef, duration, isPlaying, stopPlaying]);

  return (
    <Stack gap="0.8rem">
      {recordingStep === 'recorded' ? (
        <>
          {guide?.recorded}
          <Stack direction="row" alignItems="center" gap="4rem" p="2rem 0">
            <Button
              onClick={handlePlayClick}
              style={{
                height: '4rem',
                width: '4rem',
                backgroundColor: main300Color,
                boxShadow: '0.74px 0.74px 4.89px 0px #ECE9F0 inset',
                color: 'white',
                minWidth: 'unset',
              }}
            >
              {isPlaying ? (
                <PauseOutlinedIcon fontSize="large" />
              ) : (
                <PlayArrowOutlinedIcon fontSize="large" />
              )}
            </Button>

            <Box flexGrow={1}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  '.MuiLinearProgress-bar': {
                    transition: 'none',
                    backgroundColor: main200Color,
                  },
                  height: '0.8rem',
                  backgroundColor: gray200Color,
                }}
              />
            </Box>
          </Stack>
        </>
      ) : guide?.ready && recordingStep === 'ready' ? (
        guide.ready
      ) : (
        <>
          {guide?.recording}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="1.1rem"
            p="2rem 2.4rem"
          >
            {Array(20)
              .fill(0)
              .map((_, idx) => (
                <Box
                  key={`volume-${idx}`}
                  width="1.1rem"
                  height="3.4rem"
                  borderRadius="1.1rem"
                  sx={{
                    backgroundColor:
                      currentVolume / 5 >= idx ? main200Color : gray200Color,
                  }}
                ></Box>
              ))}
          </Stack>
        </>
      )}
      <EliceButton
        disabled={disabled}
        style={{
          backgroundColor:
            recordingStep === 'recording' ? red200Color : red900Color,
          color: recordingStep === 'recording' ? red900Color : 'white',
          width: '100%',
          gap: '0.8rem',
        }}
        onClick={handleRecordClick}
      >
        {recordingStep === 'recording' ? (
          <StopCircleOutlinedIcon fontSize="large" />
        ) : (
          <RadioButtonCheckedOutlinedIcon fontSize="large" />
        )}
        {recordingStep === 'ready'
          ? '녹음 시작'
          : recordingStep === 'recording'
          ? '녹음 완료'
          : '다시 녹음'}
      </EliceButton>
    </Stack>
  );
};

export default VoiceRecorder;
