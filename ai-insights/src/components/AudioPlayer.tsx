import React, { useState, useRef, useEffect } from 'react';
import { Slider, Button, Progress } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div>
        <Button
          type="primary"
          shape="circle"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlayPause}
        />
      </div>

      <Slider
        value={currentTime}
        max={duration}
        onChange={handleSliderChange}
        tipFormatter={formatTime}
        style={{ marginBottom: 4 }}
      />

      <Progress
        percent={(currentTime / duration) * 100}
        showInfo={false}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <a>{audioUrl.split('amazonaws.com/')[1]}</a>
    </div>
  );
};

export default AudioPlayer;
