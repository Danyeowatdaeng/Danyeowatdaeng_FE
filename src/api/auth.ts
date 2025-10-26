// 테스트용 회원가입 API
export const testSignup = async (email: string, name: string) => {
  try {
    const response = await fetch('https://danyeowatdaeng.p-e.kr/api/auth/test/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('테스트 회원가입에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('테스트 회원가입 에러:', error);
    throw error;
  }
};
