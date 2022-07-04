import React from 'react';
import Header from './login/header';
// import Footer from './footer';
// require('../styles/knowledgeblock.css');

class Privacy extends React.Component {
	constructor(props) {
		super(props);
	} 
   render() {
	   return(
			<div>
				<div className="main_div">
					<Header />
				</div>
				<div className="container">
				<p className='privacy'>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
				<br/>
				
				1) What personal information do we collect from the people that visit our blog, website or app?

				When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, phone number  or other details to help you with your experience.
				<br/>
				<br/>

				2) When do we collect information?
				We collect information from you when you register on our site, subscribe to a newsletter, fill out a form or enter information on our site.
				<br/>
				<br/>

				3) We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:

				a) To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.

b) To improve our website in order to better serve you.
c) To allow us to better service you in responding to your customer service requests.

d) To ask for ratings and reviews of services or products.
<br/>
<br/>

4) How do we protect your information?

Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.We use regular Malware Scanning.
We do not use an SSL certificate.
We do not need an SSL layer because we do not ask for personal credit card information on the website. 
The payment information is collected from our SSL-Compliant 3rd party payment providers. Hence, there is No risk of your 
payment information being stored on our server and being compromised. Buy with Confidence!

We do not collect any personal information about you other than the email address that you use to login, and the permissions
that you provide for enabling Facebook login on the site. This is retricted to only the public data that you have enabled 
on your Facebook account.

Other information like your college or current occupation that you voluntarily provide to us will be stored with utmost
secrecy and never shared with other third parties for any purpose.

<br/>
<br/>

5) Third-party disclosure
We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it's release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property or safety. 
<br/>

However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses. Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
<br/>
<br/>
</div>
		
			</div>
	   )
   }
}

export default Privacy;