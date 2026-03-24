import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminEntries() {
  const [recentEntries, setRecentEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [listError, setListError] = useState("");

  async function fetchRecentEntries() {
    setListError("");
    setIsLoadingEntries(true);

    const { data, error } = await supabase
      .from("emotion_entries")
      .select("id, name, team, score, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setListError(`목록 불러오기 실패: ${error.message}`);
      setIsLoadingEntries(false);
      return;
    }

    setRecentEntries(data ?? []);
    setIsLoadingEntries(false);
  }

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>HR 조회</h1>
        <p className="lead">최근 응답 10개를 최신순으로 확인합니다.</p>
      </header>

      <main className="card">
        <section className="result recent">
          <div className="recent-header">
            <h2>최근 응답 10개</h2>
            <button
              type="button"
              className="btn ghost btn-small"
              onClick={fetchRecentEntries}
              disabled={isLoadingEntries}
            >
              {isLoadingEntries ? "불러오는 중..." : "새로고침"}
            </button>
          </div>

          {listError && <p className="status error">{listError}</p>}
          {!listError && isLoadingEntries && (
            <p className="muted">최근 응답을 불러오는 중입니다.</p>
          )}
          {!isLoadingEntries && recentEntries.length === 0 && (
            <p className="muted">아직 저장된 응답이 없습니다.</p>
          )}

          {!isLoadingEntries && recentEntries.length > 0 && (
            <ul className="entry-list">
              {recentEntries.map((entry) => (
                <li key={entry.id} className="entry-card">
                  <div className="entry-top">
                    <strong>
                      {entry.name} ({entry.team})
                    </strong>
                    <span>{new Date(entry.created_at).toLocaleString("ko-KR")}</span>
                  </div>
                  <p className="entry-score">감정 점수: {entry.score}점</p>
                  <p className="entry-comment">코멘트: {entry.comment || "(없음)"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

