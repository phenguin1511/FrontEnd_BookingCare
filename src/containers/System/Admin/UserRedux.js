import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserRedux.scss";
import { LANGUAGES } from "../../../utils"
import * as action from "../../../store/actions"
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],  // Gender array
            email: '',
            password: '',  // Added missing password field
            firstName: '',
            lastName: '',
            gender: '',
            roleArr: [],
            address: '',
            phonenumber: '',
            positionArr: [],
            position: '',
            role: '',
            avatar: '',
            imagePreviewUrl: ''
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.genderRedux !== this.props.genderRedux ||
            prevProps.positionRedux !== this.props.positionRedux ||
            prevProps.roleRedux !== this.props.roleRedux
        ) {
            this.setState({
                genderArr: this.props.genderRedux,
                positionArr: this.props.positionRedux,
                roleArr: this.props.roleRedux,
                gender: this.props.genderRedux.length > 0 ? this.props.genderRedux[0].key : '',
                position: this.props.positionRedux.length > 0 ? this.props.positionRedux[0].key : '',
                role: this.props.roleRedux.length > 0 ? this.props.roleRedux[0].key : '',
            });
        }
        if (prevProps.users !== this.props.users) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                gender: '',
                position: '',
                phonenumber: '',
                role: '',
                genderArr: [0],
                roleArr: [0],
                positionArr: [0]
            })
        }
    }

    handleOnchangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                imagePreviewUrl: objectUrl,
                avatar: file
            })
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        const arrInput = ['email', 'password', 'firstName', 'lastName', 'address', 'phonenumber'];

        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert(`Missing Parameter: ${arrInput[i]}`);
                break;
            }
        }

        return isValid;
    }

    onChangeInput = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        }, () => {
            console.log(this.state)
        });
    };

    handleSaveUser = (event) => {
        event.preventDefault();  // Prevent form submission

        if (this.checkValidateInput()) {
            this.props.creatNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                gender: this.state.gender,
                position: this.state.position,
                phonenumber: this.state.phonenumber,
                role: this.state.role
            });
        } else {
            console.log("Form validation failed");
        }
    };

    render() {
        const { genderArr, positionArr, roleArr } = this.state;
        let language = this.props.lang;
        let isLoadingGender = this.props.isLoadingGender;

        return (
            <Fragment>
                <div className="user-redux-container">
                    <div className='title'>
                        <FormattedMessage id="manage-user.add-user" />
                    </div>

                    <div className='user-redux-body'>
                        <div className='loading'>
                            {isLoadingGender ? (
                                <>
                                    <span>Loading Gender:</span>
                                    <div className="loading-spinner"></div>
                                </>
                            ) : ''}
                        </div>
                        <form onSubmit={this.handleSaveUser}>
                            <div className='form-row'>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.email" /></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.password" /></label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.first-name" /></label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={this.state.firstName}
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.last-name" /></label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={this.state.lastName}
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.gender" /></label>
                                    <select
                                        name='gender'
                                        value={this.state.gender}
                                        onChange={this.onChangeInput}
                                    >
                                        {genderArr && genderArr.length > 0 &&
                                            genderArr.map((item, index) => (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVn : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.role" /></label>
                                    <select
                                        name='role'
                                        value={this.state.role}
                                        onChange={this.onChangeInput}
                                    >
                                        {roleArr && roleArr.length > 0 &&
                                            roleArr.map((item, index) => (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVn : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className='form-group'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.onChangeInput}
                                />
                            </div>

                            <div className='form-row'>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.phone-number" /></label>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        value={this.state.phonenumber}
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label><FormattedMessage id="manage-user.position" /></label>
                                    <select
                                        name="position"
                                        value={this.state.position}
                                        onChange={this.onChangeInput}
                                    >
                                        {positionArr && positionArr.length > 0 &&
                                            positionArr.map((item, index) => (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVn : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className='form-group'>
                                <div>
                                    <input
                                        id='preview-image'
                                        type="file"
                                        name="avatar"
                                        hidden
                                        onChange={this.handleOnchangeImage}
                                    />
                                    <label htmlFor='preview-image' className="upload-label">
                                        Tải Ảnh <i className="fa-solid fa-upload"></i>
                                    </label>
                                    <div
                                        className='preview-image'
                                        style={{
                                            backgroundImage: `url(${this.state.imagePreviewUrl})`
                                        }}
                                    >
                                        {!this.state.imagePreviewUrl && <span>No Image Selected</span>}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-submit">
                                <FormattedMessage id="manage-user.add-user" />
                            </button>
                        </form>
                    </div>
                </div>
                <TableManageUser />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.position,
    roleRedux: state.admin.roles,
    isLoadingGender: state.admin.isLoadingGender,
    users: state.admin.users
});

const mapDispatchToProps = dispatch => ({
    getGenderStart: () => dispatch(action.fetchGenderStart()),
    getPositionStart: () => dispatch(action.fetchPositionStart()),
    getRoleStart: () => dispatch(action.fetchRoleStart()),
    creatNewUser: (data) => dispatch(action.createNewUser(data)),
    fetchAllUserRedux: () => dispatch(action.fetchAllUsersStart())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
