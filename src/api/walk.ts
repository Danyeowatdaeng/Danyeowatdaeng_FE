import axios from "axios";

export async function createWalk(imageUrl: string) {
  const res = await axios.post("https://danyeowatdaeng.p-e.kr/api/walk", 
    { imageUrl },
    { withCredentials: true, headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}