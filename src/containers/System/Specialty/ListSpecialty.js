import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';
import './ListSpecialty.scss'
import { deleteSpecialty } from '../../../services/userService'
import { toast } from 'react-toastify';


class ListSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialties: []
        };
    }

    async componentDidMount() {
        await this.props.fetchAllSpecialty();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataSpecialties !== prevProps.dataSpecialties) {
            this.setState({
                dataSpecialties: this.props.dataSpecialties
            });
        }
    }
    handleDeleteSpecialty = async (data) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bản ghi này không?");
        if (isConfirmed) {
            let res = await deleteSpecialty(data);
            if (res && res.data.errCode === 0) {
                toast.success("Xóa thành công!");
                await this.props.fetchAllSpecialty();
            } else {
                toast.error(res.data.errMessage);
            }
            console.log(res);
        } else {
            toast.info("Hủy thao tác xóa!");
        }
    };


    render() {
        const { dataSpecialties } = this.state;

        return (
            <React.Fragment>
                <div className='section-specialty'>
                    <div className='specialty-title'>
                        <h2>Chuyên Khoa Phổ Biến</h2>
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
                                {dataSpecialties && dataSpecialties.length > 0 ? (
                                    dataSpecialties.map((item, index) => (
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
                                            <td><button className='btn-delete-specialty' onClick={() => this.handleDeleteSpecialty(item)}>Xóa</button></td>
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
        dataSpecialties: state.admin.dataSpecialties
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(action.fetchAllSpecialty()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListSpecialty));
