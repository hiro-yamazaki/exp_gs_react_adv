"use client";
// src/app/page.tsx

import { useRef, useState } from "react";
import FaceMeter from "./FaceMeter"; // ← ① 追加
import Recorder from "./Recorder";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [smileScore, setSmileScore] = useState(0); // ← ② 追加
  const [speaking, setSpeaking] = useState(false); // A: 読み上げ中か（true の間はボタンを押せなくする）
  const ttsCacheRef = useRef<{ text: string; audio: string } | null>(null); // C: 直前の読み上げ音声を覚えておく
  const [volume, setVolume] = useState(1); // 読み上げ音量 0〜1（1 = 100%）
  const audioRef = useRef<HTMLAudioElement | null>(null); // 今鳴っている音声（再生中に音量を変えるため）
  const topic = "自己紹介を1分で";

  async function handleSubmit() {
    setLoading(true);
    setFeedback("");
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, answer, smileScore }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  }

  // 音量スライダーを動かしたとき：state を更新し、再生中なら即反映
  function changeVolume(v: number) {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  async function speak() {
    setSpeaking(true); // A: 最初に true → ボタンが disabled になり連打できない
    try {
      // C: 同じ文章なら API を呼ばず、覚えておいた音声を使い回す
      let base64 = ttsCacheRef.current?.text === feedback ? ttsCacheRef.current.audio : null;
      if (!base64) {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: feedback }),
        });
        const data = await res.json();
        base64 = data.audio as string;
        ttsCacheRef.current = { text: feedback, audio: base64 }; // 次回のために覚える
      }

      const audio = new Audio("data:audio/mp3;base64," + base64);
      audio.volume = volume; // スライダーの値を反映
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false); // A: 鳴り終わったら解除 ③
      audio.onerror = () => setSpeaking(false); // A: 再生に失敗しても解除 ②
      await audio.play();
    } catch {
      setSpeaking(false); // A: 通信失敗・再生拒否でも解除 ①
    }
  }
  return (
    <main className="mx-auto max-w-[40rem] px-s3 py-s4 text-s0">
      <h1 className="text-center text-s2 font-bold leading-tight">AI練習コーチ</h1>
      {/* ③ <h1> の下あたりに置く */}
      <section className="mt-s3">
        <FaceMeter onScore={setSmileScore} />
        <p>いまの笑顔率：{smileScore}%</p>
      </section>
      <p className="mt-s3 text-s1 font-medium">お題：{topic}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        className="mt-s0 w-full rounded border border-gray-300 p-s0 focus:border-blue-500 focus:outline-none"
        placeholder="ここに回答を入力"
      />

      {/* textarea の下あたり */}
      <Recorder onText={(t) => setAnswer(t)} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-s2 block w-full rounded bg-blue-600 px-s1 py-s0 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "生成中…" : "コーチに見てもらう"}
      </button>
      {feedback && (
        <>
          <p className="mt-s3 whitespace-pre-wrap rounded border-l-4 border-blue-500 bg-blue-50 p-s2 text-gray-800">{feedback}</p>
          <div className="mt-s1 flex items-center gap-s2">
            <button
              onClick={speak}
              disabled={speaking}
              className="rounded border border-gray-300 px-s1 py-s-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {speaking ? "🔊 再生中…" : "🔊 読み上げ"}
            </button>
            <label className="flex items-center gap-s-1 text-s-1 text-gray-600">
              音量
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-32"
              />
              {Math.round(volume * 100)}%
            </label>
          </div>
        </>
      )}
    </main>
  );
}
