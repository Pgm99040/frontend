import React from 'react';
import fb from '../images/fb.png';
import twitter from '../images/twitter.png';
import linkedin from '../images/linkedin.png';
require('../styles/footer.css');

class Footer extends React.Component {
 render() {
    	return (
    		<div className="footer">
    		<div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-bg2">
					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 ">
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 footer-fonts1">About </div>
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 footer-fonts1">Blog </div>
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 footer-fonts1">Career </div>
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 footer-fonts1">Support </div>
					</div>
					<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-right">
						<img src={fb} alt="fb" className="img-padding-right"/>
						<img src={twitter} alt="twitter" className="img-padding-right"/>
						<img src={linkedin} alt="linkedin" className="img-padding-right"/>
					</div>
				</div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-bg1">
					<div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 footer-fonts">Copyright @ 2018 CodeDIY All rights reserved.</div>
					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 text-right">
						<a href="/privacy"><div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 footer-fonts">Privacy Policy</div></a>
						<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 footer-fonts">Terms and Conditions</div>
					</div>
				</div>
    			</div>
    		</div>
        )
    }
}
export default Footer;