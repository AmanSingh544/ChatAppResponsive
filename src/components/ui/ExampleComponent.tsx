import { useApiWithToast } from "@/hooks/useApiWithToast";
import axios from "axios";

function ExampleComponent() {
  const { callApi } = useApiWithToast();

  const handleClick = async () => {
    const { success, data } = await callApi(() =>
      axios.get("/api/some-endpoint"),
      {
        successMessage: "Data fetched successfully!",
        errorMessage: "Failed to fetch data",
        onSuccess: () => console.log("Fetched and toasted"),
      }
    );

    if (success) {
      console.log("Data:", data);
    }
  };

  return <button onClick={handleClick}>Fetch</button>;
}
