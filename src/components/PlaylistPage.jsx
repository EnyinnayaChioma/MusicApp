import React, { useState, useEffect, useRef } from "react";
import { BsFillPlayFill, BsPauseFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { IoMdSkipForward, IoMdSkipBackward } from "react-icons/io";
import overlay from "../assets/overlay.png";
import SideBar from "./SideBar";
import axios from "axios";

function FavoritesPage() {
  const [favoritesTracks, setFavoritesTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const progressRef = useRef(null);
  const intervalRef = useRef(null);

  // Load favorites from localStorage and fetch complete track details
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Get favorites from localStorage
        const storedFavorites = localStorage.getItem('favoritesTracks');
        const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        console.log("Loaded favorites IDs:", parsedFavorites);
        console.log(storedFavorites)
        
        // Fetch complete details for each track ID
        if (parsedFavorites.length > 0) {
            console.log(parsedFavorites);
          const updatedFavorites = await Promise.all(
            parsedFavorites.map(async (trackId) => {
              console.log("Processing track ID:", trackId.id);
              try {
                // Use Deezer API to get complete track info with axios
                const CORS_PROXY = "https://corsproxy.io/?";
                const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/track/${trackId.id}`);
                console.log('track response', response);
                
                const fullTrackData = response.data;
                console.log(`Fetched data for track ${trackId}:`, fullTrackData);
                
                // Return the complete track data
                return {
                  id: trackId,
                  title: fullTrackData.title,
                  preview: fullTrackData.preview,
                  duration: fullTrackData.duration,
                  explicit_lyrics: fullTrackData.explicit_lyrics,
                  artist: fullTrackData.artist,
                  album: fullTrackData.album
                };
              } catch (error) {
                console.error(`Error fetching details for track ${trackId}:`, error);
                // Return a minimal track object with just the ID if fetch fails
                return { id: trackId, title: `Unknown Track (${trackId})` };
              }
            })
          );
          
          // Filter out any null results
          const validFavorites = updatedFavorites.filter(track => track !== null);
          
          // Update state with fetched tracks
          setFavoritesTracks(validFavorites);
          
          // Store the complete track objects back to localStorage
          // localStorage.setItem('favoritesTracks', JSON.stringify(validFavorites));
          
          // Add first few tracks to queue automatically if available
          setQueue(validFavorites.slice(0, Math.min(3, validFavorites.length)));
        } else {
          setFavoritesTracks([]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavoritesTracks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
    
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audio]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start progress tracking
  const startProgressTracking = (audioElement) => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    }, 1000);
  };

  // Update progress bar
  const updateProgress = (e) => {
    if (!progressRef.current || !audio) return;
    
    const width = progressRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Function to play/pause track preview
  const playTrackPreview = (track) => {
    // If track doesn't have preview URL, try to fetch it
    if (!track.preview) {
      console.error("No preview URL available for this track:", track);
      return;
    }
    
    // If clicking on already playing track, toggle play/pause
    if (currentlyPlaying && currentlyPlaying.id === track.id) {
      if (audio) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        } else {
          audio.play();
          setIsPlaying(true);
          startProgressTracking(audio);
        }
      }
      return;
    }
    
    // Stop current audio if exists
    if (audio) {
      audio.pause();
      clearInterval(intervalRef.current);
    }
    
    if (track.preview) {
      const newAudio = new Audio(track.preview);
      
      // Setup audio events
      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration);
      });
      
      newAudio.addEventListener('ended', () => {
        playNextTrack();
      });
      
      newAudio.play().catch(error => {
        console.error("Error playing audio:", error);
        // Handle autoplay restrictions
        if (error.name === 'NotAllowedError') {
          alert("Please interact with the page to enable audio playback");
        }
      });
      
      setAudio(newAudio);
      setCurrentlyPlaying(track);
      setIsPlaying(true);
      startProgressTracking(newAudio);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (trackId) => {
    const updatedFavorites = favoritesTracks.filter(track => track.id !== trackId);
    setFavoritesTracks(updatedFavorites);
    
    // Update localStorage
    localStorage.setItem('favoritesTracks', JSON.stringify(updatedFavorites));
    
    // If the track is in the queue, remove it from there as well
    if (queue.some(track => track.id === trackId)) {
      removeFromQueue(trackId);
    }
    
    // If the currently playing track is removed, stop playback
    if (currentlyPlaying && currentlyPlaying.id === trackId) {
      if (audio) {
        audio.pause();
        clearInterval(intervalRef.current);
      }
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setAudio(null);
    }
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      clearInterval(intervalRef.current);
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      startProgressTracking(audio);
    }
    
    setIsPlaying(!isPlaying);
  };

  // Skip to previous track
  const playPreviousTrack = () => {
    if (!currentlyPlaying) return;
    
    const currentIndex = favoritesTracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex > 0) {
      playTrackPreview(favoritesTracks[currentIndex - 1]);
    } else if (favoritesTracks.length > 0) {
      // Wrap around to the last track
      playTrackPreview(favoritesTracks[favoritesTracks.length - 1]);
    }
  };

  // Skip to next track
  const playNextTrack = () => {
    if (!currentlyPlaying) {
      // If nothing is playing and queue exists, play first in queue
      if (queue.length > 0) {
        playTrackPreview(queue[0]);
        return;
      }
      return;
    }
    
    const currentIndex = favoritesTracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex < favoritesTracks.length - 1) {
      playTrackPreview(favoritesTracks[currentIndex + 1]);
    } else if (favoritesTracks.length > 0) {
      // Wrap around to the first track
      playTrackPreview(favoritesTracks[0]);
    }
  };

  // Add track to queue
  const addToQueue = (track) => {
    if (!queue.some(item => item.id === track.id)) {
      setQueue([...queue, track]);
    }
  };

  // Remove track from queue
  const removeFromQueue = (trackId) => {
    setQueue(queue.filter(track => track.id !== trackId));
  };

  // Render placeholder image if album cover is missing
  const renderAlbumArt = (track) => {
    if (track?.album?.cover_medium) {
      return track.album.cover_medium;
    }
    
    // Generate a colorful placeholder based on track ID
    // const generateColor = (id) => {
    //   const colors = [
    //     "#1DB954", "#FF5733", "#3498DB", "#9B59B6", 
    //     "#E74C3C", "#F1C40F", "#2ECC71", "#E67E22"
    //   ];
    //   const index = id ? (parseInt(id) % colors.length) : 0;
    //   return colors[index];
    // };
    
    // Return placeholder URL with color
    // const color = generateColor(track?.id);
    // return `https://via.placeholder.com/300/${color.substring(1)}/FFFFFF?text=${encodeURIComponent(track?.title || "Track")}`;
  };

  return (
    <div className="flex w-full h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <div className="hidden lg:block lg:w-64 h-full bg-black border-r border-gray-800">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-black overflow-x-hidden overflow-y-auto pb-24">
        {/* Background Overlay */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50">
          <img
            src={overlay}
            alt=""
            className="absolute left-0 top-[15%] h-[40vh] w-full opacity-80 
                     md:h-[50%] md:w-[40%] lg:top-[20%]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-4 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-400">Your Collection</p>
            <h1 className="text-4xl font-bold">Favorites</h1>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {/* Empty Favorites Message */}
          {!isLoading && favoritesTracks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <BsHeart size={48} className="text-gray-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-gray-400 max-w-md">
                Add songs to your favorites by clicking the heart icon while browsing the trending page.
              </p>
            </div>
          )}

          {/* Favorites Table */}
          {!isLoading && favoritesTracks.length > 0 && (
            <div className="mt-10">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-400 text-sm border-b border-gray-800">
                    <tr>
                      <th className="pb-3 pl-2">#</th>
                      <th className="pb-3">TRACK</th>
                      <th className="pb-3">ARTIST</th>
                      <th className="pb-3 text-right">ACTIONS</th>
                      <th className="pb-3 text-right pr-4">DURATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favoritesTracks.map((track, index) => (
                      <tr 
                        key={track.id} 
                        className={`hover:bg-gray-900 border-b border-gray-800 ${
                          currentlyPlaying && currentlyPlaying.id === track.id ? 'bg-gray-900 bg-opacity-50' : ''
                        }`}
                      >
                        <td className="py-3 pl-2 w-12">
                          {currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? (
                            <div className="flex justify-center items-center w-6 h-6">
                              <div className="w-1 h-4 bg-yellow-400 mx-0.5 animate-pulse"></div>
                              <div className="w-1 h-3 bg-yellow-400 mx-0.5 animate-pulse delay-200"></div>
                              <div className="w-1 h-5 bg-yellow-400 mx-0.5 animate-pulse delay-300"></div>
                            </div>
                          ) : (
                            <span className="text-gray-400">{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0 cursor-pointer"
                              onClick={() => playTrackPreview(track)}
                            >
                              <img 
                                src={renderAlbumArt(track)} 
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <p 
                                className="font-medium cursor-pointer hover:underline"
                                onClick={() => playTrackPreview(track)}
                              >
                                {track.title || "Unknown Track"}
                              </p>
                              {track.explicit_lyrics && (
                                <span className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded mr-1">E</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">{track.artist?.name || "Unknown Artist"}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end space-x-3">
                            <button 
                              onClick={() => addToQueue(track)}
                              className="text-gray-400 hover:text-white"
                              title="Add to queue"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => removeFromFavorites(track.id)}
                              className="text-red-500 hover:text-red-400"
                              title="Remove from favorites"
                            >
                              <BsHeartFill />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right pr-4 text-gray-400">
                          {formatTime(track.duration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Queue */}
      <div className="hidden lg:block lg:w-64 h-full bg-black border-l border-gray-800 overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Next in queue</h3>
            <button className="text-gray-400 hover:text-white text-sm">Open queue</button>
          </div>

          {/* Queue List */}
          <div className="space-y-4">
            {queue.map((track, index) => (
              <div key={`${track.id}-${index}`} className="flex items-center gap-3">
                <img
                  src={renderAlbumArt(track)}
                  alt={track.title || "Track"}
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title || "Unknown Track"}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist?.name || "Unknown Artist"}</p>
                </div>
                <button 
                  onClick={() => removeFromQueue(track.id)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-6">
                Queue is empty
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playback Control Bar - Fixed at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-2 px-4 z-50">
        <div className="container mx-auto">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-gray-800 mb-3 cursor-pointer"
            onClick={updateProgress}
            ref={progressRef}
          >
            <div 
              className="h-full bg-yellow-400"
              style={{ width: `${currentlyPlaying ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            {/* Track Info */}
            <div className="flex items-center">
              {currentlyPlaying ? (
                <>
                  <img 
                    src={renderAlbumArt(currentlyPlaying)} 
                    alt={currentlyPlaying.title}
                    className="w-12 h-12 rounded object-cover mr-4"
                  />
                  <div>
                    <p className="font-bold text-white">{currentlyPlaying.title || "Unknown Track"}</p>
                    <p className="text-sm text-gray-400">{currentlyPlaying.artist?.name || "Unknown Artist"}</p>
                  </div>
                </>
              ) : (
                <div className="w-12 h-12 bg-gray-800 rounded mr-4"></div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center">
              <div className="text-gray-400 text-xs mr-3">
                {currentlyPlaying ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "0:00 / 0:00"}
              </div>
              <button 
                onClick={playPreviousTrack}
                className={`mx-2 ${!currentlyPlaying ? 'text-gray-700' : 'text-gray-300 hover:text-yellow-400'}`}
                disabled={!currentlyPlaying}
              >
                <IoMdSkipBackward size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className={`mx-3 rounded-full p-2 transition ${
                  !currentlyPlaying 
                    ? 'bg-gray-700 text-gray-500' 
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                }`}
                disabled={!currentlyPlaying}
              >
                {isPlaying ? <BsPauseFill size={16} /> : <BsFillPlayFill size={16} />}
              </button>
              <button 
                onClick={playNextTrack}
                className={`mx-2 ${!currentlyPlaying ? 'text-gray-700' : 'text-gray-300 hover:text-yellow-400'}`}
                disabled={!currentlyPlaying}
              >
                <IoMdSkipForward size={20} />
              </button>
            </div>

            {/* Volume/Additional Controls (Simplified) */}
            <div className="w-24 flex items-center justify-end">
              {currentlyPlaying && (
                <button 
                  onClick={() => removeFromFavorites(currentlyPlaying.id)}
                  className="p-2"
                >
                  <BsHeartFill className="text-red-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;