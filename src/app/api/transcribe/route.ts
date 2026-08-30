// src/app/api/transcribe/route.ts
export async function POST(request: Request) {
  // 画面から送られた音声ファイルを受け取る
  const inForm = await request.formData();
  const audio = inForm.get("audio") as File;

  // Groqの音声API(Whisper)へ転送する形に詰め替える
  const groqForm = new FormData();
  groqForm.append("file", audio, audio.name); // 画面側が付けた名前(拡張子)をそのまま使う
  groqForm.append("model", "whisper-large-v3-turbo");
  groqForm.append("language", "ja");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqForm, // ← FormDataのときは Content-Type を自分で付けない
  });

  const data = await res.json();
  return Response.json({ text: data.text });
}
