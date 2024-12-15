import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListSpecialty.scss';
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class ListSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialties: [],
            searchTerm: '',
        };
    }

    async componentDidMount() {
        await this.props.fetchAllSpecialty();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataSpecialties !== prevProps.dataSpecialties) {
            this.setState({
                dataSpecialties: this.props.dataSpecialties
            });
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    groupSpecialtiesByLetter = (specialties) => {
        const grouped = specialties.reduce((acc, specialty) => {
            const firstLetter = specialty.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(specialty);
            return acc;
        }, {});
        return grouped;
    };

    render() {
        const { dataSpecialties, searchTerm } = this.state;
        const filteredSpecialties = dataSpecialties.filter((specialty) =>
            specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const groupedSpecialties = this.groupSpecialtiesByLetter(filteredSpecialties);

        return (
            <React.Fragment>
                <HomeHeader />
                <div className="list-specialty-container">
                    <div className="specialty-title">
                        <h2>Danh Sách Chuyên Khoa</h2>
                    </div>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Tìm kiếm chuyên khoa..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                    </div>

                    <div className="specialty-list">
                        {Object.keys(groupedSpecialties).map((letter) => (
                            <div className="specialty-group" key={letter}>
                                <h3>{letter}</h3>
                                <div className="specialty-items">
                                    {groupedSpecialties[letter].map((specialty, index) => (
                                        <div
                                            className="specialty-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(specialty)}
                                        >
                                            <div
                                                className="specialty-image"
                                                style={{
                                                    backgroundImage: `url(${specialty.image})`,
                                                }}
                                            ></div>
                                            <p>{specialty.name || 'Specialty Name'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {filteredSpecialties.length === 0 && <p className="no-specialty-found">Không tìm thấy chuyên khoa nào.</p>}
                    </div>
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        dataSpecialties: state.admin.dataSpecialties
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(action.fetchAllSpecialty())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListSpecialty));
