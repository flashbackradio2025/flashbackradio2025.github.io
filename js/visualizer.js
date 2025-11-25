document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('radio-player');
  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');

  if (!audio || !canvas) return;

  // Ajustar tamaño del canvas
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // API de Audio
  let audioContext, analyser, source, dataArray;

  const setupVisualizer = () => {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    } catch (e) {
      console.warn("Visualizer not supported in this browser.");
    }
  };

  const draw = () => {
    if (!analyser || !dataArray) return;

    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(10, 8, 26, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = dataArray[i] / 2;

      // Gradiente neón
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, '#ff33cc');
      gradient.addColorStop(0.5, '#00f3ff');
      gradient.addColorStop(1, '#ffcc00');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  audio.addEventListener('play', () => {
    if (!audioContext) setupVisualizer();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    draw();
  });
});