import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "./Specialty.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow next" onClick={onClick}>
            <i className="fa-regular fa-circle-right"></i>
        </div>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow prev" onClick={onClick}>
            <i className="fa-regular fa-circle-left"></i>
        </div>
    );
};

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialties: []
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
        console.log(specialty)
        this.props.history.push(`/detail-specialty/${specialty.id}`)
    }
    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 2,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };

        const { dataSpecialties } = this.state;
        console.log(dataSpecialties)
        return (
            <React.Fragment>
                <div className='section-specialty'>
                    <div className='specialty-title'>
                        <h2>Chuyên Khoa Phổ Biến</h2>
                        <div className='btn-viewmore'>Xem Thêm</div>
                    </div>
                    <Slider className='slider' {...settings}>
                        {dataSpecialties && dataSpecialties.length > 0 ? (
                            dataSpecialties.map((specialty, index) => {

                                return (
                                    <div className='specialty-item' key={index} onClick={() => this.handleViewDetailSpecialty(specialty)}>
                                        <div
                                            className='specialty-image'
                                            style={{
                                                backgroundImage: `url(${specialty.image})`
                                            }}
                                        ></div>
                                        <p>{specialty.name || 'Specialty Name'}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No specialties available.</p>
                        )}
                    </Slider>
                </div>
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
        fetchAllSpecialty: () => dispatch(action.fetchAllSpecialty()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
