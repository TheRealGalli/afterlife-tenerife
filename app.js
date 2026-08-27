// AFTERLIFE: TENERIFE - Interactive Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initAudioPlayer();
  initPitchForm();
});

/* -------------------------------------------------------------
 * 1. ROI & ROYALTY CALCULATOR
 * ------------------------------------------------------------- */
function initCalculator() {
  const inputVisitors = document.getElementById('input-visitors');
  const inputSpend = document.getElementById('input-spend');
  const inputRoyalty = document.getElementById('input-royalty');

  const valVisitors = document.getElementById('val-visitors');
  const valSpend = document.getElementById('val-spend');
  const valRoyalty = document.getElementById('val-royalty');

  const resGross = document.getElementById('res-gross');
  const resCdpr = document.getElementById('res-cdpr');

  if (!inputVisitors || !inputSpend || !inputRoyalty) return;

  function updateCalculations() {
    const visitors = parseInt(inputVisitors.value, 10);
    const spend = parseFloat(inputSpend.value);
    const royalty = parseFloat(inputRoyalty.value);

    // Update Slider Labels
    valVisitors.textContent = `${visitors.toLocaleString('en-US')} guests`;
    valSpend.textContent = `€${spend.toFixed(2)}`;
    valRoyalty.textContent = `${royalty.toFixed(1)}%`;

    // Calculate Financial Projections
    const grossRevenue = visitors * spend;
    const cdprRoyalties = grossRevenue * (royalty / 100);

    // Render formatted currency
    resGross.textContent = `€${grossRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    resCdpr.textContent = `€${cdprRoyalties.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  inputVisitors.addEventListener('input', updateCalculations);
  inputSpend.addEventListener('input', updateCalculations);
  inputRoyalty.addEventListener('input', updateCalculations);

  updateCalculations();
}

/* -------------------------------------------------------------
 * 2. WEB AUDIO SYNTHESIZER (Cyberpunk Beat Player)
 * ------------------------------------------------------------- */
let audioCtx = null;
let isPlaying = false;
let beatInterval = null;

function initAudioPlayer() {
  const playBtn = document.getElementById('audio-play-btn');
  const visualizerBars = document.querySelectorAll('.wave-bar');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) {
      stopCyberBeat();
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      visualizerBars.forEach(bar => bar.classList.remove('playing'));
      isPlaying = false;
    } else {
      startCyberBeat();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      visualizerBars.forEach(bar => bar.classList.add('playing'));
      isPlaying = true;
    }
  });
}

function startCyberBeat() {
  let step = 0;
  beatInterval = setInterval(() => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Kick Drum (Every beat)
    if (step % 4 === 0) {
      playKick(now);
    }
    // Cyber Bass Synth Line
    playBassSynth(now, step);

    // Hi-Hat (Every off-beat)
    if (step % 2 === 1) {
      playHiHat(now);
    }

    step = (step + 1) % 16;
  }, 115); // ~130 BPM
}

function stopCyberBeat() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

function playKick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);

  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.15);
}

function playBassSynth(time, step) {
  const notes = [55, 55, 65, 55, 55, 73, 55, 49]; // Dark synth frequencies
  const freq = notes[step % notes.length];

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, time);
  filter.frequency.exponentialRampToValueAtTime(200, time + 0.1);

  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.12);
}

function playHiHat(time) {
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(time);
  noise.stop(time + 0.04);
}

/* -------------------------------------------------------------
 * 3. LIGHTBOX MODAL FOR CONCEPT GALLERY
 * ------------------------------------------------------------- */
function openModal(imgSrc, title, desc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('active');
}

window.openModal = openModal;
window.closeModal = closeModal;

/* -------------------------------------------------------------
 * 4. PITCH FORM SUBMISSION SIMULATION
 * ------------------------------------------------------------- */
function initPitchForm() {
  const pitchForm = document.getElementById('pitchForm');
  if (!pitchForm) return;

  pitchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    alert(`Thank you ${name} (${email})!\n\nYour pitch evaluation request for CD Projekt Red has been submitted. Carlo Galli will get back to your team shortly.`);
    pitchForm.reset();
  });
}
