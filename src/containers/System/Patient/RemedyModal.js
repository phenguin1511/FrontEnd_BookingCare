import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { Modal } from 'reactstrap';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            imagePreviewUrl: '',
            medicines: [
                { name: '', dosage: '' } // Một thuốc gồm tên và liều lượng
            ],
            revisitDate: '',
            note: '' // Thêm trường ghi chú
        };
    }

    handleToggle = () => {
        this.props.handleCloseModal();
    };

    componentDidMount() { }

    componentDidUpdate(prevProps) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal?.email || ''
            });
        }
    }

    handleOnChangeImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);

            this.setState({
                imgBase64: base64,
                imagePreviewUrl: objectUrl
            });
        }
    };

    handleSendRemedy = () => {
        const { email, imgBase64, medicines, revisitDate, note } = this.state;

        if (this.props.sendRemedy) {
            this.props.sendRemedy({
                email,
                imgBase64,
                medicines,
                revisitDate,
                note // Thêm ghi chú vào tham số gửi
            });
        }

        this.setState({
            email: '',
            imgBase64: '',
            imagePreviewUrl: '',
            medicines: [{ name: '', dosage: '' }],
            revisitDate: '',
            note: '' // Reset ghi chú
        });

        this.handleToggle();
    };

    handleAddMedicine = () => {
        this.setState((prevState) => ({
            medicines: [...prevState.medicines, { name: '', dosage: '' }]
        }));
    };

    handleMedicineChange = (event, index, field) => {
        const { value } = event.target;
        this.setState((prevState) => {
            const medicines = [...prevState.medicines];
            medicines[index][field] = value;
            return { medicines };
        });
    };

    handleRemoveMedicine = (index) => {
        this.setState((prevState) => ({
            medicines: prevState.medicines.filter((_, i) => i !== index)
        }));
    };

    render() {
        console.log(this.state)
        const { isOpenRemedyModal, dataModal } = this.props;
        const { email, imagePreviewUrl, note } = this.state;

        return (
            <Fragment>
                <Modal
                    isOpen={isOpenRemedyModal}
                    toggle={this.handleToggle}
                    backdrop={true}
                    className="remedy-modal-container"
                    size="lg"
                    centered={true}
                >
                    <div className="remedy-modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Thông Tin Đơn Thuốc Và Hóa Đơn Khám Bệnh</h5>
                            <button className="btn-close" onClick={this.handleToggle} aria-label="Close">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {dataModal ? (
                                <div className="info-container">
                                    {/* Email */}
                                    <div className="info-row">
                                        <span className="label">Email Bệnh Nhân:</span>
                                        <span className="value">{email}</span>
                                    </div>
                                    <div className="label">Danh Sách Thuốc:</div>
                                    {/* Thuốc */}
                                    {this.state.medicines.map((medicine, index) => (
                                        <div key={index} className="medicine-container">
                                            <div className="info-row">
                                                <span className="label">Thuốc {index + 1}:</span>
                                                <input
                                                    className="form-control medicine-input"
                                                    type="text"
                                                    placeholder="Tên thuốc: "
                                                    value={medicine.name}
                                                    onChange={(e) => this.handleMedicineChange(e, index, 'name')}
                                                />
                                                <input
                                                    className="form-control dosage-input"
                                                    type="text"
                                                    placeholder="Liều lượng: Số lượng/Ngày"
                                                    value={medicine.dosage}
                                                    onChange={(e) => this.handleMedicineChange(e, index, 'dosage')}
                                                />
                                                <button
                                                    className="btn btn-danger btn-remove-medicine"
                                                    onClick={() => this.handleRemoveMedicine(index)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        className="btn btn-success btn-add-medicine"
                                        onClick={this.handleAddMedicine}
                                    >
                                        + Thêm Thuốc
                                    </button>

                                    {/* Ngày tái khám */}
                                    <div className="info-row">
                                        <span className="label">Tái Khám (Ngày/Tháng/Năm):</span>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={this.state.revisitDate}
                                            onChange={(e) => this.setState({ revisitDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="info-row">
                                        <span className="label">Ghi chú:</span>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={note}
                                            onChange={(e) => this.setState({ note: e.target.value })}
                                            placeholder="Ghi chú thêm về tình trạng sức khỏe hoặc chỉ dẫn..."
                                        />
                                    </div>

                                    {/* File upload */}
                                    <div className="info-row file-upload">
                                        <span className="label">Chọn File:</span>
                                        <input
                                            className="file-input"
                                            type="file"
                                            onChange={this.handleOnChangeImage}
                                        />
                                    </div>

                                    {/* Hình ảnh preview */}
                                    {imagePreviewUrl && (
                                        <div className="image-preview">
                                            <img src={imagePreviewUrl} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="no-data-message">Không có dữ liệu để hiển thị.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => this.handleSendRemedy()}>
                                Gửi
                            </button>
                            <button className="btn btn-secondary" onClick={this.handleToggle}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
