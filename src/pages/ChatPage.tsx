import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasConversationBegun = messages.length > 0;

  useEffect(() => {
    // 새 메시지가 추가되면 하단으로 스크롤
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = useMemo(
    () => ["반려동물 OK", "지금 영업중", "디저트 맛집"],
    []
  );

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // 간단한 더미 응답: 스크린샷과 비슷한 문구
    const botText =
      "냄새 좋은 커피집을 찾는거군요! 🐱\n5분 안에 갈 수 있는 카페를 찾았어요.\n\n1. 카페 라떼하우스\n- 걸어서 3분, 시그니처 라떼가 유명해요.\n\n2. 브라운빈 카페\n- 걸어서 5분, 조용한 분위기.\n\n3. 플랜트&빈\n- 걸어서 4분, 식물 가득한 인테리어.\n\n👉 가고 싶은 곳 번호를 알려주시면 지도 보여드릴게요!";

    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: "bot",
      text: botText,
    };

    // 약간의 딜레이로 응답하는 느낌
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 350);
  }

  return (
    <div className="mx-auto max-w-[560px] min-h-dvh bg-[#F7F8FA] flex flex-col">
      {/* 더보기 버튼 - 왼쪽 상단 고정 */}
      <button
        className="fixed top-4 left-4 z-50 w-6 h-6 grid place-items-center"
        aria-label="더보기"
        type="button"
      >
        <img src="/Assets/icons/More%20circle.svg" alt="더보기" className="w-6 h-6" />
      </button>

      {/* 상단 공간(상태바 여백 포함) */}
      <div className="h-11" />

      {/* 메시지 영역 */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-[200px]"
      >
        {!hasConversationBegun ? (
          <div className="mt-10 flex flex-col items-center text-center text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-300 mb-3" />
            <p className="text-sm">무엇이든 물어보세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {messages.map((m) =>
              m.role === "bot" ? (
                <div key={m.id} className="flex flex-col items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-black/5 whitespace-pre-wrap leading-relaxed text-[15px]">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="bg-[#F0F2F5] rounded-2xl px-4 py-3 text-[15px] border border-black/5">
                    {m.text}
                  </div>
                </div>
              )
            )}

            {/* 제안 칩 */}
            {hasConversationBegun && (
              <div className="flex flex-wrap gap-8">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm text-sm text-gray-700"
                    onClick={() => setInput(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 입력 영역 - 탭바와 동일 너비/높이, 하단 모서리 라운드 제거 */}
      <div className="fixed inset-x-0 bottom-[72px] z-30">
        <div className="bg-white border border-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] rounded-t-[32px] px-6 h-[100px] flex items-center gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder="무엇이든 물어보세요"
            className="flex-1 h-full resize-none outline-none bg-transparent text-[18px] leading-6 placeholder:text-gray-400 pt-4"
          />
          <button
            className="ml-2 w-10 h-10 grid place-items-center"
            onClick={handleSend}
            aria-label="전송"
            type="button"
          >
            <img src="/Assets/icons/Up%20circle.svg" alt="전송" className="w-10 h-10" />
          </button>
        </div>
        <div className="h-[12px]" />
      </div>
    </div>
  );
}


