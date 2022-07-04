// Match multiple baseObjectects inside keypaired base baseObjectects and return results.
export function matchObjects(baseObject, arrayOfIds) {
	let result=[];
	arrayOfIds.map((id)=>{
	  	if(typeof id !== undefined) {  	
	      Object.keys(baseObject).map((key) => {
	         baseObject[key]['_id']===id?result.push(baseObject[key]):console.log('Object not matched:',baseObject[key])
	      })
	    }
  	});
  	return result;
}	