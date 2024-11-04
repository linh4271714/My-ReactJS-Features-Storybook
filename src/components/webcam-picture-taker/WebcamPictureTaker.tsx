/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import { Stack } from '@mui/material';

import { EliceButton } from '../button';
import { gray300Color, red900Color } from '../tokenColorTemporary';

export interface EliceWebcamPictureTakerProps {
  onSubmit: (images: any[]) => void;
  initImages?: string[];
  disabled?: boolean;
  max?: number;
}

const WebcamPictureTaker = ({
  disabled = false,
  onSubmit,
  max = 10,
  initImages = [],
}: EliceWebcamPictureTakerProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [takenPictures, setTakenPictures] = useState<string[]>(initImages);
  const [deviceRatio, setDeviceRatio] = useState<number>(1);

  const handleClick = () => {
    const canvas = canvasRef.current;
    const cameraPreview = document.getElementById(
      'cameraPreview'
    ) as HTMLVideoElement;
    if (!canvas || !cameraPreview) return;

    const context = canvas.getContext('2d');
    canvas.width = cameraPreview.clientHeight / deviceRatio;
    canvas.height = cameraPreview.clientHeight;

    context?.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

    if (takenPictures.length < max) {
      const photoDataUrl = canvas.toDataURL('image/png');
      setTakenPictures((old: string[]) => {
        return [...old, photoDataUrl];
      });
    }
  };

  const connectCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const { width, height } = stream.getVideoTracks()[0].getSettings();
      if (height && width) {
        setDeviceRatio(height / width);
      }

      const cameraPreview: any = document.getElementById('cameraPreview');

      mediaRecorderRef.current = new MediaRecorder(stream);

      if (cameraPreview) {
        cameraPreview.srcObject = stream;
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  useEffect(() => {
    void connectCamera();

    return () => {
      if (mediaRecorderRef?.current?.stream) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    onSubmit(takenPictures);
  }, [takenPictures]);

  return (
    <Stack gap="0.8rem">
      <Stack direction="row" p="2rem 0" gap="0.8rem" flexWrap="wrap">
        {takenPictures.map(item => {
          return (
            <Stack position="relative">
              <img
                src={item}
                alt=""
                style={{
                  maxHeight: '11.5rem',
                  maxWidth: '11.5rem',
                  borderRadius: '2rem',
                  objectFit: 'contain',
                }}
              />
              <HighlightOffIcon
                onClick={() => {
                  const newList = takenPictures.filter(i => i !== item);
                  setTakenPictures(newList);
                }}
                fontSize="large"
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  top: '0.5rem',
                  right: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  backgroundColor: gray300Color,
                  borderRadius: '50%',
                }}
              />
            </Stack>
          );
        })}
      </Stack>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video
        id="cameraPreview"
        autoPlay
        style={{
          maxHeight: '27rem',
          maxWidth: '61rem',
          borderRadius: '2.4rem',
          margin: 'auto',
        }}
      />
      <EliceButton
        disabled={disabled}
        style={{
          backgroundColor: red900Color,
          color: 'white',
          width: '100%',
          gap: '0.8rem',
        }}
        onClick={handleClick}
      >
        <RadioButtonCheckedOutlinedIcon fontSize="large" />
        사진 촬영
      </EliceButton>
    </Stack>
  );
};

export default WebcamPictureTaker;
