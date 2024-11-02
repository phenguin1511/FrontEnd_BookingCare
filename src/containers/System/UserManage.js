import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers } from '../../services/userService';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [] // Khởi tạo mảng rỗng để tránh lỗi undefined
        };
    }

    async componentDidMount() {
        try {
            let response = await getAllUsers('ALL');
            console.log("API response:", response);
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

    render() {
        console.log('check render', this.state);
        let { arrUsers } = this.state;

        return (
            <div className="user-container">
                <h2 className="title text-center">Quản Lý Người Dùng</h2>
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
                                            <td>{item.firstName} {item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phonenumber}</td>
                                            <td>{item.address}</td>
                                            <td className="text-center">
                                                <div className="action-buttons">
                                                    <button className="btn btn-edit">Sửa</button>
                                                    <button className="btn btn-delete">Xóa</button>
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
