import React from 'react';
import TaskCard from './TaskCard';

const TasksList = ({ tasks, activeTaskType }) => {
  return (
    <div className="space-y-4">
      {tasks.filter(task => task.task.type === activeTaskType).map((userTask) => (
        <TaskCard key={userTask.id} task={userTask.task} userTask={userTask} />
      ))}
    </div>
  );
};

export default TasksList;
