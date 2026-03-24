import { useState } from "react";
import { supabase } from "../lib/supabase";

const initialForm = {
  name: "",
  team: "",
  score: "3",
  comment: "",
};

export default function EmployeeSurvey() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const scoreNum = Number(form.score);
    const payload = {
      name: form.name.trim(),
      team: form.team.trim(),
      score: scoreNum,
      comment: form.comment.trim(),
    };

    const { error } = await supabase.from("emotion_entries").insert(payload);

    if (error) {
      setErrorMessage(`저장 실패: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    setSubmitted(payload);
    setStatusMessage("Supabase에 저장되었습니다.");
    setForm(initialForm);
    setIsSubmitting(false);
  }

  function handleReset() {
    setForm(initialForm);
    setSubmitted(null);
    setStatusMessage("");
    setErrorMessage("");
  }

  return (
    <div className="page">
      <header className="header">
        <h1>감정 온도 설문</h1>
        <p className="lead">오늘 기분을 1~5점으로 알려주세요.</p>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">이름</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span className="label">팀명</span>
            <input
              type="text"
              name="team"
              value={form.team}
              onChange={handleChange}
              placeholder="프로덕트팀"
              required
            />
          </label>

          <label className="field">
            <span className="label">감정 점수 (1 ~ 5)</span>
            <select name="score" value={form.score} onChange={handleChange}>
              <option value="1">1 — 매우 낮음</option>
              <option value="2">2 — 낮음</option>
              <option value="3">3 — 보통</option>
              <option value="4">4 — 좋음</option>
              <option value="5">5 — 매우 좋음</option>
            </select>
          </label>

          <label className="field">
            <span className="label">코멘트</span>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows={4}
              placeholder="오늘 있었던 일이나 느낌을 자유롭게 적어주세요."
            />
          </label>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "제출"}
            </button>
            <button type="button" className="btn ghost" onClick={handleReset}>
              초기화
            </button>
          </div>
        </form>

        {statusMessage && <p className="status success">{statusMessage}</p>}
        {errorMessage && <p className="status error">{errorMessage}</p>}

        {submitted && (
          <section className="result" aria-live="polite">
            <h2>제출 완료</h2>
            <p>아래 내용은 방금 저장한 값입니다.</p>
            <dl className="result-list">
              <div>
                <dt>이름</dt>
                <dd>{submitted.name}</dd>
              </div>
              <div>
                <dt>팀명</dt>
                <dd>{submitted.team}</dd>
              </div>
              <div>
                <dt>감정 점수</dt>
                <dd>{submitted.score}점</dd>
              </div>
              <div>
                <dt>코멘트</dt>
                <dd>{submitted.comment || "(없음)"}</dd>
              </div>
            </dl>
          </section>
        )}
      </main>
    </div>
  );
}

