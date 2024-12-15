import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListClinic.scss';
import * as action from '../../../store/actions';
import { withRouter } from 'react-router';
import HomeFooter from '../../HomePage/HomeFooter';
import HomeHeader from '../../HomePage/HomeHeader';

class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinic: [],
            searchTerm: '',
        };
    }

    async componentDidMount() {
        await this.props.fetchAllClinic();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataClinic !== prevProps.dataClinic) {
            this.setState({
                dataClinic: this.props.dataClinic,
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    // Group clinics by the first letter of their name
    groupClinicsByLetter = (clinics) => {
        const grouped = clinics.reduce((acc, clinic) => {
            const firstLetter = clinic.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(clinic);
            return acc;
        }, {});
        return grouped;
    };

    render() {
        const { dataClinic, searchTerm } = this.state;
        const filteredClinics = dataClinic.filter((clinic) =>
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const groupedClinics = this.groupClinicsByLetter(filteredClinics);

        return (
            <React.Fragment>
                <HomeHeader />
                <div className="section-ListClinic">
                    <div className="ListClinic-title">
                        <h2>Danh Sách Cơ Sở Y Tế</h2>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cơ sở y tế..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                    </div>

                    <div className="clinic-list">
                        {Object.keys(groupedClinics).map((letter) => (
                            <div className="clinic-group" key={letter}>
                                <h3>{letter}</h3>
                                <div className="clinic-items">
                                    {groupedClinics[letter].map((clinic, index) => (
                                        <div
                                            className="clinic-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(clinic)}
                                        >
                                            <div
                                                className="clinic-image"
                                                style={{
                                                    backgroundImage: `url(${clinic.image})`,
                                                }}
                                            ></div>
                                            <p>{clinic.name || 'Tên cơ sở y tế'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {filteredClinics.length === 0 && <p>Không tìm thấy cơ sở y tế nào.</p>}
                    </div>
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        dataClinic: state.admin.dataClinic,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllClinic: () => dispatch(action.fetchAllClinic()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListClinic));
