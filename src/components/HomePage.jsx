import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import { IoMdSkipForward, IoMdSkipBackward } from "react-icons/io";
import overlay from "../assets/overlay.png";
import SideBar from "./SideBar";

function HomePage() {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef(null);
  const intervalRef = useRef(null);

  // Direct API call with a CORS proxy
  const CORS_PROXY = "https://corsproxy.io/?";

  // Fetch featured tracks
  const fetchFeaturedTracks = async () => {
    try {
      const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/chart/0/tracks?limit=8`);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tracks:", error);
      return getFallbackTracks();
    }
  };

  // Fetch popular artists
  const fetchPopularArtists = async () => {
    try {
      const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/chart/0/artists?limit=5`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching artists:", error);
      return getFallbackArtists();
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${CORS_PROXY}https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data in case API calls fail
  const getFallbackTracks = () => [
    {
      id: 1, 
      title: "Blinding Lights", 
      artist: { name: "The Weeknd" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dce5cae66bbc/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-6.dzcdn.net/stream/c-6f1abe3d15a394a764f756c366e99f76-4.mp3"
    },
    {
      id: 2, 
      title: "Save Your Tears", 
      artist: { name: "The Weeknd" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dce5cae66bbc/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-9.dzcdn.net/stream/c-9f2133fe59a7b963c468ac6acef8b18c-6.mp3"
    },
    {
      id: 3, 
      title: "Levitating", 
      artist: { name: "Dua Lipa" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/13df01a94cf6f336ae8533ee7a347a98/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-d.dzcdn.net/stream/c-ddf495316e2c187d3acaa4664b3523e1-6.mp3"
    },
    {
      id: 4, 
      title: "Stay", 
      artist: { name: "The Kid LAROI" },
      album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/ec4e6d8a5e77ad12096f7166d8b1a553/500x500-000000-80-0-0.jpg" },
      preview: "https://cdns-preview-0.dzcdn.net/stream/c-0c81b8b7a74db2d0306a2cf2a9e196f4-6.mp3"
    }
  ];

  const getFallbackArtists = () => [
    { id: 1, name: "Drake", picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/5d2fa7f140a6bdc2c864c3465a61fc71/500x500-000000-80-0-0.jpg" },
    { id: 2, name: "Ed Sheeran", picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/2a03dcb51fdf9a9dc61d0fe6a8a3bc8e/500x500-000000-80-0-0.jpg" },
    { id: 3, name: "Taylor Swift", picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/7633eb92a9aa4ed8927dcdd9a5ff0a2e/500x500-000000-80-0-0.jpg" },
    { id: 4, name: "The Weeknd", picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/033c9b5f9e4f4f32f90e90c695a75e02/500x500-000000-80-0-0.jpg" },
    { id: 5, name: "Billie Eilish", picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/8b6d6bc45bb8293a58dde52f3c0a7916/500x500-000000-80-0-0.jpg" }
  ];

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tracks, artists] = await Promise.all([
          fetchFeaturedTracks(),
          fetchPopularArtists()
        ]);
        
        setFeaturedTracks(tracks);
        setPopularArtists(artists);
      } catch (error) {
        console.error("Error loading data:", error);
        setFeaturedTracks(getFallbackTracks());
        setPopularArtists(getFallbackArtists());
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

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle Enter key press in search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
        setCurrentlyPlaying(null);
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(intervalRef.current);
      });
      
      newAudio.play();
      setAudio(newAudio);
      setCurrentlyPlaying(track);
      setIsPlaying(true);
      startProgressTracking(newAudio);
    }
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
    
    let tracks = searchResults.length > 0 ? searchResults : featuredTracks;
    const currentIndex = tracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex > 0) {
      playTrackPreview(tracks[currentIndex - 1]);
    } else if (tracks.length > 0) {
      // Wrap around to the last track
      playTrackPreview(tracks[tracks.length - 1]);
    }
  };

  // Skip to next track
  const playNextTrack = () => {
    if (!currentlyPlaying) return;
    
    let tracks = searchResults.length > 0 ? searchResults : featuredTracks;
    const currentIndex = tracks.findIndex(track => track.id === currentlyPlaying.id);
    
    if (currentIndex < tracks.length - 1) {
      playTrackPreview(tracks[currentIndex + 1]);
    } else if (tracks.length > 0) {
      // Wrap around to the first track
      playTrackPreview(tracks[0]);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-900">
      {/* Sidebar - Hidden on mobile, fixed width on desktop */}
      <div className="hidden lg:block lg:w-64 h-full bg-gray-900 border-r border-gray-800">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-900 text-white overflow-x-hidden">
        {/* Background Overlay */}
        <div className="relative overflow-hidden">
          <img
            src={overlay}
            alt=""
            className="absolute left-0 top-[15%] h-[40vh] w-full opacity-20 
                       md:h-[50%] md:w-[40%] lg:top-[20%]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-4 py-8 lg:px-8">
          {/* Search Bar */}
          <div className="mb-10 md:flex md:justify-center">
            <div className="relative w-full md:w-2/3 lg:w-1/2">
              <input
                type="text"
                placeholder="Search for songs, artists..."
                className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBBC05] text-white"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button 
                onClick={handleSearch} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FBBC05] text-white px-4 py-1 rounded-md hover:bg-[#FBBC05] transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {searchResults.map((track) => (
                  <div 
                    key={track.id} 
                    className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                    onClick={() => playTrackPreview(track)}
                  >
                    <div className="relative">
                      <img
                        src={track.album?.cover_medium || "https://via.placeholder.com/300"}
                        alt={track.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-[#FBBC05] rounded-full p-3">
                          {currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? (
                            <BsPauseFill size={24} />
                          ) : (
                            <BsFillPlayFill size={24} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold truncate">{track.title}</p>
                      <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {/* Featured Tracks */}
          {!isLoading && featuredTracks.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">New Songs Added</h1>
                <p className="text-gray-400">Trending</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => playTrackPreview(track)}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                      <p className="absolute bottom-4 left-4 text-xl font-bold z-10">{track.title}</p>
                      <div className="absolute top-3 right-3 bg-[#FBBC05] text-xs px-2 py-1 rounded-full">HOT</div>
                      <div className="w-full aspect-square">
                        <img
                          src={track.album?.cover_medium || "https://via.placeholder.com/300"}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold truncate">{track.artist.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {track.album?.title || "Album"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Artists */}
          {!isLoading && popularArtists.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Top Artists</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {popularArtists.map((artist) => (
                  <div key={artist.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={artist.picture_medium || "https://via.placeholder.com/300"}
                        alt={artist.name}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                        <div className="bg-[#FBBC05] rounded-full p-3 scale-0 group-hover:scale-100 transition-transform duration-300">
                          <BsFillPlayFill size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-bold truncate">{artist.name}</p>
                      <p className="text-sm text-gray-400 truncate">Artist</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playback Control Bar - Fixed at the bottom */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-2 px-4 z-50">
          <div className="container mx-auto">
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-gray-700 mb-3 cursor-pointer"
              onClick={updateProgress}
              ref={progressRef}
            >
              <div 
                className="h-full bg-[#FBBC05]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              {/* Track Info */}
              <div className="flex items-center">
                <img 
                  src={currentlyPlaying.album?.cover_medium || "https://via.placeholder.com/300"} 
                  alt={currentlyPlaying.title}
                  className="w-12 h-12 rounded object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-white">{currentlyPlaying.title}</p>
                  <p className="text-sm text-gray-400">{currentlyPlaying.artist.name}</p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center">
                <div className="text-gray-400 text-xs mr-3">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <button 
                  onClick={playPreviousTrack}
                  className="mx-2 text-white hover:text-[#FBBC05]"
                >
                  <IoMdSkipBackward size={24} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="mx-3 bg-[#FBBC05] rounded-full p-3 text-black hover:bg-yellow-400 transition"
                >
                  {isPlaying ? <BsPauseFill size={20} /> : <BsFillPlayFill size={20} />}
                </button>
                <button 
                  onClick={playNextTrack}
                  className="mx-2 text-white hover:text-[#FBBC05]"
                >
                  <IoMdSkipForward size={24} />
                </button>
              </div>

              {/* Volume/Additional Controls (Simplified) */}
              <div className="w-24">
                {/* This can be expanded later for volume control */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;