import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import './ModalAddUser.scss';

class ModalAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            password: '',
            email: '',
            phonenumber: '',
            address: '',
            errorMessage: ''
        };
    }

    checkValideInput = () => {
        let isValid = true;
        const arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];

        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                this.setState({ errorMessage: `Missing parameter: ${arrInput[i].toUpperCase()}` });
                break;
            }
        }

        return isValid;
    }

    handleChangeInput = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value, errorMessage: '' }); // Reset error message on input change
    };

    handleAddUser = () => {
        if (this.checkValideInput()) {
            this.props.createNewUser(this.state); // Reset form after successful submission
        }
    };


    render() {
        const { show, onHide } = this.props;
        const { errorMessage } = this.state;

        return (
            <Modal
                show={show}
                onHide={onHide}
                centered
                className="custom-modal"
            >
                <Modal.Header className="modal-header-custom">
                    <Modal.Title className="text-center w-100">Add New User</Modal.Title>
                    <button type="button" className="close-button" onClick={onHide}>
                        <AiOutlineClose size={24} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <Form>
                        <Form.Group controlId="formFirstName">
                            <Form.Label className="modal-label">First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your First Name"
                                className="modal-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formLastName">
                            <Form.Label className="modal-label">Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your Last Name"
                                className="modal-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label className="modal-label">Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your Password"
                                className="modal-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label className="modal-label">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your Email"
                                className="modal-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhone">
                            <Form.Label className="modal-label">Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phonenumber"
                                value={this.state.phonenumber}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your Phone Number"
                                className="modal-input"
                            />
                        </Form.Group>

                        <Form.Group controlId="formAddress">
                            <Form.Label className="modal-label">Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={this.state.address}
                                onChange={this.handleChangeInput}
                                placeholder="Enter Your Address"
                                className="modal-input"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="secondary" onClick={onHide} className="btn-cancel">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleAddUser} className="btn-save">
                        <i className="fas fa-check"></i> Enter
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect()(ModalAddUser);
