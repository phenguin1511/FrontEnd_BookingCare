import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, handleAddUser, deleteUserService, editUserService } from '../../services/userService';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';


class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModal: false,
            isOpenModalEdit: false,
            response: '',
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.updateFormUsers();
    }

    updateFormUsers = async () => {
        try {
            let response = await getAllUsers('ALL');
            if (response.data && response.data.errCode === 0) {
                this.setState({
                    arrUsers: response.data.users
                });
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    handleAddUser = () => {
        this.setState({ isOpenModal: true });
    };

    handleCloseModal = () => {
        this.setState({ isOpenModal: false, response: '' });
    };

    handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`);

        if (confirmDelete) {
            try {
                let response = await deleteUserService(user.id);
                if (response && response.data.errCode === 0) {
                    await this.updateFormUsers();
                    alert('Delete User Success!!!');
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await handleAddUser(data);
            if (response && response.data.errCode !== 0) {
                alert(response.data.errMessage);
                this.setState({
                    response: false
                });
                this.handleAddUser();
            } else {
                alert(response.data.message);
                this.setState({
                    response: true
                });
                await this.updateFormUsers();
                this.handleCloseModal();
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    handleEditUser = (data) => {
        this.setState({
            isOpenModalEdit: true,
            userEdit: data
        });
    }

    handleCloseModalEdit = () => {
        this.setState({ isOpenModalEdit: false, response: '' });
    };

    editUser = async (data) => {
        const confirmEdit = window.confirm(`Are you sure you want to edit user ${data.firstName} ${data.lastName}?`);
        if (confirmEdit) {
            try {
                let response = await editUserService(data);
                if (response && response.data.errCode !== 0) {
                    alert(response.data.message);
                    this.setState({
                        response: false
                    });
                } else {
                    alert(response.data.message);
                    this.setState({
                        response: true
                    });
                    await this.updateFormUsers();
                    this.handleCloseModalEdit(); // Close edit modal after successful update
                }
            } catch (error) {
                console.error("Error editing user:", error);
            }
        }

    };

    render() {
        let { arrUsers, isOpenModal, isOpenModalEdit } = this.state;
        return (
            <div className="user-container">
                <h2 className="title text-center">Quản Lý Người Dùng</h2>
                <div onClick={this.handleAddUser} className='col-12 button-add-user'>
                    ADD NEW USER
                </div>
                <div className="user-table mt-4 mx-auto">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Điện Thoại</th>
                                    <th>Địa Chỉ</th>
                                    <th className="text-center">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrUsers && arrUsers.length > 0 ? (
                                    arrUsers.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.firstName}{' '}{item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phonenumber}</td>
                                            <td>{item.address}</td>
                                            <td className="text-center">
                                                <div className="action-buttons">
                                                    <button onClick={() => this.handleEditUser(item)} className="btn btn-edit">Sửa</button>
                                                    <button onClick={() => this.handleDeleteUser(item)} className="btn btn-delete">Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">Không có người dùng nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ModalAddUser
                    show={isOpenModal}
                    onHide={this.handleCloseModal}
                    createNewUser={this.createNewUser}
                    response={this.state.response}
                />
                {
                    this.state.isOpenModalEdit &&
                    <ModalEditUser
                        show={isOpenModalEdit}
                        onHide={this.handleCloseModalEdit}
                        currentUser={this.state.userEdit}
                        editUser={this.editUser} // Pass editUser function
                        response={this.state.response}
                    />
                }

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
