import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { IconAdd } from '../assets/Assets';
import { color } from '../utils/Color';
import { Input, Box, Button, Textarea } from './Components';
import { HashLoader } from 'react-spinners';

const customStyles = {
	content: {
		top: '50%',
		left: '5vw',
		transform: 'translate(0, -50%)',
		margin: '0 auto',
		width: '90vw',
		maxWidth: '768px',
		height: 'fit-content',
		background: color.nav,
		borderRadius: '.3rem',
	},
};

Modal.setAppElement('#root');

const ModalComp = ({ isOpen }) => {
	const userData = JSON.parse(localStorage.getItem('user'));
	const userId = userData.data._id;
	const [title, setTitle] = useState('');
	const [note, setNote] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const submitHandler = async (e) => {
		setError(null);
		setLoading(true);
		const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};
		await axios
			.post(
				`https://denoter-server.herokuapp.com/api/notes/create/${userId}`,
				{
					title,
					note,
				},
				config
			)
			.then((data) => {
				console.log(data);
				setLoading(false);
				setIsOpen(false);
			})
			.catch((err) => {
				setLoading(false);
				setError(error.response.data.message);
			});
	};

	return (
		<div>
			<Fab>
				<img
					width={50}
					height={50}
					src={IconAdd}
					alt="add"
					onClick={openModal}
				/>
			</Fab>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
			>
				<form onSubmit={submitHandler}>
					<HashLoader color={color.btn} loading={loading} />
					<Box margin="1rem" />
					{error && <h3 style={{ color: '#f04848' }}>{error}</h3>}
					<Box margin="1rem" />

					{/* make title optional */}
					<Input
						required
						label="Title"
						type="text"
						placeholder="Anything..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Box margin="1rem" />

					{/* make title optional */}
					<Textarea
						required
						label="Note"
						type="text"
						placeholder="Pour what in ur mind here..."
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
					<Box margin="1.5rem" />

					<Button label="Add Note" type="submit" />
				</form>
			</Modal>
		</div>
	);
};

export default ModalComp;

const Fab = styled.div`
	position: fixed;
	right: 5%;
	bottom: 3%;
	cursor: pointer;

	img {
		background-color: white;
		border-radius: 50%;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
			rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
	}
`;
