import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil, BsSave } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
                // Fixed typo: Window -> window
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Function to handle delete button click
    const handleDeleteClick = (id) => {
        setTodoToDelete(id);
        setShowDeleteConfirm(true);
    };

    // Function to confirm deletion
    const confirmDelete = () => {
        Hdelete(todoToDelete);
    };

    // Function to cancel deletion
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setTodoToDelete(null);
    };

    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
                setShowDeleteConfirm(false);
                setTodoToDelete(null);
            })
            .catch(err => console.log(err));
    };

    return (
        <main>
            <Create />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                {taskid === todo._id ?
                                    <input type='text' value={updatetask} onChange={e => setUpdatetask(e.target.value)} />
                                    :
                                    <div className="todo-item">
                                        <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                        {todo.createdAt && (
                                            <small className="timestamp">
                                                Created {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
                                            </small>
                                        )}
                                    </div>
                                }
                            </div>
                            <div>
                                <span>
                                    {/* Changed edit button to show different icons based on edit state */}
                                    {taskid === todo._id ? (
                                        <BsSave 
                                            className='icon' 
                                            title="Save changes"
                                            onClick={() => Update(todo._id, updatetask)} 
                                        />
                                    ) : (
                                        <BsPencil 
                                            className='icon' 
                                            title="Edit item"
                                            onClick={() => {
                                                setTaskid(todo._id);
                                                setUpdatetask(todo.task);
                                            }} 
                                        />
                                    )}
                                    <BsFillTrashFill 
                                        className='icon' 
                                        title="Delete item"
                                        onClick={() => handleDeleteClick(todo._id)} 
                                    />
                                </span>
                            </div>
                        </div>
                    ))
            }
            
            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="delete-modal-backdrop">
                    <div className="delete-modal">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this todo item?</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                            <button className="delete-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
