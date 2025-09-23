export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // API 에러 응답 처리
  if (typeof error === 'object' && error !== null) {
    const apiError = error as any;
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

export const getChatbotErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  // 특정 에러에 대한 사용자 친화적 메시지
  if (message.includes('UNAUTHORIZED') || message.includes('401')) {
    return '로그인이 필요합니다. 다시 로그인해주세요.';
  }
  
  if (message.includes('FORBIDDEN') || message.includes('403')) {
    return '접근 권한이 없습니다.';
  }
  
  if (message.includes('INTERNAL_SERVER_ERROR') || message.includes('500')) {
    return 'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (message.includes('TOO_MANY_REQUESTS') || message.includes('429')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (message.includes('Network Error') || message.includes('ERR_NETWORK')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  return '죄송합니다. 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해주세요.';
};