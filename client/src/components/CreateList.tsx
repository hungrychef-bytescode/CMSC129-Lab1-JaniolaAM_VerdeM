import { useState } from "react";
import API from "../services/api";

interface Props {
  refreshLists: () => void
}

export default function CreateList({ refreshLists }: Props) {

  const [name, setName] = useState("");

  const createList = async () => {

    if (!name) return;

    await API.post("/lists", { name });

    setName("");
    refreshLists();
  };

  return (

    <div>

      <h3>Create List</h3>

      <input
        placeholder="List name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createList}>
        Create
      </button>

    </div>

  );
}