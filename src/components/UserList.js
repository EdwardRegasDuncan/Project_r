import React from "react";

const UserList = ({ clients }) => {
  return (
    <div className="user-list">
      <h2>Users</h2>
      <div className="user">
        <ul>
          {clients.map((client, index) => (
            <li key={index}>{client}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
