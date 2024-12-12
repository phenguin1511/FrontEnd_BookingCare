import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { CommonUtils } from "../../../utils"
import { createNewHandBook } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './ManageHandBook.scss'

const mdParser = new MarkdownIt();

class ManageHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            child_title: '',
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
        const { title, child_title, imageBase64, contentHTML, contentMarkdown } = this.state;

        if (!title || !child_title || !imageBase64 || !contentHTML || !contentMarkdown) {
            alert("Please fill in all fields before saving.");
            return;
        }

        let res = await createNewHandBook({
            titleHandBook: title,
            child_title,
            imageBase64,
            contentHTML,
            contentMarkdown,
        });

        if (res.data.errCode === 0) {
            alert("Handbook saved successfully!");
            this.setState({
                title: '',
                child_title: '',
                imageBase64: '',
                previewImage: '',
                contentHTML: '',
                contentMarkdown: '',
            });
        } else {
            alert(res.data.errMessage || "Error saving handbook.");
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
        const { title, child_title, contentMarkdown, address } = this.state;
        // console.log(this.state)
        return (
            <Fragment>
                <div className='clinic-manage-container'>
                    <h3 className='clinic-manage-title'>Thêm Chi Tiết Sổ Tay</h3>
                    <div className='clinic-manage-content'>
                        <div className='clinic-input'>
                            <div className='clinic-input-name'>
                                <label htmlFor='clinic-name'>Tên Tiêu Đề</label>
                                <input
                                    id='clinic-name'
                                    name='title'
                                    value={title} // Bind state
                                    onChange={this.handleInputChange}
                                    type='text'
                                    placeholder='Nhập tên tiêu đề'
                                />
                            </div>
                            <div className='clinic-input-name'>
                                <label htmlFor='clinic-name'>Tên Tiêu Đề Con</label>
                                <input
                                    id='clinic-name'
                                    name='child_title'
                                    value={child_title}
                                    onChange={this.handleInputChange}
                                    type='text'
                                    placeholder='Nhập tên tiêu đề con'
                                />
                            </div>
                            <div className='clinic-input-image'>
                                <label htmlFor='clinic-image'>Ảnh Sổ Tay</label>
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
                            <div className='clinic-markdown'>
                                <MdEditor
                                    style={{ height: '300px' }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                    value={contentMarkdown}
                                />
                            </div>
                        </div>

                        <div className='clinic-markdown'>
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

export default connect(mapStateToProps)(ManageHandBook);
