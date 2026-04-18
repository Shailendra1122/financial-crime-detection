import { sendTransaction } from "./services/api";

function App() {

  const handleClick = async () => {
    const data = {
      amount: 1000,
      type: "credit"
    };

    try {
      const res = await sendTransaction(data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        Send Transaction
      </button>
    </div>
  );
}

export default App;