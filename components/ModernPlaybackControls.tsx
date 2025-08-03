'use client';

interface ModernPlaybackControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
}

export default function ModernPlaybackControls({
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  onSpeedChange,
  playbackSpeed
}: ModernPlaybackControlsProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${minutes}:${seconds.padStart(5, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Time Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-mono font-bold text-white">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          of {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.01"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full opacity-0 cursor-pointer -mt-8 relative z-10"
          style={{ height: '32px' }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => onSeek(Math.max(0, currentTime - 5))}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Back 5s"
        >
          <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
        </button>

        <button
          onClick={() => onSeek(Math.max(0, currentTime - 1))}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Back 1s"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onPlayPause}
          className="p-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => onSeek(Math.min(duration, currentTime + 1))}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Forward 1s"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => onSeek(Math.min(duration, currentTime + 5))}
          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          title="Forward 5s"
        >
          <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-400">Speed:</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              playbackSpeed === speed
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> Play/Pause • 
        <kbd className="px-2 py-1 bg-gray-800 rounded ml-2">←</kbd> <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd> Seek
      </div>
    </div>
  );
}