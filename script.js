const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const trackArt = document.getElementById('track-art');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const loopBtn = document.getElementById('loop-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.getElementById('progress-bar');
const currentTimeTxt = document.getElementById('current-time');
const durationTxt = document.getElementById('duration');
const skipBackBtn = document.getElementById('skip-back');
const skipForwardBtn = document.getElementById('skip-forward');

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Ensure duration updates when metadata or data is available
const updateDuration = () => {
    if (audio.duration) {
        durationTxt.innerText = formatTime(audio.duration);
    }
};

audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('durationchange', updateDuration);
audio.addEventListener('canplaythrough', updateDuration);

// Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.className = 'fas fa-pause';
        trackArt.classList.add('playing');
        trackArt.classList.remove('paused');
    } else {
        audio.pause();
        playIcon.className = 'fas fa-play';
        trackArt.classList.add('paused');
    }
});

// Progress and Current Time
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percent;
    }
    currentTimeTxt.innerText = formatTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});
 
// Features
skipBackBtn.addEventListener('click', () => { 
    audio.currentTime = 0; 
});
skipForwardBtn.addEventListener('click', () => { audio.currentTime += 10; });

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    muteBtn.classList.toggle('active', audio.muted);
});

loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle('active', audio.loop);
});

// --- Keyboard Controls ---
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            e.preventDefault(); // Prevents page from jumping down
            playBtn.click();
            break;
        case 'ArrowRight':
            audio.currentTime += 5;
            break;
        case 'ArrowLeft':
            audio.currentTime -= 5;
            break;
        case 'ArrowUp':
            e.preventDefault();
            audio.volume = Math.min(1, audio.volume + 0.1);
            volumeSlider.value = audio.volume;
            break;
        case 'ArrowDown':
            e.preventDefault();
            audio.volume = Math.max(0, audio.volume - 0.1);
            volumeSlider.value = audio.volume;
            break;
        case 'KeyM':
            muteBtn.click();
            break;
    }
});