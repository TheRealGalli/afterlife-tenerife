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
 * 2. WEB AUDIO SYNTHESIZER (Cyberpunk Beat Engine v2)
 * ------------------------------------------------------------- */
let audioCtx = null;
let isPlaying = false;
let beatInterval = null;
let currentStep = 0;
let masterGainNode = null;
let waveShaperNode = null;

function makeDistortionCurve(amount = 20) {
  const k = typeof amount === 'number' ? amount : 20;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

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

  // Master Gain & WaveShaper Distortion Setup
  if (!masterGainNode) {
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = 0.85;

    waveShaperNode = audioCtx.createWaveShaper();
    waveShaperNode.curve = makeDistortionCurve(18);
    waveShaperNode.oversample = '4x';

    masterGainNode.connect(waveShaperNode);
    waveShaperNode.connect(audioCtx.destination);
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
        const energyMult = (phase === 'CYBER CLIMAX') ? 1.4 : (phase === 'BUILD-UP' ? 1.1 : 0.7);
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

    // 1. Cyber Kick Drum
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

    // 2. Cyber Snare / Electro Clap
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

    // 3. Cyber Hi-Hats
    if (phase === 'CYBER CLIMAX') {
      const isOpen = (stepInBar % 4 === 2);
      playCyberHiHat(now, isOpen, isOpen ? 0.35 : 0.18);
    } else if (phase === 'BUILD-UP') {
      if (stepInBar % 2 === 1) playCyberHiHat(now, false, 0.15);
    } else if (phase === 'INTRO') {
      if (stepInBar % 4 === 2) playCyberHiHat(now, false, 0.1);
    }

    // 4. Rolling Darksynth Bassline (16th note driving rhythm)
    playCyberBass(now, currentStep, phase);

    // 5. Screaming Cyberpunk Lead / Arpeggio Synth (Climax Drop & Build)
    if (phase === 'CYBER CLIMAX' || (phase === 'BUILD-UP' && bar === 3)) {
      playCyberLeadArp(now, currentStep, phase);
    }

    // 6. Riser FX build-up sweep (Bar 3, Step 12-15)
    if (bar === 3 && stepInBar >= 12) {
      playCyberRiserFX(now, stepInBar);
    }

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

  // Pitch sweep transient (Punchy sub drop)
  osc.frequency.setValueAtTime(170, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.12);

  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  osc.connect(gain);
  gain.connect(masterGainNode);

  osc.start(time);
  osc.stop(time + 0.15);
}

function playCyberSnare(time, volume = 0.8) {
  // Snare Noise Body
  const bufferSize = audioCtx.sampleRate * 0.14;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1100;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.14);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGainNode);

  noise.start(time);
  noise.stop(time + 0.14);

  // Snare Tone Body
  const toneOsc = audioCtx.createOscillator();
  const toneGain = audioCtx.createGain();
  toneOsc.type = 'triangle';
  toneOsc.frequency.setValueAtTime(230, time);
  toneOsc.frequency.exponentialRampToValueAtTime(85, time + 0.08);

  toneGain.gain.setValueAtTime(volume * 0.6, time);
  toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

  toneOsc.connect(toneGain);
  toneGain.connect(masterGainNode);

  toneOsc.start(time);
  toneOsc.stop(time + 0.08);
}

function playCyberHiHat(time, isOpen = false, volume = 0.2) {
  const duration = isOpen ? 0.12 : 0.04;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7500;

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
  // Darksynth rolling bass notes in C minor (C / Eb / F / G / Bb notes with octaves)
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

  // Dynamic Lowpass Filter Envelope
  filter.type = 'lowpass';
  let cutoffFreq = 450;
  let envPeak = 1400;

  if (phase === 'BUILD-UP') {
    cutoffFreq = 650 + (step % 32) * 25;
    envPeak = 2800;
  } else if (phase === 'CYBER CLIMAX') {
    cutoffFreq = 1300;
    envPeak = 4800;
  }

  filter.frequency.setValueAtTime(cutoffFreq, time);
  filter.frequency.exponentialRampToValueAtTime(envPeak, time + 0.04);
  filter.frequency.exponentialRampToValueAtTime(cutoffFreq, time + 0.1);
  filter.Q.value = (phase === 'CYBER CLIMAX') ? 6 : 3;

  // Sidechain pumping volume ducking on kick beats
  const isKickStep = (step % 4 === 0);
  const baseVol = isKickStep ? 0.16 : 0.35;

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

function playCyberLeadArp(time, step, phase) {
  // Fast Cyberpunk 16th Arpeggio Lead (C minor Darksynth melody)
  const arpMelody = [
    261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13,
    261.63, 349.23, 392.00, 523.25, 622.25, 523.25, 392.00, 349.23
  ];

  const freq = arpMelody[step % arpMelody.length];

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc2.type = 'square';

  // Detune for darksynth chorus feel
  osc1.frequency.setValueAtTime(freq, time);
  osc2.frequency.setValueAtTime(freq * 1.006, time);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(phase === 'CYBER CLIMAX' ? 2400 : 1300, time);
  filter.Q.value = 4;

  const vol = (phase === 'CYBER CLIMAX') ? 0.22 : 0.12;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.005, time + 0.09);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(masterGainNode);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.09);
  osc2.stop(time + 0.09);
}

function playCyberRiserFX(time, stepInBar) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  const startFreq = 200 + (stepInBar - 12) * 160;
  osc.frequency.setValueAtTime(startFreq, time);
  osc.frequency.exponentialRampToValueAtTime(startFreq * 2.6, time + 0.1);

  gain.gain.setValueAtTime(0.16, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  osc.connect(gain);
  gain.connect(masterGainNode);

  osc.start(time);
  osc.stop(time + 0.1);
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
