import { useToast } from "@/components/ui/use-toast"; // Adjust the import path accordingly

type ApiCall<T> = () => Promise<T>;

interface ApiWithToastOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useApiWithToast() {
  const { toast } = useToast();

  const callApi = async <T>(
    apiCall: ApiCall<T>,
    options?: ApiWithToastOptions
  ): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const result = await apiCall();

      toast({
        title: "Success",
        description: options?.successMessage || "Operation completed successfully",
      });

      options?.onSuccess?.();

      return { success: true, data: result };
    } catch (error: any) {
      const message =
        options?.errorMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast({
        title: "Error",
        description: message,
      });

      options?.onError?.(error);

      return { success: false, error };
    }
  };

  return { callApi };
}
