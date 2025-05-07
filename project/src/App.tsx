import Header from "./components/Header"; // Corrected path
import Main from "./components/Main";
import "./index.css";

async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) return response.json();
    if (response.status !== 429) throw new Error(`Error: ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
  }
  throw new Error("Too many requests. Please try again later.");
}

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [data, setData] = useState<Record<string, unknown> | null>(null); // State to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithRetry("https://api.example.com/data", {});
        setData(data); // Store fetched data in state
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogin = () => {
    setUser({ name: "John Doe" });
  };

  return (
    <div>
      <Header />
      <button onClick={handleLogin}>Login</button>
      {user && <p>Welcome, {user.name}!</p>}
      {data && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <Main />
      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ padding: "1rem", textAlign: "center" }}>
      Footer content
    </footer>
  );
}

export default App;
