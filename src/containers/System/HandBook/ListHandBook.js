import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';
import './ListHandBook.scss'
import { deleteHandbook } from '../../../services/userService'
import { toast } from 'react-toastify';


class ListHandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandBook: []
        };
    }

    async componentDidMount() {
        await this.props.fetchAllHandBook();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataHandBook !== prevProps.dataHandBook) {
            this.setState({
                dataHandBook: this.props.dataHandBook
            });
        }
    }

    handleDeleteClinic = async (data) => {
        console.log(data)
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bản ghi này không?");
        if (isConfirmed) {
            let res = await deleteHandbook(data);
            if (res && res.data.errCode === 0) {
                toast.success("Xóa thành công!");
                await this.props.fetchAllHandBook();
            } else {
                toast.error(res.data.errMessage);
            }
            console.log(res);
        } else {
            toast.info("Hủy thao tác xóa!");
        }
    };

    handleAddClinic = () => {
        this.props.history.push('/system/manage-handbook');
    };

    handleEditClinic = () => {
        this.props.history.push('/system/edit-handbook');
    }
    render() {
        const { dataHandBook } = this.state;
        console.log(this.props.dataHandBook)
        return (
            <React.Fragment>
                <div className='section-specialty'>
                    <div className='specialty-title'>
                        <h2>Danh Sách Cẩm Nang</h2>
                    </div>
                    <button
                        className='btn-add-specialty'
                        onClick={this.handleAddClinic}
                    >
                        Thêm
                    </button>
                    <div className='table_list_specialty'>
                        <table border="1" className="specialty-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tiêu đề</th>
                                    <th>Tiêu đề phụ</th>
                                    <th>Hình ảnh</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataHandBook && dataHandBook.length > 0 ? (
                                    dataHandBook.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.child_title}</td>
                                            <td>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td className='list-button'>
                                                <button
                                                    className='btn-edit-specialty'
                                                    onClick={this.handleEditClinic}
                                                >
                                                    Edit
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
        dataHandBook: state.admin.dataHandBook
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandBook: () => dispatch(action.fetchAllHandBook()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListHandBook));
