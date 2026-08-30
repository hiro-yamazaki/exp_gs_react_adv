"use client";
// src/app/page.tsx

import { useState } from "react";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const [topic, setTopic] = useState("自己紹介をつくろう");
  const [tone, setTone] = useState("やさしめ");

  async function handleSubmit() {
    setLoading(true);
    setFeedback("");

    // 自分のAPI(/api/coach)を呼ぶ（Groqのキーはこの先＝サーバー側にある）
    // 通信やAPI側の失敗で画面が無反応にならないよう try/catch/finally で守る
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, answer, tone }),
      });
      const data = await res.json();
      setFeedback(
        data.feedback ?? "エラーが起きました。もう一度お試しください。",
      );
    } catch {
      setFeedback("通信に失敗しました。ネットワークを確認してください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-[640px]">
      <h1 className="text-2xl font-bold text-center mt-8">AIキャリアコーチ</h1>
      <div className="mt-6">
        テーマ：
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="自己紹介">自己紹介</option>
          <option value="ここだけはゆずれないポイント">
            ここだけはゆずれないポイント
          </option>
          <option value="転職のきっかけ">転職のきっかけ</option>
          <option value="夢中になれたタスク">夢中になれたタスク</option>
        </select>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        className="w-full border rounded p-2"
        placeholder="テーマに沿った内容を思うように記入してみましょう"
      />

      <div className="mt-2">
        口調：
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="やさしめ">やさしめ</option>
          <option value="スパルタ">スパルタ</option>
          <option value="ていねい">ていねい</option>
        </select>
      </div>

      <button
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "生成中…" : "コーチに見てもらう"}
      </button>

      {feedback && <p className="whitespace-pre-wrap mt-4">{feedback}</p>}
    </main>
  );
}
