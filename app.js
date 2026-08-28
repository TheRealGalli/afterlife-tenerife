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
 * 2. WEB AUDIO SYNTHESIZER (Cyberpunk Beat Engine v4 - Rock Guitar Edition)
 * ------------------------------------------------------------- */
let audioCtx = null;
let isPlaying = false;
let beatInterval = null;
let currentStep = 0;
let masterGainNode = null;

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
      visualizerBars.forEach(bar => {
        bar.classList.remove('playing');
        bar.style.height = '20%';
        bar.style.background = 'var(--neon-cyan)';
      });
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
  currentStep = 0;
  const visualizerBars = document.querySelectorAll('.wave-bar');

  if (!masterGainNode) {
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = 0.9;

    // Master Compressor Node for punchy rock mix
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 8;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.1;

    masterGainNode.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  // 132 BPM -> ~113.6ms per 16th note step
  const stepTimeMs = (60 / 132 / 4) * 1000;

  beatInterval = setInterval(() => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const totalStepsInCycle = 128; // 8 Bars loop (16 steps per bar)
    const bar = Math.floor(currentStep / 16); // 0 to 7
    const stepInBar = currentStep % 16; // 0 to 15

    // Phase identification
    let phase = 'INTRO';
    if (bar >= 2 && bar < 4) phase = 'BUILD-UP';
    else if (bar >= 4 && bar < 7) phase = 'CYBER CLIMAX';
    else if (bar >= 7) phase = 'OUTRO / BREAK';

    // Dynamic Visualizer Bars animation matching music energy
    if (visualizerBars.length > 0) {
      visualizerBars.forEach((barEl, idx) => {
        const energyMult = (phase === 'CYBER CLIMAX') ? 1.4 : (phase === 'BUILD-UP' ? 1.1 : 0.8);
        const wave = Math.sin(currentStep * 0.4 + idx * 0.8) * 0.5 + 0.5;
        const heightVal = Math.min(100, Math.floor(wave * 75 * energyMult + 20));
        barEl.style.height = `${heightVal}%`;
        if (phase === 'CYBER CLIMAX') {
          barEl.style.background = (idx % 2 === 0) ? 'var(--neon-pink)' : 'var(--neon-yellow)';
        } else if (phase === 'BUILD-UP') {
          barEl.style.background = (idx % 3 === 0) ? 'var(--neon-yellow)' : 'var(--neon-cyan)';
        } else {
          barEl.style.background = 'var(--neon-cyan)';
        }
      });
    }

    // --- INSTRUMENT TRIGGER LOGIC ---

    // 1. Cyber Kick Drum (Heavy Punchy Rock Kick)
    let playKickNow = false;
    if (phase === 'INTRO' || phase === 'OUTRO / BREAK') {
      if (stepInBar === 0 || stepInBar === 8) playKickNow = true;
    } else if (phase === 'BUILD-UP') {
      if (stepInBar % 4 === 0 || (bar === 3 && stepInBar >= 8 && stepInBar % 2 === 0)) playKickNow = true;
    } else if (phase === 'CYBER CLIMAX') {
      if (stepInBar % 4 === 0 || stepInBar === 14) playKickNow = true;
    }
    if (playKickNow) {
      playCyberKick(now, phase === 'CYBER CLIMAX' ? 1.1 : 0.9);
    }

    // 2. Cyber Snare (Crisp Rock Snare)
    let playSnareNow = false;
    let snareVol = 0.7;
    if (phase === 'BUILD-UP') {
      if (stepInBar === 4 || stepInBar === 12) playSnareNow = true;
      if (bar === 3 && stepInBar % 2 === 0) { playSnareNow = true; snareVol = 0.4 + (stepInBar / 32); }
    } else if (phase === 'CYBER CLIMAX') {
      if (stepInBar === 4 || stepInBar === 12) { playSnareNow = true; snareVol = 1.0; }
      if (stepInBar === 15) { playSnareNow = true; snareVol = 0.5; }
    }
    if (playSnareNow) {
      playCyberSnare(now, snareVol);
    }

    // 3. Cyber Rock Hi-Hats & Cymbals
    if (phase === 'CYBER CLIMAX') {
      const isOpen = (stepInBar % 4 === 2);
      playCyberHiHat(now, isOpen, isOpen ? 0.20 : 0.10);
    } else if (phase === 'BUILD-UP') {
      if (stepInBar % 2 === 1) playCyberHiHat(now, false, 0.08);
    } else if (phase === 'INTRO') {
      if (stepInBar % 4 === 2) playCyberHiHat(now, false, 0.06);
    }

    // 4. Warm Driving Bassline
    playCyberBass(now, currentStep, phase);

    // 5. DISTORTED PUNK ROCK GUITAR POWER RIFF (Active on all steps!)
    playCyberRockGuitar(now, currentStep, phase);

    currentStep = (currentStep + 1) % totalStepsInCycle;
  }, stepTimeMs);
}

function stopCyberBeat() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

function playCyberKick(time, volume = 1.0) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Pitch sweep transient (Heavy punchy sub kick)
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  osc.connect(gain);
  gain.connect(masterGainNode);

  osc.start(time);
  osc.stop(time + 0.15);
}

function playCyberSnare(time, volume = 0.8) {
  // Snare Noise Body
  const bufferSize = audioCtx.sampleRate * 0.13;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1200;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.13);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGainNode);

  noise.start(time);
  noise.stop(time + 0.13);

  // Snare Body Tone
  const toneOsc = audioCtx.createOscillator();
  const toneGain = audioCtx.createGain();
  toneOsc.type = 'triangle';
  toneOsc.frequency.setValueAtTime(210, time);
  toneOsc.frequency.exponentialRampToValueAtTime(90, time + 0.08);

  toneGain.gain.setValueAtTime(volume * 0.5, time);
  toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

  toneOsc.connect(toneGain);
  toneGain.connect(masterGainNode);

  toneOsc.start(time);
  toneOsc.stop(time + 0.08);
}

function playCyberHiHat(time, isOpen = false, volume = 0.15) {
  const duration = isOpen ? 0.08 : 0.03;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 4500;
  filter.Q.value = 1.2;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGainNode);

  noise.start(time);
  noise.stop(time + duration);
}

function playCyberBass(time, step, phase) {
  // Deep warm synth bass line
  const bassNotes = [
    65.41, 65.41, 130.81, 65.41, 65.41, 77.78, 65.41, 130.81,
    65.41, 65.41, 130.81, 65.41, 58.27, 65.41, 77.78, 92.50
  ];
  const freq = bassNotes[step % bassNotes.length];

  const osc = audioCtx.createOscillator();
  const subOsc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  subOsc.type = 'square';
  subOsc.frequency.setValueAtTime(freq / 2, time);

  filter.type = 'lowpass';
  const cutoffFreq = (phase === 'CYBER CLIMAX') ? 600 : (phase === 'BUILD-UP' ? 500 : 380);

  filter.frequency.setValueAtTime(cutoffFreq, time);
  filter.Q.value = 1.0;

  const isKickStep = (step % 4 === 0);
  const baseVol = isKickStep ? 0.12 : 0.26;

  gain.gain.setValueAtTime(baseVol, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.11);

  osc.connect(filter);
  subOsc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGainNode);

  osc.start(time);
  subOsc.start(time);
  osc.stop(time + 0.11);
  subOsc.stop(time + 0.11);
}

function playCyberRockGuitar(time, step, phase) {
  // Distorted Punk Rock Power Chords (Drop D / C minor heavy crunch riff)
  const powerChordRoots = [
    65.41,  65.41,  77.78,  65.41,  87.31,  77.78,  65.41,  98.00,
    65.41,  65.41, 116.54, 103.83,  87.31,  77.78,  65.41, 130.81
  ];

  const rootFreq = powerChordRoots[step % powerChordRoots.length];
  const fifthFreq = rootFreq * 1.498; // Perfect 5th for power chord

  // Dual Humbucker Sawtooth Oscillators + Sub body
  const rootOsc = audioCtx.createOscillator();
  const fifthOsc = audioCtx.createOscillator();
  const subOsc = audioCtx.createOscillator();

  rootOsc.type = 'sawtooth';
  fifthOsc.type = 'sawtooth';
  subOsc.type = 'triangle';

  rootOsc.frequency.setValueAtTime(rootFreq, time);
  fifthOsc.frequency.setValueAtTime(fifthFreq, time);
  subOsc.frequency.setValueAtTime(rootFreq, time);

  // Dedicated per-note Distortion Overdrive Pedal (No shared audio graph leaks!)
  const distNode = audioCtx.createWaveShaper();
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const driveGain = (phase === 'CYBER CLIMAX') ? 9 : 5;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = Math.max(-0.70, Math.min(0.70, x * driveGain));
  }
  distNode.curve = curve;
  distNode.oversample = '4x';

  // Marshall Cabinet Lowpass Filter
  const cabFilter = audioCtx.createBiquadFilter();
  cabFilter.type = 'lowpass';

  // Highpass filter to eliminate sub mud
  const highpass = audioCtx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 180;

  // Guitar Presence Peak Filter (Electric Guitar Pick Attack Bite)
  const presence = audioCtx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 2500;
  presence.Q.value = 1.5;
  presence.gain.value = 5; // +5dB guitar crunch presence

  // Rhythm accents: Open power chord stabs vs palm muted chugs
  const stepInBar = step % 16;
  const isOpenStab = (stepInBar === 0 || stepInBar === 3 || stepInBar === 6 || stepInBar === 8 || stepInBar === 12 || stepInBar === 14);

  const filterCutoff = (phase === 'CYBER CLIMAX' && isOpenStab) ? 4200 : (isOpenStab ? 3200 : 1600);
  const decayTime = (phase === 'CYBER CLIMAX' && isOpenStab) ? 0.22 : (isOpenStab ? 0.15 : 0.08);
  const vol = (phase === 'CYBER CLIMAX') ? (isOpenStab ? 0.50 : 0.35) : (isOpenStab ? 0.35 : 0.22);

  cabFilter.frequency.setValueAtTime(filterCutoff, time);
  cabFilter.frequency.exponentialRampToValueAtTime(800, time + decayTime);

  const noteGain = audioCtx.createGain();
  noteGain.gain.setValueAtTime(vol, time);
  noteGain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

  // Routing per note: Oscillators -> Highpass -> Distortion -> Presence -> Cabinet Filter -> NoteGain -> Master Gain
  rootOsc.connect(highpass);
  fifthOsc.connect(highpass);
  subOsc.connect(highpass);
  highpass.connect(distNode);
  distNode.connect(presence);
  presence.connect(cabFilter);
  cabFilter.connect(noteGain);
  noteGain.connect(masterGainNode);

  rootOsc.start(time);
  fifthOsc.start(time);
  subOsc.start(time);
  rootOsc.stop(time + decayTime);
  fifthOsc.stop(time + decayTime);
  subOsc.stop(time + decayTime);
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
