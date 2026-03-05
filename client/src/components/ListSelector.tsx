import { useEffect, useState } from "react";
import API from "../services/api";

interface List {
  id: string
  name: string
}

interface Props {
  onSelect: (id: string) => void
}

export default function ListSelector({ onSelect }: Props) {

  const [lists, setLists] = useState<List[]>([]);

  const fetchLists = async () => {

    const res = await API.get("/lists");
    setLists(res.data);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (

    <div>

      <h3>Select List</h3>

      <select onChange={(e) => onSelect(e.target.value)}>

        <option>Select List</option>

        {lists.map(list => (

          <option key={list.id} value={list.id}>
            {list.name}
          </option>

        ))}

      </select>

    </div>

  );
}