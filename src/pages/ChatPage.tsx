import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import TabBar from "../components/molecules/TabBar";
import { useWebControlStore } from "../store/webControlStore";
import { cn } from "../utils/style";
import {
  sendChatMessage,
  getChatHistory,
  deleteChatHistory,
} from "../api/chatbot";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp?: string;
};

function isAxiosError(
  error: unknown
): error is { response: { status: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { status?: number } }).response !== null &&
    "status" in (error as { response: { status?: number } }).response!
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isWide = useWebControlStore((state) => state.isWide);

  const hasConversationBegun = messages.length > 0;

  // 대화 기록 불러오기 - 인증 체크 제거
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await getChatHistory();

        if (response.isSuccess && response.data?.messages) {
          const historyMessages: Message[] = response.data.messages.map(
            (msg) => ({
              id: msg.messageId.toString(),
              role: msg.role === "USER" ? "user" : "bot",
              text: msg.content,
              timestamp: msg.createdAt,
            })
          );
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("대화 기록 로딩 실패:", error);
        // 에러가 발생해도 빈 상태로 시작
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  // 새 메시지가 추가되면 하단으로 스크롤
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = useMemo(
    () => ["반려동물 OK", "지금 영업중", "디저트 맛집"],
    []
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmed);
      if (response.isSuccess) {
        const botMessage: Message = {
          id: response.data.messageId.toString(),
          role: "bot",
          text: response.data.content,
          timestamp: response.data.createdAt,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("API 응답이 실패했습니다.");
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response.status === 401) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.navigate({ to: "/login" });
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "죄송합니다. 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해주세요.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("대화 기록을 모두 삭제하시겠습니까?")) return;
    try {
      await deleteChatHistory();
      setMessages([]);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response.status === 401) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        router.navigate({ to: "/login" });
        return;
      }
      alert("대화 기록 삭제에 실패했습니다.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (isLoadingHistory) {
    return (
      <div className="mx-auto max-w-[560px] min-h-dvh bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-gray-400">대화 기록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full h-dvh bg-[#F7F8FA] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <button
          className="w-6 h-6 grid place-items-center"
          aria-label="더보기"
          type="button"
        >
          <img
            src="/Assets/icons/More%20circle.svg"
            alt="더보기"
            className="w-6 h-6"
          />
        </button>

        {hasConversationBegun && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            type="button"
          >
            대화 삭제
          </button>
        )}
      </div>

      <div 
        ref={listRef} 
        className={cn("overflow-y-auto px-4 pt-4", {
          "h-[calc(100vh-200px)]": isWide,
          "h-[calc(100vh-184px)]": !isWide,
        })}
      >
        {!hasConversationBegun ? (
          <div className="mt-10 flex flex-col items-center text-center text-gray-400 pb-[200px]">
            <div className="w-12 h-12 rounded-full bg-gray-300 mb-3" />
            <p className="text-sm">무엇이든 물어보세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 pb-[280px]">
            {messages.map((m) =>
              m.role === "bot" ? (
                <div key={m.id} className="flex flex-col items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-black/5 whitespace-pre-wrap leading-relaxed text-[15px] max-w-[80%]">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="bg-[#F0F2F5] rounded-2xl px-4 py-3 text-[15px] border border-black/5 max-w-[80%]">
                    {m.text}
                  </div>
                </div>
              )
            )}

            {isLoading && (
              <div className="flex flex-col items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-black/5">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {hasConversationBegun && !isLoading && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => handleSuggestionClick(s)}
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

      {/* 입력 영역 */}
      <div
        className={cn("inset-x-0 z-30", {
          "relative bottom-23": isWide,
          "fixed bottom-[72px]": !isWide,
        })}
      >
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
            placeholder={
              isLoading ? "응답을 기다리는 중..." : "무엇이든 물어보세요"
            }
            disabled={isLoading}
            className="overflow-visible flex-1 h-10 resize-none outline-none bg-transparent text-[18px] placeholder:text-gray-400 py-0 disabled:opacity-50"
            style={{ verticalAlign: "middle" }}
          />
          <button
            className={cn(
              "ml-2 w-10 h-10 grid place-items-center transition-opacity",
              { "opacity-50 cursor-not-allowed": isLoading || !input.trim() }
            )}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="전송"
            type="button"
          >
            <img
              src="/Assets/icons/Up%20circle.svg"
              alt="전송"
              className="w-10 h-10"
            />
          </button>
        </div>
        <div className="h-[12px]" />
      </div>
      {isWide && <TabBar className="sticky bottom-30 w-full z-30" />}
    </div>
  );
}
