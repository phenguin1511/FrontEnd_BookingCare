import React, { Component } from 'react';

class Comment extends Component {
    componentDidMount() {
        this.initFacebookSDK();
    }

    initFacebookSDK() {
        const loadFB = () => {
            if (window.FB) {
                window.FB.XFBML.parse(); // Parse Facebook plugins
            } else {
                setTimeout(loadFB, 500); // Retry if FB object is not ready
            }
        };

        if (!document.getElementById('facebook-jssdk')) {
            const js = document.createElement('script');
            js.id = 'facebook-jssdk';
            js.src = 'https://connect.facebook.net/vi_VN/sdk.js';
            document.body.appendChild(js);

            js.onload = () => {
                window.fbAsyncInit = () => {
                    window.FB.init({
                        appId: process.env.REACT_APP_FACEBOOK_APP_ID.trim(),
                        cookie: true,
                        xfbml: true,
                        version: 'v12.0', // Ensure this matches your app version
                    });
                    loadFB();
                };
            };
        } else {
            loadFB();
        }
    }


    render() {
        const { dataHref, width } = this.props;
        return (
            <div class="fb-comments"
                data-href={dataHref}
                data-width={width}
                data-numposts="5"></div>
        );
    }
}

export default Comment;
