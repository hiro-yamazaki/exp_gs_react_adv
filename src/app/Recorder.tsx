"use client";
// src/app/Recorder.tsx

import { useRef, useState } from "react";

export default function Recorder({ onText }: { onText: (t: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false); // 一時停止中か
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  async function startRec() {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error(e);
      alert("マイクを使えませんでした。ブラウザでマイクを『許可』してください。");
      return;
    }
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = async () => {
      // マイクを止める（ランプが消える）
      streamRef.current?.getTracks().forEach((t) => t.stop());

      // ブラウザが実際に録音した形式に合わせる（Safariは mp4 になる）
      const type = recorder.mimeType || "audio/webm";
      const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : "webm";
      const blob = new Blob(chunksRef.current, { type });

      console.log("録音:", type, blob.size, "バイト"); // 確認用

      if (blob.size === 0) {
        alert("録音できていません。マイクの許可と、1秒以上話したかを確認してください。");
        return;
      }

      const form = new FormData();
      form.append("audio", blob, `audio.${ext}`);

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.error ?? "文字起こしに失敗しました。");
        return;
      }
      onText(data.text); // 文字起こし結果を親に渡す
    };

    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
    setPaused(false);
  }

  // 一時停止 ⇄ 再開（MediaRecorder の pause / resume を使う）
  function togglePause() {
    const rec = recorderRef.current;
    if (!rec) return;
    if (rec.state === "recording") {
      rec.pause();
      setPaused(true);
    } else if (rec.state === "paused") {
      rec.resume();
      setPaused(false);
    }
  }

  function stopRec() {
    recorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  }

  return (
    // 横並び（flex）で「録音する」と「停止」を隣に置く。gap-2 = ボタン間 8px
    <div className="mt-s1 flex items-center gap-s0">
      <button
        onClick={recording ? togglePause : startRec}
        className={`rounded px-s1 py-s-1 text-white ${
          !recording
            ? "bg-gray-700 hover:bg-gray-800"      // 待機中
            : paused
              ? "bg-green-600 hover:bg-green-700"  // 一時停止中 → 再開できる
              : "bg-yellow-500 hover:bg-yellow-600" // 録音中 → 一時停止できる
        }`}
      >
        {!recording ? "🎤 録音する" : paused ? "▶ 再開" : "⏸ 一時停止"}
      </button>
      <button
        onClick={stopRec}
        disabled={!recording}
        className="rounded bg-red-600 px-s1 py-s-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ■ 停止して文字にする
      </button>
    </div>
  );
}
