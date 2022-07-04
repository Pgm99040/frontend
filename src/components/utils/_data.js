import axios from 'axios';
import { getFromStorage } from "../../config/common";
import BaseUrl from '../../config/properties';
const config = () => ({
    headers: {
        Authorization: getFromStorage("authToken"),
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

//googleLogin--------->>>
export async function loginWithGoogle(loginData) {
    try {
        const url = `${BaseUrl.base_url}/googleAuth`;
        const res = await axios.post(url, loginData, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function becomeMentor(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/becomeMentor/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//getToken in chat------------------->>>
export async function getToken(email) {
    try {
        const url = `${BaseUrl.base_url}/api/token/${email}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//isTaskPurchased--------------------->>>
export async function isTaskPurchased(id, userId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/isTaskPurchased/${id}/user/${userId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function taskPurchasedForUsers() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/taskPurchasedForUsers`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//mentee Login
export async function menteeLogin(data) {
    try {
        const url = `${BaseUrl.base_url}/menteelogin`;
        const res = await axios.post(url, data);
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong",data:e};
    }
}

//job promotion

export async function creacteJobPostingPromotions(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/jobpostpromotion`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong",data:e};
    }
}

//mentor profile-------->>>

export async function mentorProfileUpdate(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/profileUpdate`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function mentorProfile(mentorId) {
    try {
        const url = `${BaseUrl.base_url}/api/mentor-profile/${mentorId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getMentorIdByUsername(data) {
    try {
        const url = `${BaseUrl.base_url}/api/getMentorIdByUsername`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//mentee profile---------->>>
export async function getMenteeProfile(userId) {
    try {
        const url = `${BaseUrl.base_url}/api/mentee-profile/${userId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function findByUserName(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/findUserName`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function editProfileByMentee(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/editProfile`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function profilePhotoUpload(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/imageUpload`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function addSelectAns(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/addSelectAns`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getMCQtest() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getMCQtest`;
        const res = await axios.get(url,config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getSelectMCQtest(testId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/MCQTests/Test/${testId}`;
        const res = await axios.get(url,config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAnsTest(testId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAnsTest/${testId}`;
        const res = await axios.get(url,config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function findUserIdByName(data) {
    try {
        const url = `${BaseUrl.base_url}/api/findUserIdByName`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//task-engagement page

export async function createGMeetLink(id, data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/addGmeetLink/${id}`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

// mentor-task-details
export async function viewTask(taskId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/view/${taskId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function viewTaskReview(taskId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/getReview/${taskId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function viewMentorTaskReview(taskId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/MentorTaskReviewFeedbackItemsForTaskEngagementId/${taskId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function taskviewreview(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/taskreview`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}


export async function taskreviewupdate(id,data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/updatetaskreview/${id}`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function gettaskviewreview(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/gettaskreview/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function ratingMentorToUser(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/rate/mentorToUser`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function answerAdd(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/submission`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function addDiscussion(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/discussion`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//task-engagement details----->

export async function endTask(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/endTask`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//task-details----------->>

export async function predefinedTaskWithId(id) {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtask/view/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function predefinedTaskDetailWithId(id) {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtaskDetail/view/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function taskPurchasedCheck(taskId, userId) {
    try {
        const obj = {
            taskID : taskId,
            userID : userId
        };
        const url = `${BaseUrl.base_url}/api/v1/taskPurchase`;
        const res = await axios.post(url,obj, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getActiveTasks(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/user/te/getActiveTasks/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function checkMentorsAvailability(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/checkMentorsAvailability`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function requestForTask(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/requestForTask`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function requestForCourse(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/requestForCourse`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function findMentorWithId(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/findMentorWithId/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//taskList-------->>
export async function getAllCategoryList() {
    try {
        const url = `${BaseUrl.base_url}/api/category/list`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function predefinedTaskList() {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtask/list`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function listWithOptions(data) {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtask/listWithOptions`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function categoryView(id) {
    try {
        const url = `${BaseUrl.base_url}/api/category/view/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function subcategoryView(id) {
    try {
        const url = `${BaseUrl.base_url}/api/subcategory/view/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function searchTask(data) {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtask/searchTask`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function sortByOptions(data) {
    try {
        const url = `${BaseUrl.base_url}/api/predefinedtask/sortByOptions`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

// credit purchase---------->>
export async function purchaseCredits(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/purchaseCredits`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//mentee-payment-history----------->>>

export async function getCreditsOfUser(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getCreditsOfUser/`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function paymentHistory(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/user/payment/history/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function myTask(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/user/mytask/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//mentor-dashboard---------------->>
export async function mentorPaymentHistory(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/mentor/payment/history/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function mentorTask(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/te/mentor/mytask/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//instructors--------->>>>

export async function getInstructors() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getInstructors`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//Live Session----------------->>>>>>>
export async function fetchAllLiveSessions(email) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/fetchAllLiveSessions/${email}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getAllSession() {
    try {
        const url = `${BaseUrl.base_url}/api/getAllLiveSession`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAllMicroCourse() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAllMicroCourse`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getSessionDetails(userId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/findIdWithLiveSession/${userId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getIteratorByBatch(batchId) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getIteratorByBatch/${batchId}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getBatches(title) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getBatches/${title}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getBatchesList(data) {
    try {
        const url = `${BaseUrl.base_url}/api/getBatchesList`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function purchaseBatchesList(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getPurchasedSessionsForUser`;
        const res = await axios.post(url, data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function getSortingBatch(title) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/findAndSortBatch/${title}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

//User Rating------------------->>>>>>>>>>>

export async function userRating(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/addRating`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getuserRating(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAvgRating/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

// userReview -------------------->>>>>>>>>>>>

export async function userReview(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/addReview`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
//booking batch----------->>>>>>>>>>>>>>>
export async function bookSession(data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/bookSession`;
        const header =  { 'headers': {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('authToken')
            }};
        const res = await axios.post(url,data,header, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAllBookSession() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAllBookingSession`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getBookSession(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getBookingSession/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAllBookingSessionWithEmail(email) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAllBookingSessionWithEmail/${email}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
export async function purchaseBatches(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/purchaseBatches/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAllFeed() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getFeed`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getBlog() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getBlog`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getJobPost() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getJobPost`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getExportGuidance() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getExportGuidance`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function createExportGuidanceSubscriber(obj) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/createExportGuidanceSubscriber`;
        const res = await axios.post(url,obj, config());
        return { success: res.status, data: res.data };
    }catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getUserEligibleForJobPost(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/isUserEligibleForJobPostingPromotion/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getBlogInfo(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getBlogDetail/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getCodecast() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/codeCast`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data };
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function updateCommentForBlog(id, data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/blog/${id}/updateComment`;
        const res = await axios.put(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getMicroCourseDetail(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getCourseDetail/${id}`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getCourseLessonAllDetail(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/Course/${id}/GetCourseDetailsWithLessonSummary`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function courseCompletionStatus(id,data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/Course/${id}/CompleteCourse`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function lessonCompletionStatus(id,data) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/Lesson/${id}/CompleteLesson`;
        const res = await axios.post(url,data, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}



export async function getCourseLessonContent(id) {
    try {
        const url = `${BaseUrl.base_url}/api/v1/Lesson/${id}/LessonContent`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data }
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}

export async function getAllActiveMentors() {
    try {
        const url = `${BaseUrl.base_url}/api/v1/getAllMentors`;
        const res = await axios.get(url, config());
        return { success: true, data: res.data};
    } catch (e) {
        return { success: false, msg: "Something went wrong"};
    }
}
