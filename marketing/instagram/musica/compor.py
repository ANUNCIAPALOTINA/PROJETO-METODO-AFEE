"""Compõe a trilha de fundo dos Reels (original, sem direitos de terceiros).
Batida de treino a 100 BPM: bumbo, chimbal, baixo e acordes em Lá menor. Loop de 8 compassos.
Uso: python3 compor.py trilha.wav  (depois: ffmpeg -i trilha.wav -b:a 128k trilha.mp3)
"""
import math, random, struct, sys, wave

SR, BPM = 44100, 100
BATIDA = 60 / BPM
COMPASSOS = 8
N = int(SR * BATIDA * 4 * COMPASSOS)
buf = [0.0] * N
random.seed(7)

def nota(f, ini, dur, vol, forma="sen", ataque=0.01, queda=4.0):
    a = int(ini * SR)
    for i in range(int(dur * SR)):
        if a + i >= N: break
        t = i / SR
        env = min(1, t / ataque) * math.exp(-queda * t)
        if forma == "sen": s = math.sin(2 * math.pi * f * t)
        else: s = (2 * ((f * t) % 1) - 1) * 0.6 + math.sin(2 * math.pi * f * t) * 0.4
        buf[a + i] += s * env * vol

def bumbo(ini):
    a = int(ini * SR)
    for i in range(int(0.35 * SR)):
        if a + i >= N: break
        t = i / SR
        f = 45 + 90 * math.exp(-30 * t)
        buf[a + i] += math.sin(2 * math.pi * f * t) * math.exp(-9 * t) * 0.9

def chimbal(ini, vol):
    a = int(ini * SR)
    for i in range(int(0.05 * SR)):
        if a + i >= N: break
        buf[a + i] += (random.random() * 2 - 1) * math.exp(-80 * i / SR) * vol

ACORDES = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (130.81, 164.81, 196.0), (196.0, 246.94, 293.66)]  # Am F C G
BAIXO = [110.0, 87.31, 65.41, 98.0]
for c in range(COMPASSOS):
    t0 = c * 4 * BATIDA
    ac, bx = ACORDES[c % 4], BAIXO[c % 4]
    for f in ac:
        nota(f, t0, 4 * BATIDA, 0.07, "serra", ataque=0.3, queda=0.5)
    for b in range(4):
        tb = t0 + b * BATIDA
        bumbo(tb)
        nota(bx, tb, BATIDA * 0.9, 0.25, "sen", queda=3)
        chimbal(tb + BATIDA / 2, 0.25)
        chimbal(tb + BATIDA / 4, 0.08)
        chimbal(tb + 3 * BATIDA / 4, 0.08)

pico = max(abs(x) for x in buf) or 1
with wave.open(sys.argv[1], "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(x / pico * 0.85 * 32767)) for x in buf))
