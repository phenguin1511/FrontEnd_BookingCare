import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import "./TableManageUser.scss";
import * as action from "../../../store/actions";
import { toast } from 'react-toastify';
class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentPage: 1,
            usersPerPage: 5,
            addUser: true
        };
    }
    getPaginatedUsers = () => {
        const { currentPage, usersPerPage } = this.state;
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return this.state.users.slice(indexOfFirstUser, indexOfLastUser);
    };

    async componentDidMount() {
        try {
            await this.props.fetchAllUserRedux();
        } catch (error) {
            console.log(error);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.users !== this.props.users) {
            this.setState({
                users: this.props.users,
                currentPage: 1 // Reset lại trang hiện tại khi dữ liệu thay đổi
            });
            this.props.getGenderStart();
            this.props.getPositionStart();
            this.props.getRoleStart();
        }
    }


    editUser = (user) => {
        this.props.setUserToEdit(user);
        this.props.history.push('/system/user-redux');
    };
    addUser = () => {
        let data = this.props.addUser
        this.props.setUserToEdit(data);
        this.props.history.push('/system/user-redux');
    }
    renderPagination = () => {
        const { users, usersPerPage, currentPage } = this.state;
        const totalPages = Math.ceil(users.length / usersPerPage);
        let pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => this.setState({ currentPage: page })}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    handleDeleteUser = async (user) => {
        let id = user.id;
        try {
            let res = await this.props.deleteUser(id)
            if (res && res.data.errCode === 0) {
                toast.success('Xóa người dùng thành công')
                await this.props.fetchAllUserRedux();
            }
        } catch (error) {
            toast.error("Lỗi xóa người dùng!")
        }

    }
    render() {
        let paginatedUsers = this.getPaginatedUsers();

        return (
            <React.Fragment>
                <div className='title'>List User</div>
                <button onClick={() => this.addUser()} className='btn btn-success'>Add</button>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Gender</th>
                            <th>Position</th>
                            <th>Role</th>
                            <th>PhoneNumber</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers && paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.address}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.positionId}</td>
                                    <td>{user.roleId}</td>
                                    <td>{user.phonenumber}</td>
                                    <td>
                                        <button onClick={() => this.editUser(user)} className='btn btn-primary'>Edit</button>
                                        <button onClick={() => this.handleDeleteUser(user)} className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {this.renderPagination()}
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => ({
    lang: state.app.language,
    users: state.admin.users // Lấy dữ liệu users từ Redux state
});

const mapDispatchToProps = dispatch => ({
    fetchAllUserRedux: () => dispatch(action.fetchAllUsersStart()),
    deleteUser: (id) => dispatch(action.deleteUser(id)),
    getGenderStart: () => dispatch(action.fetchGenderStart()),
    getPositionStart: () => dispatch(action.fetchPositionStart()),
    getRoleStart: () => dispatch(action.fetchRoleStart()),
    setUserToEdit: (user) => dispatch(action.setUserToEdit(user)), // Gọi action để lưu user vào Redux
});

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
