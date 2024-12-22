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
            list_specialty: [],
            list_clinic: [],
            hasOldData: false,

            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            selectedPayment: '',
            selectedProvince: '',
            selectedPrice: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',

        }
    }


    async componentDidMount() {

        await this.props.fetchAllDoctor()
        await this.props.getRequireDoctorInfo()
        await this.props.fetchAllSpecialty()
        await this.props.fetchAllClinic()

    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let object = this.builDataSelect(this.props.allDoctors, "USERS");
            this.setState({
                list_doctors: object
            });
        }

        if (prevProps.language !== this.props.language) {
            let { paymentData, priceData, provinceData } = this.props.requireInforDoctor;
            let object = this.builDataSelect(this.props.allDoctors, "USERS");
            let dataPayment = this.builDataSelect(paymentData, "PAYMENT");
            let dataPrice = this.builDataSelect(priceData, "PRICE");
            let dataProvince = this.builDataSelect(provinceData, "PROVINCE");
            this.setState({
                list_doctors: object,
                listPayment: dataPayment,
                listPrice: dataPrice,
                listProvince: dataProvince
            });
        }

        if (prevProps.requireInforDoctor !== this.props.requireInforDoctor) {
            let { paymentData, priceData, provinceData } = this.props.requireInforDoctor;

            let dataPayment = this.builDataSelect(paymentData, "PAYMENT");
            let dataPrice = this.builDataSelect(priceData, "PRICE");
            let dataProvince = this.builDataSelect(provinceData, "PROVINCE");

            this.setState({
                listPayment: dataPayment,
                listPrice: dataPrice,
                listProvince: dataProvince
            });
        }
        if (prevProps.dataSpecialties !== this.props.dataSpecialties) {
            let dataSpecialty = this.builDataSelect(this.props.dataSpecialties, "SPECIALTY");
            this.setState({
                list_specialty: dataSpecialty
            })
        }
        if (prevProps.dataClinic !== this.props.dataClinic) {
            let dataClinic = this.builDataSelect(this.props.dataClinic, "CLINIC");
            this.setState({
                list_clinic: dataClinic
            })
        }
    }

    builDataSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item) => {
                let object = {};

                switch (type) {
                    case 'USERS':
                        let labelVn = `${item.firstName} ${item.lastName}`;
                        let labelEn = `${item.lastName} ${item.firstName}`;
                        object.label = language === LANGUAGES.VI ? labelVn : labelEn;
                        object.value = item.id;
                        break;
                    case 'PAYMENT':
                        object.label = language === LANGUAGES.VI ? item.valueVn : item.valueEn;
                        object.value = item.keyMap;
                        break;
                    case 'PRICE':
                        let priceValue = language === LANGUAGES.VI ? item.valueVn : item.valueEn;
                        let formattedPrice = new Intl.NumberFormat(language === LANGUAGES.VI ? 'vi-VN' : 'en-US').format(priceValue);
                        object.label = `${formattedPrice} ${language === LANGUAGES.VI ? 'VNĐ' : 'USD'}`;
                        object.value = item.keyMap;
                        break;
                    case 'PROVINCE':
                        object.label = language === LANGUAGES.VI ? item.valueVn : item.valueEn;
                        object.value = item.keyMap;
                        break;
                    case 'SPECIALTY':
                        object.label = item.name ? item.name : "Không Có Dữ Liệu";
                        object.value = item.id;
                        break;
                    case 'CLINIC':
                        object.label = item.name ? item.name : "Không Có Dữ Liệu";
                        object.value = item.id;
                        break;
                    default:
                        break;
                }
                result.push(object);
            });
        }
        return result;
    };


    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        });
    };


    handleChangeDescription = (event, name) => {
        let stateCopy = { ...this.state };
        stateCopy[name] = event.target.value;
        this.setState({
            ...stateCopy
        });
        console.log(this.state.description)
    };

    handleChangeDoctor = async (selectedDoctor) => {
        this.setState({
            selectedDoctor
        });

        let res = await getInfoDetailDoctor(selectedDoctor.value);
        if (res && res.data.errCode === 0 && res.data.data) {
            let { Markdown, Doctor_Infor } = res.data.data;

            // Set Markdown content
            if (Markdown) {
                this.setState({
                    contentHTML: Markdown.contentHTML,
                    contentMarkdown: Markdown.contentMarkdown,
                    description: Markdown.description,
                    hasOldData: true
                });
            } else {
                this.setState({
                    contentHTML: '',
                    contentMarkdown: '',
                    description: '',
                    hasOldData: false
                });
            }

            // Set Doctor Info
            if (Doctor_Infor) {
                this.setState({
                    selectedPayment: this.state.listPayment.find(option => option.value === Doctor_Infor.paymentId),
                    selectedProvince: this.state.listProvince.find(option => option.value === Doctor_Infor.provinceId),
                    selectedPrice: this.state.listPrice.find(option => option.value === Doctor_Infor.priceId) || null,
                    addressClinic: Doctor_Infor.adressClinic || '',
                    nameClinic: Doctor_Infor.nameClinic || '',
                    note: Doctor_Infor.note || '',
                    hasOldData: true,
                    selectedSpecialty: this.state.list_specialty.find(option => option.value === Doctor_Infor.specialtyId) || null,
                    selectedClinic: this.state.list_clinic.find(option => option.value === Doctor_Infor.clinicId) || null
                });
            } else {
                this.setState({
                    selectedPayment: null,
                    selectedProvince: null,
                    selectedPrice: null,
                    addressClinic: '',
                    nameClinic: '',
                    note: '',
                    hasOldData: false,
                    selectedSpecialty: null,
                    selectedClinic: null
                });
            }
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                selectedPayment: null,
                selectedProvince: null,
                selectedPrice: null,
                addressClinic: '',
                nameClinic: '',
                note: '',
                hasOldData: false,
                selectedSpecialty: null,
                selectedClinic: null
            });
        }
    };

    handleChangeDoctorInfoRequired = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }
    validateInput = () => {
        const {
            selectedDoctor,
            contentMarkdown,
            contentHTML,
            description,
            selectedPayment,
            selectedProvince,
            selectedPrice,
            nameClinic,
            addressClinic,
        } = this.state;

        let errors = {};

        if (!selectedDoctor) errors.selectedDoctor = "Vui lòng chọn bác sĩ.";
        if (!contentMarkdown) errors.contentMarkdown = "Nội dung markdown không được để trống.";
        if (!contentHTML) errors.contentHTML = "Nội dung HTML không được để trống.";
        if (!description) errors.description = "Vui lòng nhập mô tả chi tiết.";
        if (!selectedPayment) errors.selectedPayment = "Vui lòng chọn hình thức thanh toán.";
        if (!selectedProvince) errors.selectedProvince = "Vui lòng chọn tỉnh/thành phố.";
        if (!selectedPrice) errors.selectedPrice = "Vui lòng chọn giá khám.";
        if (!nameClinic) errors.nameClinic = "Vui lòng nhập tên cơ sở y tế.";
        if (!addressClinic) errors.addressClinic = "Vui lòng nhập địa chỉ cơ sở y tế.";

        this.setState({ errors });

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };

    handleSaveContent = async () => {
        if (!this.validateInput()) {
            alert("Vui lòng kiểm tra lại thông tin.");
            return;
        }

        let { hasOldData } = this.state;

        await this.props.saveInfoDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            selectedPayment: this.state.selectedPayment ? this.state.selectedPayment.value : null,
            selectedProvince: this.state.selectedProvince ? this.state.selectedProvince.value : null,
            selectedPrice: this.state.selectedPrice ? this.state.selectedPrice.value : null,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            selectedSpecialty: this.state.selectedSpecialty ? this.state.selectedSpecialty.value : null,
            selectedClinic: this.state.selectedClinic ? this.state.selectedClinic.value : null,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE
        });

        alert("Lưu thông tin thành công!");

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
        console.log(this.state)
        console.log(this.props.dataClinic)
        return (

            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>Tạo Chi Tiết Thông Tin Bác Sĩ</div>
                <div className='more-infor'>
                    <div className='content-left'>
                        <label>Chọn Bác Sĩ</label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeDoctor}
                            options={this.state.list_doctors}
                            className="select-doctor"
                            placeholder="Chọn Bác Sĩ..."
                        />
                    </div>
                    <div className='content-right'>
                        <label>Mô Tả Chi Tiết</label>
                        <textarea
                            className='description-doctor'
                            placeholder="Nhập mô tả chi tiết..."
                            value={this.state.description}
                            onChange={(event) => this.handleChangeDescription(event, 'description')}
                        ></textarea>
                    </div>
                </div>
                <div className='doctor_info_extra'>
                    <div className='select-price'>
                        <label>Chọn Chuyên Khoa</label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeDoctorInfoRequired}
                            options={this.state.list_specialty}
                            className="select-doctor"
                            placeholder="Chọn Chuyên Khoa..."
                            name="selectedSpecialty"
                        />

                    </div>
                    <div className='select-price'>
                        <label>Chọn Cơ Sở Y Tế</label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeDoctorInfoRequired}
                            options={this.state.list_clinic}
                            className="select-doctor"
                            placeholder="Chọn Cơ Sở Y Tế..."
                            name="selectedClinic"
                        />

                    </div>
                    <div className='select-price'>
                        <label>Tên Cơ Sở Y Tế Tư Nhân</label>
                        <input></input>
                    </div>
                    <div className='select-price'>
                        <label>Chọn Giá Khám</label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeDoctorInfoRequired}
                            options={this.state.listPrice}
                            placeholder="Chọn Giá Khám..."
                            name="selectedPrice"
                        />
                    </div>
                    <div className='select-payment'>
                        <label>Chọn Phương Thức Thanh Toán</label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeDoctorInfoRequired}
                            options={this.state.listPayment}
                            placeholder="Chọn Phương Thức..."
                            name="selectedPayment"
                        />
                    </div>
                    <div className='select-province'>
                        <label>Chọn Tỉnh Thành</label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeDoctorInfoRequired}
                            options={this.state.listProvince}
                            placeholder="Chọn Tỉnh Thành..."
                            name="selectedProvince"
                        />
                    </div>
                    <div className='select-name-clinic'>
                        <label>Tên Phòng Khám</label>
                        <input
                            className='description-doctor'
                            placeholder="Nhập mô tả chi tiết..."
                            value={this.state.nameClinic}
                            type='text'
                            onChange={(event) => this.handleChangeDescription(event, 'nameClinic')}
                        ></input>
                    </div>
                    <div className='select-address-clinic'>
                        <label>Địa Chỉ Phòng Khám</label>
                        <input
                            className='description-doctor'
                            placeholder="Nhập mô tả chi tiết..."
                            value={this.state.addressClinic}
                            type='text'
                            onChange={(event) => this.handleChangeDescription(event, 'addressClinic')}
                        ></input>
                    </div>
                    <div className='select-note'>
                        <label>Note</label>
                        <textarea
                            className='description-doctor'
                            placeholder="Nhập mô tả chi tiết..."
                            value={this.state.note}
                            onChange={(event) => this.handleChangeDescription(event, 'note')}
                        ></textarea>
                    </div>
                </div>
                <div className='manage-doctor-edit'>
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button onClick={() => this.handleSaveContent()} className={hasOldData ? "save-content-doctor" : "create-content-doctor"}>
                    {hasOldData ? "Lưu Thông Tin" : "Tạo Mới"}
                </button>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    users: state.admin.users,
    allDoctors: state.admin.allDoctors,
    requireInforDoctor: state.admin.allRequiredDoctorInfo,
    dataSpecialties: state.admin.dataSpecialties,
    dataClinic: state.admin.dataClinic
});

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(action.fetchAllDoctor()),
        getRequireDoctorInfo: () => dispatch(action.getRequireDoctorInfo()),
        saveInfoDoctor: (data) => dispatch(action.saveInfoDoctor(data)),
        fetchAllSpecialty: () => dispatch(action.fetchAllSpecialty()),
        fetchAllClinic: () => dispatch(action.fetchAllClinic()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
