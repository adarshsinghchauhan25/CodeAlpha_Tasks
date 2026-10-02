// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const playlistEl = document.getElementById('playlist');

// Song Data (Replace 'src' and 'cover' with your actual file paths)
const songs = [
    {
        title: "Song One",
        artist: "Artist A",
        src: "song1.mp3", // e.g., "music/song1.mp3"
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80"
    },
    {
        title: "Song Two",
        artist: "Artist B",
        src: "song2.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80"
    },
    {
        title: "Song Three",
        artist: "Artist C",
        src: "song3.mp3",
        cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=300&q=80"
    }
];

let songIndex = 0;
let isPlaying = false;

// Initialize Player
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    updatePlaylistHighlight();
}

// Play & Pause
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

// Previous & Next Songs
function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Format Time (Seconds to Minutes:Seconds)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Update Progress Bar & Time
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    
    // Update current time text
    currentTimeEl.innerText = formatTime(currentTime);
    
    // Update progress bar value
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
    }
});

// Set Total Duration when metadata loads
audio.addEventListener('loadedmetadata', () => {
    durationEl.innerText = formatTime(audio.duration);
});

// Seek in song when progress bar is changed
progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value * audio.duration) / 100;
    audio.currentTime = seekTime;
});

// Volume Control
volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Autoplay Bonus: Go to next song when current one ends
audio.addEventListener('ended', nextSong);

// Render Playlist Bonus
function renderPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(li);
    });
}

// Highlight currently playing song in playlist
function updatePlaylistHighlight() {
    const items = playlistEl.querySelectorAll('li');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// On Load
renderPlaylist();
loadSong(songs[songIndex]);