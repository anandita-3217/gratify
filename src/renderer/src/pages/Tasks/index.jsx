import TaskItem from "./TaskItem";

import { TextInput, Button, Stack  } from "@mantine/core";

import { useState } from "react";
import { useTasks } from "./useTasks";

export default function Tasks(){
    const {tasks, addTask, deleteTask, toggleTask} = useTasks();

    const [input, setInput] = useState('');

    function handleAdd(){
        if (!input.trim()) return
        addTask({
            text: input,
            priority: 'medium',
            deadline: null,
            recurring: false,
            frequency: null
        })
        setInput('')
    }


    return (
        <Stack p="md">
            <div className="flex gap-2">
                <TextInput placeholder="add a task"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1"/>
                <Button onClick={handleAdd}>+</Button>
            </div>
            <Stack gap="sm">
                {tasks.map(task =>(
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ))}
            </Stack>
        </Stack>
    );
}