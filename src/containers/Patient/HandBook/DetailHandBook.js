import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './DetailHandBook.scss';
import * as action from "../../../store/actions";
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { LANGUAGES } from '../../../utils';
import { getInfoHandBookById } from '../../../services/userService';
class DetailHandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            detailHandBook: []
        };
    }

    toggleDescription = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInfoHandBookById(id);
            console.log("Check res", res)
            if (res && res.data.errCode === 0) {
                let data = res.data.data
                this.setState({
                    detailHandBook: data
                });
            } else {
                this.setState({
                    detailHandBook: []
                });
            }
        }
    }



    render() {
        const { detailHandBook } = this.state;
        console.log(this.state);

        return (
            <Fragment>
                <HomeHeader />
                <div className='detail-handbook-container'>
                    <div className="button-handbook">
                        <button className="back-button-handbook" onClick={() => this.props.history.goBack()}>⬅ Quay lại</button>
                    </div>

                    <div className='detail-handbook-content'>
                        {detailHandBook && detailHandBook.descriptionHTML ? (
                            <>
                                <div
                                    className='image-title-handbook-detail'
                                    style={{
                                        backgroundImage: `url(${detailHandBook.image})`
                                    }}
                                ></div>
                                <div
                                    className={`detail-handbook-content ${this.state.isExpanded ? "expanded" : "collapsed"}`}
                                    dangerouslySetInnerHTML={{ __html: detailHandBook.descriptionHTML }}
                                />
                                <button
                                    className="toggle-description-btn"
                                    onClick={this.toggleDescription}
                                >
                                    {this.state.isExpanded ? "Thu gọn" : "Xem thêm"}
                                </button>
                            </>
                        ) : (
                            <p className="no-description">Chưa có mô tả</p>
                        )}
                    </div>
                </div>
                <HomeFooter />
            </Fragment>

        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(action.fetchAllClinic()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailHandBook);
