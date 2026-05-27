import { useState } from "react";
import { apiManager } from "../../../shared/services/ApiManager";

interface CreateUserResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function useSendCreateUser() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateUserResult | null>(null);

  const createUser = async (userData: {
    nickname: string;
    avatar?: string;
  }) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await apiManager.createUser(userData);
      if (response && response.success) {
        setResult({ success: true, message: response.message });
        return { success: true, message: response.message };
      } else {
        // error 프로퍼티가 없을 수 있으므로 message 또는 기본값 사용
        setResult({ success: false, error: response?.message || "API 실패" });
        return { success: false, error: response?.message || "API 실패" };
      }
    } catch (error: any) {
      setResult({ success: false, error: error?.message || "Unknown error" });
      return { success: false, error: error?.message || "Unknown error" };
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, result };
}
