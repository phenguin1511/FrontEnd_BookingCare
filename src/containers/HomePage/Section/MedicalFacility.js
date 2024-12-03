import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "./MedicalFacility.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as action from "../../../store/actions";
import { withRouter } from 'react-router';

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow next" onClick={onClick}>
            <i class="fa-regular fa-circle-right"></i>
        </div>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow prev" onClick={onClick}>
            <i class="fa-regular fa-circle-left"></i>
        </div>
    );
};

class MedicalFacility extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        };
    }
    async componentDidMount() {
        await this.props.fetchAllClinic();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataClinic !== prevProps.dataClinic) {
            this.setState({
                dataClinic: this.props.dataClinic
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        console.log(clinic)
        this.props.history.push(`/detail-clinic/${clinic.id}`)
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
        const { dataClinic } = this.state;
        return (
            <React.Fragment>
                <div className='section-medicalfacility'>
                    <div className='medicalfacility-title'>
                        <h2>Cơ Sở Y Tế Nổi Bật</h2>
                        <div className='btn-viewmore'>Xem Thêm</div>
                    </div>

                    <Slider className='slider' {...settings}>
                        {dataClinic && dataClinic.length > 0 ? (
                            dataClinic.map((clinic, index) => {

                                return (
                                    <div className='clinic-item' key={index} onClick={() => this.handleViewDetailClinic(clinic)}>
                                        <div
                                            className='clinic-image'
                                            style={{
                                                backgroundImage: `url(${clinic.image})`
                                            }}
                                        ></div>
                                        <p>{clinic.name || 'clinic Name'}</p>
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
        language: state.app.language,
        dataClinic: state.admin.dataClinic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(action.fetchAllClinic()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
