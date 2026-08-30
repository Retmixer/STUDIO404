export class AudioFeedback {
  constructor(enabled) { this.enabled = enabled; this.context = null; }

  setEnabled(enabled) { this.enabled = enabled; }

  play(kind = 'click') {
    if (!this.enabled) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext; if (!AudioCtor) return;
      this.context ||= new AudioCtor();
      const now = this.context.currentTime;
      if (kind === 'spin') {
        for (let i = 0; i < 14; i += 1) {
          const t = now + i * 0.09;
          const osc = this.context.createOscillator(); const g = this.context.createGain();
          osc.type = 'square'; osc.frequency.setValueAtTime(220 + (i % 5) * 70, t);
          g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          osc.connect(g); g.connect(this.context.destination); osc.start(t); osc.stop(t + 0.06);
        }
        return;
      }
      if (kind === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((frequency, i) => {
          const t = now + i * 0.12;
          const osc = this.context.createOscillator(); const g = this.context.createGain();
          osc.type = 'triangle'; osc.frequency.setValueAtTime(frequency, t);
          g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(g); g.connect(this.context.destination); osc.start(t); osc.stop(t + 0.35);
        });
        return;
      }
      const oscillator = this.context.createOscillator(); const gain = this.context.createGain();
      const tones = { click: [330, 0.045], confirm: [520, 0.09], warning: [180, 0.12] }; const [frequency, duration] = tones[kind] || tones.click;
      oscillator.type = kind === 'warning' ? 'triangle' : 'sine'; oscillator.frequency.setValueAtTime(frequency, now); gain.gain.setValueAtTime(0.035, now); gain.gain.exponentialRampToValueAtTime(0.001, now + duration); oscillator.connect(gain); gain.connect(this.context.destination); oscillator.start(now); oscillator.stop(now + duration);
    } catch (error) { this.context = null; }
  }
}
