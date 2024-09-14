import React, { useState } from "react";

const DiceRoller = ({ rollDice }) => {
  const [count, setCount] = useState();
  const [sides, setSides] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Rolling ${count}D${sides}...`);
    rollDice(count, sides);
    setCount("");
    setSides("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dice Roller</h2>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        placeholder="# of dice"
      />
      <input
        type="number"
        value={sides}
        onChange={(e) => setSides(e.target.value)}
        placeholder="sides"
      />
      <button type="submit">Roll</button>
    </form>
  );
};

export default DiceRoller;
