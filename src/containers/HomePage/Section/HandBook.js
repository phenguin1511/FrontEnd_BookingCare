import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "./HandBook.scss";
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

class HandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandBook: []
        };
    }

    async componentDidMount() {
        await this.props.fetchAllHandBook();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataHandBook !== prevProps.dataHandBook) {
            this.setState({
                dataHandBook: this.props.dataHandBook
            });
        }
    }

    handleViewDetailHandBook = (handbook) => {
        this.props.history.push(`/detail-handbook/${handbook.id}`)
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
        const { dataHandBook } = this.props
        return (
            <React.Fragment>
                <div className='section-handbook'>
                    <div className='handbook-title'>
                        <h2>Cẩm Nang</h2>
                        <div className='btn-viewmore'>Xem Thêm</div>
                    </div>

                    <Slider className='slider' {...settings}>
                        {dataHandBook && dataHandBook.length > 0 ? (
                            dataHandBook.map((handbook, index) => {

                                return (
                                    <div className='handbook-item' key={index} onClick={() => this.handleViewDetailHandBook(handbook)}>
                                        <div
                                            className='handbook-image'
                                            style={{
                                                backgroundImage: `url(${handbook.image})`
                                            }}
                                        ></div>
                                        <div className='content_handbook'>
                                            <h4>{handbook.title || 'handbook Name'}</h4>
                                            <p>{handbook.child_title || 'handbook Name'}</p>
                                        </div>
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
        dataHandBook: state.admin.dataHandBook
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllHandBook: () => dispatch(action.fetchAllHandBook()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
