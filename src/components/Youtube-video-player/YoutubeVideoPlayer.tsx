/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Backdrop, Stack } from '@mui/material';

import { gray100Color, gray200Color } from '../tokenColorTemporary';

export enum YTPlayerState {
  BUFFERING = 3,
  CUED = 5,
  ENDED = 0,
  PAUSED = 2,
  PLAYING = 1,
  UNSTARTED = -1,
}

declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        BUFFERING: 3;
        CUED: 5;
        ENDED: 0;
        PAUSED: 2;
        PLAYING: 1;
        UNSTARTED: -1;
      };
    };
    onYouTubeIframeAPIReady: any;
    isYouTubeIframeAPIReady: boolean;
  }
}

export interface YoutubeVideoPlayerProps {
  id: string;
  onPlay?: () => void;
  playerVars?: {
    start?: number;
    end?: number;
  };
}

const YoutubeVideoPlayer = ({
  id,
  onPlay,
  playerVars,
}: YoutubeVideoPlayerProps) => {
  const [showingFullsize, setShowingFullsize] = useState(false);
  const [videoFullsizePlayer, setVideoFullsizePlayer] = useState<any>();

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING && onPlay) {
      onPlay();
    }
  };

  const loadVideo = () => {
    const player = new window.YT.Player(`youtube-player-${id}`, {
      videoId: id,
    });
    console.info({ player });
  };

  const loadFullSizeVideo = () => {
    const player = new window.YT.Player(`youtube-player-fullsize-${id}`, {
      videoId: id,
      playerVars: { ...playerVars },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
    setVideoFullsizePlayer(player);
  };

  useEffect(() => {
    if (!window.isYouTubeIframeAPIReady) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        window.isYouTubeIframeAPIReady = true;
      };
    } else {
      loadVideo();
      loadFullSizeVideo();
    }
  }, [window.isYouTubeIframeAPIReady]);

  return (
    <>
      <Stack
        width="100%"
        height="100%"
        borderRadius="2.4rem"
        overflow="hidden"
        p="1rem"
        bgcolor={gray100Color}
        border={`1px solid ${gray200Color}`}
        sx={{
          iframe: {
            height: '100%',
            width: '100%',
            borderRadius: '2rem',
          },
        }}
        onClick={() => setShowingFullsize(true)}
      >
        <Stack id={`youtube-player-${id}`} />
      </Stack>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={showingFullsize}
        onClick={() => {
          setShowingFullsize(false);
          videoFullsizePlayer?.pauseVideo();
        }}
      >
        <Stack
          height="90vh"
          width="95vw"
          sx={{
            iframe: {
              pointerEvents: 'auto',
              height: '100%',
              width: '100%',
              borderRadius: '2rem',
            },
          }}
        >
          <Stack id={`youtube-player-fullsize-${id}`} />
        </Stack>
      </Backdrop>
    </>
  );
};

export default YoutubeVideoPlayer;
