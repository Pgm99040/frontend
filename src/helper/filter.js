var async = require('async');

export function filterObject(level, arrOfObj, callback) {
	var newArrOfObj = [];
	var categoryListing = function(obj, callbackDone){
			if (obj.difficultyLevel == level) {
				newArrOfObj.push(obj);
			}
			callbackDone();
	};
	
	async.eachSeries(arrOfObj.list, categoryListing, function(err){
		if (err) {
			callback(err);
		}else{
			//callback(null, newArrOfObj);
			var result = {list:newArrOfObj};
			callback(null, result);

		}
	});
}