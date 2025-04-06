import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsFillPlayFill, BsPauseFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { IoMdSkipForward, IoMdSkipBackward } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import SideBar from "./SideBar";

function TrendingPage() {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [trendingPlaylists, setTrendingPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [queue, setQueue] = useState([]);
  const progressRef = useRef(null);
  const intervalRef = useRef(null);

  // Direct API call with a CORS proxy
  const CORS_PROXY = "https://corsproxy.io/?";

  // Fetch trending tracks
  const fetchTrendingTracks = async () => {
    try {
      // Using chart/0/tracks endpoint for trending tracks
      const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/chart/0/tracks?limit=12`);
      console.log("Trending tracks:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trending tracks:", error);
      return getFallbackTracks();
    }
  };

  // Fetch trending playlists
  const fetchTrendingPlaylists = async () => {
    try {
      // Using chart/0/playlists endpoint for trending playlists
      const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/chart/0/playlists?limit=6`);
      console.log("Trending playlists:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trending playlists:", error);
      return getFallbackPlaylists();
    }
  };

  // Fallback data in case API calls fail
  const getFallbackTracks = () => [
    {
      id: 1, 
      title: "VIVID", 
      artist: { name: "Rich Brian, SNOT" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dce5cae66bbc/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1abe3d15a394a764f756c366e99f76-4.mp3",
      explicit_lyrics: true
    },
    {
      id: 2, 
      title: "New Tooth", 
      artist: { name: "Rich Brian" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/13df01a94cf6f336ae8533ee7a347a98/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-d.dzcdn.net/stream/c-ddf495316e2c187d3acaa4664b3523e1-6.mp3",
      explicit_lyrics: true
    },
    {
      id: 3, 
      title: "Backburner", 
      artist: { name: "Niki" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/ec4e6d8a5e77ad12096f7166d8b1a553/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-0.dzcdn.net/stream/c-0c81b8b7a74db2d0306a2cf2a9e196f4-6.mp3",
      explicit_lyrics: false
    }
  ];

  const getFallbackPlaylists = () => [
    { 
      id: 1, 
      title: "Top Hits 2025", 
      picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/5d2fa7f140a6bdc2c864c3465a61fc71/500x500-000000-80-0-0.jpg",
      user: { name: "Deezer" }
    },
    { 
      id: 2, 
      title: "Hip-Hop Mix", 
      picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/2a03dcb51fdf9a9dc61d0fe6a8a3bc8e/500x500-000000-80-0-0.jpg",
      user: { name: "Deezer" }
    },
    { 
      id: 3, 
      title: "Chill Vibes", 
      picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/7633eb92a9aa4ed8927dcdd9a5ff0a2e/500x500-000000-80-0-0.jpg",
      user: { name: "Deezer" }
    }
  ];

  // Load favorites from localStorage - Updated to load full track data
  const loadFavoritesFromLocalStorage = () => {
    try {
      const storedFavorites = localStorage.getItem('favoritesTracks');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        return parsedFavorites;
      }
      return [];
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  };

  // Save favorites to localStorage - Now saving full track objects
  const saveFavoritesToLocalStorage = (favoriteTracks) => {
    try {
      localStorage.setItem('favoritesTracks', JSON.stringify(favoriteTracks));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load favorites from localStorage first
        const storedFavorites = loadFavoritesFromLocalStorage();
        setFavorites(storedFavorites);
        
        const [tracks, playlists] = await Promise.all([
          fetchTrendingTracks(),
          fetchTrendingPlaylists()
        ]);
        console.log("tracks", tracks)
        setTrendingTracks(tracks);
        setTrendingPlaylists(playlists);
        
        // Add first few tracks to queue automatically
        setQueue(tracks.slice(0, 3));
      } catch (error) {
        console.error("Error loading data:", error);
        const fallbackTracks = getFallbackTracks();
        setTrendingTracks(fallbackTracks);
        setTrendingPlaylists(getFallbackPlaylists());
        setQueue(fallbackTracks.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
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
  }, []);

  // Format time in MM:SS
  const formatTime = (seconds) => {
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
    const width = progressRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * duration;
    
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Function to play/pause track preview
  const playTrackPreview = (track) => {
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
      
      newAudio.play();
      setAudio(newAudio);
      setCurrentlyPlaying(track);
      setIsPlaying(true);
      startProgressTracking(newAudio);
    }
  };

  // Find a track by ID in trending tracks
  const findTrackById = (trackId) => {
    return trendingTracks.find(track => track.id === trackId);
  };

  // Check if a track is in favorites
  const isTrackInFavorites = (trackId) => {
    return favorites.some(track => track.id === trackId);
  };

  // Toggle favorite status for a track - Updated to store full track object
  const toggleFavorite = (trackId) => {
    const track = findTrackById(trackId);
    if (!track) return;

    // Update state with new favorites
    let newFavorites;
    if (isTrackInFavorites(trackId)) {
      newFavorites = favorites.filter(item => item.id !== trackId);
    } else {
      // Add full track object to favorites
      newFavorites = [...favorites, track];
    }
    
    // Update state
    setFavorites(newFavorites);
    
    // Save to localStorage
    saveFavoritesToLocalStorage(newFavorites);
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      clearInterval(intervalRef.current);
    } else {
      audio.play();
      startProgressTracking(audio);
    }
    
    setIsPlaying(!isPlaying);
  };

  // Skip to previous track
  const playPreviousTrack = () => {
    if (!currentlyPlaying) return;
    
    const currentIndex = trendingTracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex > 0) {
      playTrackPreview(trendingTracks[currentIndex - 1]);
    } else if (trendingTracks.length > 0) {
      // Wrap around to the last track
      playTrackPreview(trendingTracks[trendingTracks.length - 1]);
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
    
    const currentIndex = trendingTracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex < trendingTracks.length - 1) {
      playTrackPreview(trendingTracks[currentIndex + 1]);
    } else if (trendingTracks.length > 0) {
      // Wrap around to the first track
      playTrackPreview(trendingTracks[0]);
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

  return (
    <div className="flex w-full h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <div className="hidden lg:block lg:w-64 h-full bg-black border-r border-gray-800">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-black overflow-x-hidden overflow-y-auto pb-24">
        {/* Background Overlay */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-10 px-4 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-400">What's Hot</p>
            <h1 className="text-4xl font-bold">Trending</h1>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {/* Featured Grid Layout - Similar to the image */}
          {!isLoading && trendingTracks.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-4 relative">
                {/* Main Feature (Middle Item) */}
                <div className="col-span-1 hidden sm:block">
                  <div 
                    className="relative rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => playTrackPreview(trendingTracks[1])}
                  >
                    <img
                      src={trendingTracks[1]?.album?.cover_medium || "https://via.placeholder.com/300"}
                      alt={trendingTracks[1]?.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {currentlyPlaying && currentlyPlaying.id === trendingTracks[1]?.id && isPlaying ? (
                        <div className="bg-yellow-400 rounded-full p-3">
                          <BsPauseFill size={24} />
                        </div>
                      ) : (
                        <div className="bg-yellow-400 rounded-full p-3">
                          <BsFillPlayFill size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center Feature (Larger Item) */}
                <div className="col-span-3 sm:col-span-1 relative z-10 transform sm:scale-125 sm:translate-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                    {currentlyPlaying && currentlyPlaying.id === trendingTracks[0]?.id && (
                      <div className="absolute top-2 left-2 z-20 bg-black text-xs px-3 py-1 rounded-full opacity-80">
                        Now Playing
                      </div>
                    )}
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => playTrackPreview(trendingTracks[0])}
                    >
                      <img
                        src={trendingTracks[0]?.album?.cover_medium || "https://via.placeholder.com/300"}
                        alt={trendingTracks[0]?.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        {currentlyPlaying && currentlyPlaying.id === trendingTracks[0]?.id && isPlaying ? (
                          <div className="bg-yellow-400 rounded-full p-4">
                            <BsPauseFill size={28} />
                          </div>
                        ) : (
                          <div className="bg-yellow-400 rounded-full p-4">
                            <BsFillPlayFill size={28} />
                          </div>
                        )}
                      </div>
                      {trendingTracks[0]?.explicit_lyrics && (
                        <div className="absolute bottom-3 left-3 bg-gray-800 text-white text-xs px-1 rounded">
                          E
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-black">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{trendingTracks[0]?.title}</h3>
                          <p className="text-sm text-gray-400">{trendingTracks[0]?.artist?.name}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(trendingTracks[0]?.id);
                          }}
                          className="p-2"
                        >
                          {isTrackInFavorites(trendingTracks[0]?.id) ? (
                            <BsHeartFill className="text-red-500" />
                          ) : (
                            <BsHeart className="text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Feature */}
                <div className="col-span-1 hidden sm:block">
                  <div 
                    className="relative rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => playTrackPreview(trendingTracks[2])}
                  >
                    <img
                      src={trendingTracks[2]?.album?.cover_medium || "https://via.placeholder.com/300"}
                      alt={trendingTracks[2]?.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {currentlyPlaying && currentlyPlaying.id === trendingTracks[2]?.id && isPlaying ? (
                        <div className="bg-yellow-400 rounded-full p-3">
                          <BsPauseFill size={24} />
                        </div>
                      ) : (
                        <div className="bg-yellow-400 rounded-full p-3">
                          <BsFillPlayFill size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - More Trending Tracks */}
              <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingTracks.slice(3, 11).map((track) => (
                  <div 
                    key={track.id} 
                    className="bg-gray-900 bg-opacity-40 rounded-lg overflow-hidden hover:bg-gray-800 transition-all cursor-pointer"
                    onClick={() => playTrackPreview(track)}
                  >
                    <div className="flex p-2 items-center gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img
                          src={track.album?.cover_medium || "https://via.placeholder.com/300"}
                          alt={track.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                          {currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? (
                            <BsPauseFill size={20} className="text-white" />
                          ) : (
                            <BsFillPlayFill size={20} className="text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(track);
                          }}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          +
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          {isTrackInFavorites(track.id) ? (
                            <BsHeartFill className="text-red-500" />
                          ) : (
                            <BsHeart />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Playlists */}
          {!isLoading && trendingPlaylists.length > 0 && (
            <div className="mt-16 mb-20">
              <h2 className="text-2xl font-bold mb-6">Trending Playlists</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                {trendingPlaylists.map((playlist) => (
                  <div key={playlist.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={playlist.picture_medium || "https://via.placeholder.com/300"}
                        alt={playlist.title}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                        <div className="bg-yellow-400 rounded-full p-3 scale-0 group-hover:scale-100 transition-transform duration-300">
                          <BsFillPlayFill size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-bold truncate">{playlist.title}</p>
                      <p className="text-sm text-gray-400 truncate">By {playlist.user.name}</p>
                    </div>
                  </div>
                ))}
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
                  src={track.album?.cover_medium || "https://via.placeholder.com/300"}
                  alt={track.title}
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist.name}</p>
                </div>
                <button 
                  onClick={() => removeFromQueue(track.id)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
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
                    src={currentlyPlaying.album?.cover_medium || "https://via.placeholder.com/300"} 
                    alt={currentlyPlaying.title}
                    className="w-12 h-12 rounded object-cover mr-4"
                  />
                  <div>
                    <p className="font-bold text-white">{currentlyPlaying.title}</p>
                    <p className="text-sm text-gray-400">{currentlyPlaying.artist.name}</p>
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
                className="mx-2 text-gray-300 hover:text-yellow-400"
                disabled={!currentlyPlaying}
              >
                <IoMdSkipBackward size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="mx-3 bg-yellow-400 rounded-full p-2 text-black hover:bg-yellow-300 transition"
                disabled={!currentlyPlaying}
              >
                {isPlaying ? <BsPauseFill size={16} /> : <BsFillPlayFill size={16} />}
              </button>
              <button 
                onClick={playNextTrack}
                className="mx-2 text-gray-300 hover:text-yellow-400"
                disabled={!currentlyPlaying}
              >
                <IoMdSkipForward size={20} />
              </button>
            </div>

            {/* Volume/Additional Controls (Simplified) */}
            <div className="w-24 flex items-center justify-end">
              <button 
                onClick={() => currentlyPlaying && toggleFavorite(currentlyPlaying.id)}
                className="p-2"
                disabled={!currentlyPlaying}
              >
                {currentlyPlaying && isTrackInFavorites(currentlyPlaying.id) ? (
                  <BsHeartFill className="text-red-500" />
                ) : (
                  <BsHeart className="text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingPage;