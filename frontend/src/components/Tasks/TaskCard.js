import React from 'react';

const TaskCard = ({ task, userTask }) => {
  return (
    <div key={userTask.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold">{task.name}</h3>
          <p className="text-sm text-gray-400">{task.description}</p>
        </div>
        <span className="bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs px-2 py-1 rounded">+${task.reward.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center">
        {task.total_steps > 1 ? (
          <>
            <div className="text-xs text-gray-500">{userTask.progress}/{userTask.task.total_steps} days</div>
            <div className="flex space-x-1">
              {Array.from({ length: task.total_steps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index < userTask.progress ? 'bg-green-500' : 'bg-gray-600'}`}
                ></div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-gray-500">
              {userTask.is_completed ? (userTask.is_claimed ? "Completed" : "Not started") : "Not started"}
            </div>
            {userTask.is_completed ? (
              userTask.is_claimed ? (
                <button className="text-xs text-green-400 font-bold" disabled>
                  <i className="fas fa-check-circle mr-1"></i> CLAIMED
                </button>
              ) : (
                <button className="text-xs text-blue-400 font-bold">
                  <i className="fas fa-gift mr-1"></i> CLAIM
                </button>
              )
            ) : (
              <button className="text-xs text-blue-400 font-bold">
                {task.name === "Upgrade to Pro Node" ? (
                  <><i className="fas fa-arrow-right mr-1"></i> UPGRADE</>
                ) : task.name === "Social Media Share" ? (
                  <><i className="fas fa-share-alt mr-1"></i> SHARE</>
                ) : (
                  <><i className="fas fa-arrow-right mr-1"></i> START</>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
