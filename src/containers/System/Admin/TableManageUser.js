import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./TableManageUser.scss";
import * as action from "../../../store/actions";

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

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
                users: this.props.users
            })
            this.props.getGenderStart();
            this.props.getPositionStart();
            this.props.getRoleStart();
        }

    }
    handleDeleteUser = (user) => {
        const confirmEdit = window.confirm(`Are you sure you want to edit user ${user.firstName} ${user.lastName}?`);
        if (confirmEdit) {
            this.props.deleteUser(user.id);
        } else {
            alert("Delete Failed!!");
        }
    }

    editUser = (user) => {
        this.props.hanldeEditUserRedux(user);
        console.log(user)
    }

    render() {
        let users = this.props.users; // Access users from props

        return (
            <React.Fragment>
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
                        {users && users.length > 0 ? (
                            users.map((user, index) => (
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
                                <td colSpan="5">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.app.language,
    users: state.admin.users // Map users from Redux state
});

const mapDispatchToProps = dispatch => ({
    fetchAllUserRedux: () => dispatch(action.fetchAllUsersStart()),
    deleteUser: (id) => dispatch(action.deleteUser(id)),
    getGenderStart: () => dispatch(action.fetchGenderStart()),
    getPositionStart: () => dispatch(action.fetchPositionStart()),
    getRoleStart: () => dispatch(action.fetchRoleStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
