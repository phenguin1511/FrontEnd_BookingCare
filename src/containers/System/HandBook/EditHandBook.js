import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import * as action from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils"
import { getInfoHandBookById, updateHandBook } from '../../../services/userService';
import Select from 'react-select'

const mdParser = new MarkdownIt();

class EditHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedHandBook: '',
            imageBase64: '',
            previewImage: '',
            contentHTML: '',
            contentMarkdown: '',
            title: '',
            child_title: '',
            list_handbook: [],

        };
    }

    async componentDidMount() {
        await this.props.fetchAllHandBook();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataHandBook !== prevProps.dataHandBook) {
            let dataHandBook = this.builDataSelect(this.props.dataHandBook);
            this.setState({
                list_handbook: dataHandBook
            });
        }
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
        const { selectedHandBook, title, child_title, imageBase64, contentHTML, contentMarkdown } = this.state;

        if (!selectedHandBook || !imageBase64 || !contentHTML || !contentMarkdown || !title || !child_title) {
            alert("Vui lòng điền đầy đủ thông tin trước khi lưu.");
            return;
        }

        let handbookId = selectedHandBook.value;
        let res = await updateHandBook({
            id: handbookId,
            image: imageBase64,
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            title: title,
            child_title: child_title
        });
        console.log(res)
        if (res && res.data.errCode === 0) {
            console.log(res)
            alert("Cập nhật thông tin cẩm nang thành công!");
            this.setState({
                selectedHandBook: '',
                imageBase64: '',
                previewImage: '',
                contentHTML: '',
                contentMarkdown: '',
                title: '',
                child_title: ''
            });
        } else {
            alert(res.errMessage || "Đã xảy ra lỗi khi lưu thông tin.");
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

    builDataSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item) => {
                let object = {};
                let label = `${item.title} `;

                object.label = label ? label : 'Không có thông tin'
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };
    handleChangeHandBook = async (selectedHandBook) => {
        this.setState({
            selectedHandBook
        });
        let res = await getInfoHandBookById(selectedHandBook.value);
        console.log(res)
        if (res && res.data.errCode === 0) {
            let data = res.data.data
            this.setState({
                imageBase64: data.image,
                contentHTML: data.descriptionHTML,
                contentMarkdown: data.descriptionMarkdown,
                title: data.title,
                child_title: data.child_title
            })
        } else {
            this.setState({
                imageBase64: '',
                contentHTML: 'Không có dữ liệu',
                contentMarkdown: 'Không có dữ liệu',
                title: 'Không có dữ liệu',
                child_title: 'Không có dữ liệu'
            })
        }
    }
    render() {
        const { specialtyName, contentMarkdown, previewImage } = this.state;
        console.log(this.state)
        return (
            <Fragment>
                <div className='specialty-manage-container'>
                    <h3 className='specialty-manage-title'>Sửa Thông Tin Cơ Sở Y Tế</h3>
                    <div className='specialty-manage-content'>
                        <div className='specialty-input'>
                            <div className='specialty-input-name'>
                                <label htmlFor='specialty-name'>Tên Cẩm Nang</label>
                                <Select
                                    value={this.state.selectedHandBook}
                                    onChange={this.handleChangeHandBook}
                                    options={this.state.list_handbook}
                                    placeholder="Chọn Cơ Sở Y Tế..."
                                    name="selectedHandBook"
                                />
                            </div>
                            <div className='specialty-input-name'>
                                <label htmlFor='specialty-name'>Tiêu đề</label>
                                <input
                                    value={this.state.title}
                                    onChange={this.handleInputChange}
                                    placeholder="Nhập vào tiêu đề..."
                                    name="title"
                                >
                                </input>
                            </div>
                            <div className='specialty-input-name'>
                                <label htmlFor='specialty-name'>Tiêu đề phụ</label>
                                <input
                                    value={this.state.child_title}
                                    onChange={this.handleInputChange}
                                    placeholder="Nhập vào tiêu đề phụ..."
                                    name="child_title"
                                >
                                </input>
                            </div>
                            <div className='specialty-input-image'>
                                <label htmlFor='specialty-image'>Ảnh Cơ Sở Y Tế</label>
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
        dataHandBook: state.admin.dataHandBook
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandBook: () => dispatch(action.fetchAllHandBook()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditHandBook);
