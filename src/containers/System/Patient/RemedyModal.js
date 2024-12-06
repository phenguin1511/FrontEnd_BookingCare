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
            imagePreviewUrl: '' // URL để hiển thị ảnh preview
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
        const { email, imgBase64 } = this.state;
        if (this.props.sendRemedy) {
            this.props.sendRemedy({ email, imgBase64 });
        }
        this.setState({
            email: '',
            imgBase64: '',
            imagePreviewUrl: ''
        });

        this.handleToggle()
    };

    render() {
        const { isOpenRemedyModal, dataModal } = this.props;
        const { email, imagePreviewUrl } = this.state;

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
                                    <div className="info-row">
                                        <span className="label">Email Bệnh Nhân:</span>
                                        <span className="value">{email}</span>
                                    </div>

                                    <div className="info-row file-upload">
                                        <span className="label">Chọn File:</span>
                                        <input
                                            className="file-input"
                                            type="file"
                                            onChange={this.handleOnChangeImage}
                                        />
                                    </div>

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
