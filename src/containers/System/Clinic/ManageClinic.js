import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils"
import { createNewClinic } from '../../../services/userService';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clinicName: '',
            imageBase64: '',
            previewImage: '',
            contentHTML: '',
            contentMarkdown: '',
            address: ''
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text

        });
    };

    handleSave = async () => {
        const { clinicName, imageBase64, contentHTML, contentMarkdown, address } = this.state;

        if (!clinicName || !imageBase64 || !contentHTML || !contentMarkdown || !address) {
            alert("Please fill in all fields before saving.");
            return;
        }

        let res = await createNewClinic({
            clinicName,
            imageBase64,
            contentHTML,
            contentMarkdown,
            address
        });

        if (res.data.errCode === 0) {
            alert("Clinic saved successfully!");
            this.setState({
                clinicName: '',
                imageBase64: '',
                previewImage: '',
                contentHTML: '',
                contentMarkdown: '',
            });
        } else {
            alert(res.data.errMessage || "Error saving clinic.");
        }
    };

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        if (data && data[0]) {
            let file = data[0];
            let base64 = await CommonUtils.getBase64(file);
            let previewImage = URL.createObjectURL(file);
            this.setState({
                imageBase64: base64,
                previewImage: previewImage,
            });
            event.target.value = null;
        } else {
            alert("No file selected!");
        }
    };

    render() {
        const { clinicName, contentMarkdown, address } = this.state;
        console.log(this.state)
        return (
            <Fragment>
                <div className='clinic-manage-container'>
                    <h3 className='clinic-manage-title'>Thêm Chi Tiết Cơ Sở Y Tế</h3>
                    <div className='btn-add-new-clinic'>
                        <button className='btn btn-add'>Add New</button>
                    </div>
                    <div className='clinic-manage-content'>
                        <div className='clinic-input'>
                            <div className='clinic-input-name'>
                                <label htmlFor='clinic-name'>Tên Cơ Sở Y Tế</label>
                                <input
                                    id='clinic-name'
                                    name='clinicName'
                                    value={clinicName}
                                    onChange={this.handleInputChange}
                                    type='text'
                                    placeholder='Nhập tên Cơ Sở Y Tế'
                                />
                            </div>
                            <div className='clinic-input-image'>
                                <label htmlFor='clinic-image'>Ảnh Cơ Sở Y Tế</label>
                                <input
                                    type='file'
                                    onChange={(event) => this.handleOnchangeImage(event)}
                                />
                                {this.state.imageBase64 && (
                                    <div className="previewImg-container">
                                        <img
                                            className="previewImg"
                                            src={this.state.imageBase64}
                                            alt="Preview"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='clinic-input-address'>
                                <label htmlFor='clinic-address'>Địa Chỉ Cơ Sở Y Tế</label>
                                <input
                                    id='clinic-address'
                                    name='address'
                                    value={address}
                                    onChange={this.handleInputChange}
                                    type='text'
                                    placeholder='Nhập địa chỉ Cơ Sở Y Tế'
                                />
                            </div>
                        </div>

                        <div className='clinic-markdown'>
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={contentMarkdown}
                            />
                        </div>
                        <div className='btn-save-clinic'>
                            <button className='btn btn-save' onClick={this.handleSave}>SAVE</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(ManageClinic);
