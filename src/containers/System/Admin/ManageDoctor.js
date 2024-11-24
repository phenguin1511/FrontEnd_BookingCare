import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./ManageDoctor.scss";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import * as action from "../../../store/actions";
import { CRUD_ACTION, LANGUAGES } from '../../../utils';
import { getInfoDetailDoctor } from '../../../services/userService';
import { LiaThListSolid } from 'react-icons/lia';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            list_doctors: [],
            hasOldData: false

        }
    }


    async componentDidMount() {

        await this.props.fetchAllDoctor()

    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let object = this.builDataSelect(this.props.allDoctors)
            this.setState({
                list_doctors: object
            })
        }
        if (prevProps.language !== this.props.language) {
            let object = this.builDataSelect(this.props.allDoctors)
            this.setState({
                list_doctors: object
            })
        }
    }
    builDataSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVn = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGES.VI ? labelVn : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        });
    };


    handleChangeDescription = (event) => {
        this.setState({
            description: event.target.value,
        });
        console.log(this.state.description)
    };

    handleChange = async (selectedDoctor) => {
        this.setState({
            selectedDoctor
        })
        let res = await getInfoDetailDoctor(selectedDoctor.value);
        console.log(res)
        if (res && res.data.errCode === 0 && res.data.data && res.data.data.Markdown) {
            let markdown = res.data.data.Markdown;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            })
        }
    }

    handleSaveContent = async () => {
        let { hasOldData } = this.state;

        await this.props.saveInfoDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE
        });
        await this.props.fetchAllDoctor();
        let updatedDoctor = this.state.list_doctors.find(
            doctor => doctor.value === this.state.selectedDoctor.value
        );
        this.setState({
            selectedDoctor: updatedDoctor,
        });
    };

    render() {
        const { hasOldData } = this.state
        return (

            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>Tạo Chi Tiết Thông Tin Bác Sĩ</div>
                <div className='more-infor'>
                    <div className='content-left'>
                        <label>Thông Tin Giới Thiệu</label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.list_doctors}
                            className="select-doctor"
                            placeholder="Chọn Bác Sĩ..."
                        />
                    </div>

                    <div className='content-right'>
                        <textarea
                            className='description-doctor'
                            placeholder="Nhập mô tả chi tiết..."
                            value={this.state.description}
                            onChange={this.handleChangeDescription}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='manage-doctor-edit'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button onClick={() => this.handleSaveContent()} className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}> {hasOldData === true ? <span>Lưu Thông Tin</span> : <span>Tạo Mới</span>}</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    users: state.admin.users,
    allDoctors: state.admin.allDoctors // Map users from Redux state
});

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(action.fetchAllDoctor()),
        saveInfoDoctor: (data) => dispatch(action.saveInfoDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
