// module.exports =
// {
// 	//base_url: "http://ec2-65-0-109-6.ap-south-1.compute.amazonaws.com:8080"
// 	// base_url:"http://localhost:8080",
// 	  base_url:"https://api.codediy.io",
// 	//   base_url:"https://beta.codediy.io",
// 	  website_url:"https://test.codediy.io",
//       google_client_id: "288860329802-50qejgg5l52cef8ln5bl7bja0maso66c.apps.googleusercontent.com"
// }


const config = {
	production: {
		base_url: "https://api.codediy.io",
		website_url:"https://beta.codediy.io",
		// google_client_id: "288860329802-50qejgg5l52cef8ln5bl7bja0maso66c.apps.googleusercontent.com",
    	google_client_id: "641779018898-4sgibngtpdvtm2cq1l7g0gupc5icd6rk.apps.googleusercontent.com",
		account_sid: "AC8eafd0c253817f33b2c25c7e32e35eb1",
		auth_token: "7797761a2a7ea981313f2dd20901e2fd",
		// publishKey: "pub-c-9a14fcf5-87f8-46ca-bee8-634a77e14ce8",
		// subscribeKey: "sub-c-3f7913e4-16cd-11ec-914f-5693d1c31269"
		//paypal sendbox id
		paypal_sendbox: "AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8"
	},
	staging: {
		base_url: "https://api-stg.codediy.io",
		website_url:"https://stg.codediy.io",
		google_client_id: "641779018898-4sgibngtpdvtm2cq1l7g0gupc5icd6rk.apps.googleusercontent.com",
		account_sid: "AC8eafd0c253817f33b2c25c7e32e35eb1",
		auth_token: "7797761a2a7ea981313f2dd20901e2fd",
		// publishKey: "pub-c-9a14fcf5-87f8-46ca-bee8-634a77e14ce8",
		// subscribeKey: "sub-c-3f7913e4-16cd-11ec-914f-5693d1c31269"
		//paypal sendbox id
		paypal_sendbox: "AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8"
	},
	development: {
		base_url: "http://localhost:8080",
		website_url:"http://localhost:3000",
    	google_client_id: "641779018898-4sgibngtpdvtm2cq1l7g0gupc5icd6rk.apps.googleusercontent.com",
		account_sid: "AC8eafd0c253817f33b2c25c7e32e35eb1",
		auth_token: "7797761a2a7ea981313f2dd20901e2fd",
		// publishKey: "pub-c-9a14fcf5-87f8-46ca-bee8-634a77e14ce8",
		// subscribeKey: "sub-c-3f7913e4-16cd-11ec-914f-5693d1c31269"
		//paypal sendbox id
		paypal_sendbox: "AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8"
	},
};
module.exports =  config[process.env.REACT_APP_ENV || "staging"];
