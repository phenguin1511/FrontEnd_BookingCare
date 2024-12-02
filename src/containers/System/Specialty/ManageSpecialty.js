import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils"
import { createNewSpecialty } from '../../../services/userService';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            specialtyName: '',
            imageBase64: '',
            previewImage: '',
            contentHTML: '',
            contentMarkdown: ''
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
        const { specialtyName, imageBase64, contentHTML, contentMarkdown } = this.state;

        if (!specialtyName || !imageBase64 || !contentHTML || !contentMarkdown) {
            alert("Please fill in all fields before saving.");
            return;
        }

        let res = await createNewSpecialty({
            specialtyName,
            imageBase64,
            contentHTML,
            contentMarkdown,
        });

        if (res.data.errCode === 0) {
            alert("Specialty saved successfully!");
            this.setState({
                specialtyName: '',
                imageBase64: '',
                previewImage: '',
                contentHTML: '',
                contentMarkdown: '',
            });
        } else {
            alert(res.data.errMessage || "Error saving specialty.");
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
        const { specialtyName, contentMarkdown, previewImage } = this.state;

        return (
            <Fragment>
                <div className='specialty-manage-container'>
                    <h3 className='specialty-manage-title'>Thêm Chi Tiết Chuyên Khoa</h3>
                    <div className='btn-add-new-specialty'>
                        <button className='btn btn-add'>Add New</button>
                    </div>
                    <div className='specialty-manage-content'>
                        <div className='specialty-input'>
                            <div className='specialty-input-name'>
                                <label htmlFor='specialty-name'>Tên Chuyên Khoa</label>
                                <input
                                    id='specialty-name'
                                    name='specialtyName'
                                    value={specialtyName}
                                    onChange={this.handleInputChange}
                                    type='text'
                                    placeholder='Nhập tên chuyên khoa'
                                />
                            </div>
                            <div className='specialty-input-image'>
                                <label htmlFor='specialty-image'>Ảnh Chuyên Khoa</label>
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
                        </div>
                        <div className='specialty-markdown'>
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={contentMarkdown}
                            />
                        </div>
                        <div className='btn-save-specialty'>
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

export default connect(mapStateToProps)(ManageSpecialty);
