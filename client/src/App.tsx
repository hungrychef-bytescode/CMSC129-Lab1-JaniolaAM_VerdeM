import { useState } from "react";

import CreateList from "./components/CreateList";
import ListSelector from "./components/ListSelector";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

function App() {

  const [listId, setListId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTasks = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (

    <div>

      <h1>Task Manager</h1>

      <CreateList refreshLists={() => {}} />

      <ListSelector onSelect={setListId} />

      {listId && (
        <>
          <AddTask listId={listId} refresh={refreshTasks} />
          <TaskList key={refreshKey} listId={listId} />
        </>
      )}

    </div>

  );
}

export default App;