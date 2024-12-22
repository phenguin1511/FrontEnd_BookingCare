import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer, Bounce } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomScrollbars from '../components/CustomScrollbars.js';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import Unauthorized from '../routes/Unauthorized.js'
import { path } from '../utils'
import * as actions from "../store/actions";
import Home from '../routes/Home';
import Login from './Auth/Login';
import System from '../routes/System';
import HomePage from './HomePage/HomePage.js'
import ConfirmModal from '../components/ConfirmModal';
import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import Doctor from '../routes/Doctor.js';
import VerifyEmail from './Patient/VerifyEmail/VerifyEmail.js';
import SpecialtyDetail from './Patient/Specialty/SpecialtyDetail.js';
import ClinicDetail from './Patient/Clinic/ClinicDetail.js';
import Register from './Auth/Register.js';
import ForgotPassword from './Auth/ForgotPassword.js';
import ChangePassword from './Auth/ChangePassword.js';
import DetailHandBook from './Patient/HandBook/DetailHandBook.js'
import HistoryBooking from './Patient/History/HistoryBooking.js';
import ListClinic from './Patient/Clinic/ListClinic.js';
import ListDoctor from './Patient/Doctor/ListDoctor.js';
import ListSpecialty from './Patient/Specialty/ListSpecialty.js';
import { toast } from 'react-toastify';
class App extends Component {


    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        const persistedData = localStorage.getItem('persist:user');

        if (persistedData) {
            const userInfo = JSON.parse(JSON.parse(persistedData).userInfo);
            const userRole = userInfo?.roleId;

            if (userRole === 'R1' || userRole === 'R2') {
                if (!token) {
                    toast.error("Phiên làm việc đã hết hạn hoặc token bị xóa. Vui lòng đăng nhập lại.");
                    this.props.processLogout();
                    history.push('/login');
                } else {
                    this.handlePersistorState();
                }
            } else {
                this.handlePersistorState();
            }
        } else {
            toast.error("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
            this.props.processLogout();
            history.push('/login');
        }
    }
    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', witdth: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.REGISTER} component={userIsNotAuthenticated(Register)} />
                                    <Route path={path.CHANGEPASSWORD} component={userIsNotAuthenticated(ChangePassword)} />
                                    <Route path={path.FORGOTPASSWORD} component={(ForgotPassword)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={'/doctor/'} component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.HOMEPAGE} component={(HomePage)} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.LIST_DOCTOR} component={ListDoctor} />
                                    <Route path={path.DETAIL_SPECIALTY} component={SpecialtyDetail} />
                                    <Route path={path.LIST_SPECIALTY} component={ListSpecialty} />
                                    <Route path={path.DETAIL_CLINIC} component={ClinicDetail} />
                                    <Route path={path.LIST_CLINIC} component={ListClinic} />
                                    <Route path={path.DETAIL_HANDBOOK} component={DetailHandBook} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                    <Route path={path.VIEW_HISTORY_BOOKING} component={HistoryBooking} />
                                    <Route path="/unauthorized" component={Unauthorized} />

                                </Switch>
                            </CustomScrollbars>
                        </div>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                            transition={Bounce}
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);