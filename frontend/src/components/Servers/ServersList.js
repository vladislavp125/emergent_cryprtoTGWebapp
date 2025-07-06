import React from 'react';
import ServerCard from './ServerCard';

const ServersList = ({ servers, rentServer }) => {
  return (
    <div className="space-y-4">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} rentServer={rentServer} />
      ))}
    </div>
  );
};

export default ServersList;
