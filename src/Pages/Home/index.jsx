import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        roomId: "",
        username: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData((currentFormData) => {
            const updatedFormData = { ...currentFormData, [name]: value };
            return updatedFormData;
        })
    }

    const createNewRoom = (e) => {
        e.preventDefault();

        const id = uuidV4();

        setFormData((currentFormData) => {
            const updatedFormData = { ...currentFormData, roomId: id };
            return updatedFormData;
        })

        toast.success("Created New Room");
    }

    const joinRoom = () => {
        const { roomId, username } = formData;
        if (!roomId || !username) {
            toast.error("ROOM ID & USERNAME is required");
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username
            }
        });
    }

    const onKeyupHandler = (e) => {
        if (e.key != "Enter") return;

        joinRoom();
    }

    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img className='homePageLogo' src="/code-sync.png" alt="code-sync-logo" />
                <h4 className='mainLabel'>Paste Invitation Room Id</h4>
                <div className='inputGroup'>
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='ROOM ID'
                        name='roomId'
                        value={formData.roomId}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyupHandler}
                    />
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='USERNAME'
                        name='username'
                        value={formData.username}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyupHandler}
                    />
                    <button
                        className='btn joinBtn'
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>

            <footer>
                <h4>
                    Built with 🔥 by &nbsp;
                    <a href="#">Raj</a>
                </h4>
            </footer>
        </div>
    )
}

export default Home