import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserRedux.scss";
import { LANGUAGES, CRUD_ACTION, CommonUtils } from "../../../utils"
import * as action from "../../../store/actions"
import TableManageUser from './TableManageUser';


class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            email: '',
            password: '',
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
            imagePreviewUrl: '',
            action: '',
            userId: '',
            userToEdit: []
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        if (this.props.userToEdit) {
            this.handleEditUserRedux();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux,
                gender: this.props.genderRedux.length > 0 ? this.props.genderRedux[0].keyMap : '',
            });
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux,
                position: this.props.positionRedux.length > 0 ? this.props.positionRedux[0].keyMap : '',
            });
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: this.props.roleRedux,
                role: this.props.roleRedux.length > 0 ? this.props.roleRedux[0].keyMap : '',
            });
        }

        if (prevProps.users !== this.props.users) {
            this.resetUserForm();
        }

        if (prevProps.userToEdit !== this.props.userToEdit) {
            this.setState({
                userToEdit: this.props.userToEdit
            })
        }
    }

    resetUserForm = () => {
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
            avatar: '',
            imagePreviewUrl: '',
            action: CRUD_ACTION.CREATE,
        });
    };

    handleOnchangeImage = async (event) => {
        const data = event.target.files;
        if (data && data[0]) {
            const file = data[0];
            const base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);

            this.setState({
                avatar: base64,
                imagePreviewUrl: objectUrl,
            });

            // Reset giá trị của input file
            event.target.value = null;
        } else {
            alert("No file selected!");
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
        let { action } = this.state;

        if (action === CRUD_ACTION.CREATE) {
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
                    role: this.state.role,
                    avatar: this.state.avatar,
                });
            } else {
                console.log("Form validation failed");
            }
        }

        if (action === CRUD_ACTION.EDIT) {
            if (this.checkValidateInput()) {
                // Make sure role and position are passed correctly
                this.props.editUserAction({
                    id: this.state.userId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    gender: this.state.gender,
                    position: this.state.position,  // Ensure position is passed here
                    phonenumber: this.state.phonenumber,
                    role: this.state.role,  // Ensure role is passed here
                    avatar: this.state.avatar,
                });
            } else {
                console.log("Form validation failed");
            }
        }
    };

    handleEditUserRedux = () => {
        let user = this.props.userToEdit;
        if (!user) {
            console.log('No user data available');
            return;
        }
        console.log(user); // Xem dữ liệu trong console để kiểm tra

        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            userId: user.id,
            email: user.email,
            password: '1111111111',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            phonenumber: user.phonenumber,
            role: user.roleId,
            avatar: user.avatar,
            imagePreviewUrl: imageBase64,
            action: CRUD_ACTION.EDIT
        });
    };


    render() {
        const { genderArr, positionArr, roleArr } = this.state;
        let language = this.props.lang;
        let isLoadingGender = this.props.isLoadingGender;
        console.log(this.props.userToEdit)
        return (
            <Fragment>
                <div className="user-redux-container">


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
                            <div className='title'>
                                <FormattedMessage id="manage-user.add-user" />
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label><FormattedMessage id="manage-user.email" /></label>
                                    <input
                                        type="email"
                                        name="email"
                                        disabled={this.state.action === CRUD_ACTION.EDIT}
                                        value={this.state.email}
                                        onChange={this.onChangeInput}
                                    />
                                    {this.state.action === CRUD_ACTION.EDIT && (
                                        <div className='spam'
                                            onClick={() => alert('Email cannot be edited.')}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label><FormattedMessage id="manage-user.password" /></label>
                                    <input
                                        type="password"
                                        name="password"
                                        disabled={this.state.action === CRUD_ACTION.EDIT}
                                        value={this.state.password}
                                        onChange={this.onChangeInput}
                                    />
                                    {this.state.action === CRUD_ACTION.EDIT && (
                                        <div className='spam'
                                            onClick={() => alert('Password cannot be edited.')}
                                        />
                                    )}
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
                                                <option key={index} value={item.keyMap}>
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
                                                <option key={index} value={item.keyMap}>
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
                                                <option key={index} value={item.keyMap}>
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

                            <button type="submit" className={this.state.action === CRUD_ACTION.EDIT ? "btn btn-warning" : "btn btn-primary"}>
                                {this.state.action === CRUD_ACTION.EDIT ? <FormattedMessage id="manage-user.edit-user" /> : <FormattedMessage id="manage-user.add-user" />}
                            </button>
                        </form>
                    </div>
                </div>

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
    users: state.admin.users,
    userToEdit: state.user.userToEdit
});

const mapDispatchToProps = dispatch => ({
    getGenderStart: () => dispatch(action.fetchGenderStart()),
    getPositionStart: () => dispatch(action.fetchPositionStart()),
    getRoleStart: () => dispatch(action.fetchRoleStart()),
    creatNewUser: (data) => dispatch(action.createNewUser(data)),
    fetchAllUserRedux: () => dispatch(action.fetchAllUsersStart()),
    editUserAction: (data) => dispatch(action.editUserAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
