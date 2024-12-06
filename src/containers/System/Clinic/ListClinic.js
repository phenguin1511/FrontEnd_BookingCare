import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';
import './ListClinic.scss'
import { deleteClinic } from '../../../services/userService'
import { toast } from 'react-toastify';


class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        };
    }

    async componentDidMount() {
        await this.props.fetchAllClinic();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataClinic !== prevProps.dataClinic) {
            this.setState({
                dataClinic: this.props.dataClinic
            });
        }
    }

    handleDeleteClinic = async (data) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bản ghi này không?");
        if (isConfirmed) {
            let res = await deleteClinic(data);
            if (res && res.data.errCode === 0) {
                toast.success("Xóa thành công!");
                await this.props.fetchAllClinic();
            } else {
                toast.error(res.data.errMessage);
            }
            console.log(res);
        } else {
            toast.info("Hủy thao tác xóa!");
        }
    };

    handleAddClinic = () => {
        this.props.history.push('/system/manage-clinic');
    };
    render() {
        const { dataClinic } = this.state;

        return (
            <React.Fragment>
                <div className='section-specialty'>
                    <div className='specialty-title'>
                        <h2>Danh Sách Cơ Sở Y Tế</h2>
                    </div>
                    <div className='table_list_specialty'>
                        <table border="1" className="specialty-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Hình ảnh</th>
                                    <th>Ngày tạo</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataClinic && dataClinic.length > 0 ? (
                                    dataClinic.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className='list-button'>
                                                <button
                                                    className='btn-add-specialty'
                                                    onClick={this.handleAddClinic}
                                                >
                                                    Thêm
                                                </button>

                                                <button className='btn-delete-specialty' onClick={() => this.handleDeleteClinic(item)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            Không có dữ liệu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        dataClinic: state.admin.dataClinic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(action.fetchAllClinic()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListClinic));
