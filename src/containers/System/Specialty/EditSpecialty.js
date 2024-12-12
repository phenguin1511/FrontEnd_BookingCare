import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './EditSpecialty.scss';
import * as action from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils"
import { getInfoSpecialtyById, updateSpecialty } from '../../../services/userService';
import Select from 'react-select'

const mdParser = new MarkdownIt(/* Markdown-it options */);

class EditSpeciaty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: '',
            imageBase64: '',
            previewImage: '',
            contentHTML: '',
            contentMarkdown: '',
            list_specialty: [],

        };
    }
    async componentDidMount() {
        await this.props.fetchAllSpecialty();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataSpecialties !== prevProps.dataSpecialties) {
            let dataSpecialty = this.builDataSelect(this.props.dataSpecialties);
            this.setState({
                list_specialty: dataSpecialty
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
        const { selectedDoctor, imageBase64, contentHTML, contentMarkdown } = this.state;

        if (!selectedDoctor || !imageBase64 || !contentHTML || !contentMarkdown) {
            alert("Vui lòng điền đầy đủ thông tin trước khi lưu.");
            return;
        }

        let specialtyId = selectedDoctor.value;
        let res = await updateSpecialty({
            id: specialtyId,
            image: imageBase64,
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
        });
        console.log(res)
        if (res && res.data.errCode === 0) {
            console.log(res)
            alert("Cập nhật thông tin chuyên khoa thành công!");
            this.setState({
                selectedDoctor: '',
                imageBase64: '',
                previewImage: '',
                contentHTML: '',
                contentMarkdown: '',
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
                let label = `${item.name} `;

                object.label = label ? label : 'Không có thông tin'
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };
    handleChangeDoctor = async (selectedDoctor) => {
        this.setState({
            selectedDoctor
        });
        let res = await getInfoSpecialtyById(selectedDoctor.value);
        if (res && res.data.errCode === 0) {
            let data = res.data.data
            this.setState({
                imageBase64: data.image,
                contentHTML: data.descriptionHTML,
                contentMarkdown: data.descriptionMarkdown
            })
        } else {
            this.setState({
                imageBase64: '',
                contentHTML: 'Không có dữ liệu',
                contentMarkdown: 'Không có dữ liệu'
            })
        }
    }
    render() {
        const { specialtyName, contentMarkdown, previewImage } = this.state;
        console.log(this.state)
        return (
            <Fragment>
                <div className='specialty-manage-container'>
                    <h3 className='specialty-manage-title'>Sửa Thông Tin Chuyên Khoa</h3>
                    <div className='specialty-manage-content'>
                        <div className='specialty-input'>
                            <div className='specialty-input-name'>
                                <label htmlFor='specialty-name'>Tên Chuyên Khoa</label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeDoctor}
                                    options={this.state.list_specialty}
                                    placeholder="Chọn Chuyên Khoa..."
                                    name="selectedDoctor"
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
        dataSpecialties: state.admin.dataSpecialties
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(action.fetchAllSpecialty()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditSpeciaty);
