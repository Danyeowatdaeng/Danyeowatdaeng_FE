import { get, post, del } from "./index";

// 챗봇 요청/응답 타입
export type ChatRequest = {
  message: string;
  model?: string;
};

export type ChatResponse = {
  isSuccess: boolean;
  data: {
    messageId: number;
    conversationId: number;
    role: "USER" | "ASSISTANT";
    content: string;
    model: string;
    tokenCount: number;
    createdAt: string;
  };
};

export type ConversationHistoryResponse = {
  isSuccess: boolean;
  data: {
    id: number;
    title: string;
    createdAt: string;
    messages: Array<{
      messageId: number;
      conversationId: number;
      role: "USER" | "ASSISTANT";
      content: string;
      model: string;
      tokenCount: number;
      createdAt: string;
    }>;
  };
};

// 챗봇과 대화
export const sendChatMessage = async (message: string, model = "gemini-1.5-flash"): Promise<ChatResponse> => {
  return await post("/chatbot/chat", { message, model });
};

// 대화 기록 조회
export const getChatHistory = async (): Promise<ConversationHistoryResponse> => {
  return await get("/chatbot/history");
};

// 대화 기록 삭제
export const deleteChatHistory = async () => {
  return await del("/chatbot/history");
};