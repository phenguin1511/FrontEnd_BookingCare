import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./TableManageUser.scss";
import * as action from "../../../store/actions";
import { Pagination } from 'flowbite-react';

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentPage: 1,
            usersPerPage: 10 // For example, 10 users per page
        };
    }

    async componentDidMount() {
        await this.props.fetchAllUserRedux();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.users !== this.props.users) {
            this.setState({
                users: this.props.users
            });
        }
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    render() {
        const { users, currentPage, usersPerPage } = this.state;

        // Calculate users to display on the current page
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.address}</td>
                                <td>
                                    <button className='btn btn-primary'>Edit</button>
                                    <button onClick={() => this.handleDeleteUser(user)} className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(users.length / usersPerPage)}
                    onPageChange={this.handlePageChange}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.admin.users,
});

const mapDispatchToProps = dispatch => ({
    fetchAllUserRedux: () => dispatch(action.fetchAllUsersStart()),
    deleteUser: (id) => dispatch(action.deleteUser(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
