import React, { useState } from "react";

const SkillTriggersWindow = ({rollDice}) => {
    const [skillTrigger, setSkillTrigger] = useState([]);
    const [newSkill, setNewSkill] = useState({
        name: '',
        description: '',
        modifier: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'modifier' && isNaN(value)) {
            return;
        }
        setNewSkill({ ...newSkill, [name]: value });
    };

    const addSkillTrigger = (e) => {
        if (newSkill.name && newSkill.description && newSkill.modifier) {
            setSkillTrigger([...skillTrigger, newSkill]);
            setNewSkill({
                name: '',
                description: '',
                modifier: ''
            });
        }
    }

    const removeSkillTrigger = (index) => {
        const updatedSkillTrigger = [...skillTrigger];
        updatedSkillTrigger.splice(index, 1);
        setSkillTrigger(updatedSkillTrigger);
    }

    const handleRollRequest = (modifier) => {
        console.log(`Rolling with modifier: ${modifier}`);
        rollDice(1, 20, parseInt(modifier));
      };

    return (
        <div className="skill-triggers-window">
            <h2>Skill Triggers</h2>
            <table>
                <thread>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Modifier</th>
                    </tr>
                </thread>
                <tbody>
                    {skillTrigger.map((skill, index) => (
                        <tr key={index}>
                            <td>
                                <button onClick={() => removeSkillTrigger(index)}>X</button>
                            </td>
                            <td>{skill.name}</td>
                            <td>{skill.description}</td>
                            <td>
                                {skill.modifier}

                                <button onClick={() => {
                                    const updatedSkillTrigger = [...skillTrigger];
                                    updatedSkillTrigger[index].modifier = parseInt(skill.modifier) + 1;
                                    setSkillTrigger(updatedSkillTrigger);
                                }}>+</button>
                                <button onClick={() => {
                                    const updatedSkillTrigger = [...skillTrigger];
                                    updatedSkillTrigger[index].modifier = parseInt(skill.modifier) - 1;
                                    setSkillTrigger(updatedSkillTrigger);
                                }}>-</button>
                            </td>
                            <td>
                                <button onClick={() => handleRollRequest(skill.modifier)}>Roll</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="add-skill-trigger">
                <input
                    type="text"
                    name="name"
                    value={newSkill.name}
                    onChange={handleInputChange}
                    placeholder="Skill Name"
                />
                <input
                    type="text"
                    name="description"
                    value={newSkill.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
                <input
                    type="text"
                    name="modifier"
                    value={newSkill.modifier}
                    onChange={handleInputChange}
                    placeholder="Modifier"
                />
                <button onClick={addSkillTrigger}>Add Skill Trigger</button>
            </div>
        </div>
    )
};

export default SkillTriggersWindow;