import { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../song.context";
import "./Player.css";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaMusic,
} from "react-icons/fa";

const Player = () => {
  const { song, loading, autoPlayRequest } = useContext(SongContext);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.load();

    const resetState = setTimeout(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }, 0);

    return () => clearTimeout(resetState);
  }, [song?.url]);

  useEffect(() => {
    if (!audioRef.current || !song?.url || autoPlayRequest === 0) return;

    audioRef.current.playbackRate = speed;
    audioRef.current.volume = isMuted ? 0 : volume;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error("Autoplay failed:", error);
        setIsPlaying(false);
      });
  }, [autoPlayRequest, song?.url, speed, volume, isMuted]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Skip forward 5 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        duration
      );
    }
  };

  // Skip backward 5 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0
      );
    }
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickX =
      e.nativeEvent.offsetX || e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickX / progressBar.offsetWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time to MM:SS
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="player-container">
      <audio
        ref={audioRef}
        src={song?.url}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player-header">
        <div className="album-art" aria-hidden="true">
          <FaMusic />
        </div>
        <div className="song-info">
          <h2 className="song-title">{song?.title || "No song loaded"}</h2>
          <p className="song-mood">{loading ? "Loading" : song?.mood || "Unknown"}</p>
        </div>
      </div>

      <div className="progress-section">
        <div
          className="progress-bar"
          onClick={handleProgressClick}
          role="slider"
          tabIndex="0"
          aria-label="Music progress"
        >
          <div
            className="progress-fill"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls-section">
        <div className="primary-controls">
          <button
            className="control-btn skip-btn"
            onClick={skipBackward}
            title="Skip backward 5 seconds"
            aria-label="Skip backward 5 seconds"
          >
            <FaStepBackward />
            <span className="skip-label">-5s</span>
          </button>

          <button
            className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
            onClick={togglePlay}
            disabled={loading}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button
            className="control-btn skip-btn"
            onClick={skipForward}
            title="Skip forward 5 seconds"
            aria-label="Skip forward 5 seconds"
          >
            <FaStepForward />
            <span className="skip-label">+5s</span>
          </button>
        </div>

        <div className="secondary-controls">
          <div className="control-group speed-control">
            <label htmlFor="speed-select">Speed:</label>
            <select
              id="speed-select"
              className="speed-select"
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="control-group volume-control">
            <button
              className="volume-btn"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume"
            />
            <span className="volume-percentage">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
