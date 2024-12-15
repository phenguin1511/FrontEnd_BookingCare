import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListDoctor.scss';
import * as action from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
            language: '',
            searchValue: '',
            filterPosition: 'all', // Lọc theo vị trí công việc
            filterGender: 'all',   // Lọc theo giới tính
            filterAddress: '',     // Lọc theo địa chỉ
        };

    }

    componentDidMount() {
        this.props.loadTopDoctors(50); // Load danh sách top 50 bác sĩ từ Redux
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.doctors !== this.props.doctors ||
            prevProps.language !== this.props.language
        ) {
            this.setState({
                doctors: this.props.doctors,
                language: this.props.language,
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    };

    handleFilterChange = (event) => {
        this.setState({ filterPosition: event.target.value });
    };

    handleGenderFilterChange = (event) => {
        this.setState({ filterGender: event.target.value });
    };

    handleAddressFilterChange = (event) => {
        this.setState({ filterAddress: event.target.value });
    };
    handleSearchChange = (event) => {
        this.setState({ searchValue: event.target.value });
    };
    render() {
        const { doctors, searchValue, filterPosition, language, filterAddress, filterGender } = this.state;
        console.log(this.props.doctors)
        // Tìm kiếm và lọc
        // Tìm kiếm và lọc
        const filteredDoctors = doctors.filter((doctor) => {
            const doctorName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
            const searchMatch = doctorName.includes(searchValue.toLowerCase());

            // Lọc theo vị trí công việc
            const filterPositionMatch =
                filterPosition === 'all' || doctor.positionId === filterPosition;

            // Lọc theo giới tính
            const filterGenderMatch =
                filterGender === 'all' || doctor.gender === filterGender;

            // Lọc theo địa chỉ
            const filterAddressMatch =
                filterAddress.trim() === '' ||
                doctor.address.toLowerCase().includes(filterAddress.toLowerCase());

            return searchMatch && filterPositionMatch && filterGenderMatch && filterAddressMatch;
        });


        return (
            <React.Fragment>
                <HomeHeader />
                <div className='section-ListDoctor'>
                    <div className='search-and-filter'>
                        <input
                            type='text'
                            placeholder='Tìm kiếm bác sĩ...'
                            value={searchValue}
                            onChange={this.handleSearchChange}
                        />
                        <select value={filterPosition} onChange={this.handleFilterChange}>
                            <option value='all'>Tất cả vị trí</option>
                            <option value='P1'>Bác sĩ</option>
                            <option value='P2'>Thạc sĩ</option>
                            <option value='P3'>Phó giáo sư</option>
                            <option value='P4'>Giáo sư</option>
                        </select>
                        <select value={filterGender} onChange={this.handleGenderFilterChange}>
                            <option value='all'>Tất cả giới tính</option>
                            <option value='M'>Nam</option>
                            <option value='F'>Nữ</option>
                        </select>
                        <input
                            type='text'
                            placeholder='Lọc theo địa chỉ...'
                            value={filterAddress}
                            onChange={this.handleAddressFilterChange}
                        />
                    </div>

                    <div className='doctor-list'>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor, index) => {
                                let imageBase64 = '';
                                if (doctor.image?.data) {
                                    imageBase64 = new Buffer(doctor.image.data, 'base64').toString('binary');
                                }

                                return (
                                    <div
                                        className='doctor-item'
                                        key={index}
                                        onClick={() => this.handleViewDetailDoctor(doctor)}
                                    >
                                        <div
                                            className='doctor-image'
                                            style={{
                                                backgroundImage: `url(${imageBase64})`,
                                            }}
                                        ></div>
                                        <div className='doctor-info'>
                                            {language === LANGUAGES.EN ? (
                                                <p>
                                                    {`${doctor.positionData.valueEn}: ${doctor.firstName} ${doctor.lastName}`}
                                                </p>
                                            ) : (
                                                <p>
                                                    {`${doctor.positionData.valueVn}: ${doctor.firstName} ${doctor.lastName}`}
                                                </p>
                                            )}
                                            <p>Địa chỉ: {doctor.address}</p>
                                            <p>Giới tính: {doctor.genderData?.valueVn}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='no-data'>
                                <p>Không tìm thấy bác sĩ phù hợp.</p>
                            </div>
                        )}
                    </div>

                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        doctors: state.admin.doctors,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctors: (limit) => dispatch(action.fetchTopDoctor(limit)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDoctor));
