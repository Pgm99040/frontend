import React from "react";
import {Link} from "react-router";
import mentor from "../../images/mentor.png";
import mentee from "../../images/mentee.png";
import {Modal} from "antd";

const UserModal = ({visible, handleCancel,mentorLogin, userLogin}) =>{
  return(
      <Modal
          visible={visible}
          title={null}
          footer={null}
          onCancel={handleCancel}
      >
          <div className="col-md-12 col-sm-12 col-xs-12 text-center">
              <h1 className="popup-title">Please select your role</h1>
              <p className="popup-descptn">CodeDIY has verified mentors ready to offer guidance and mentees seeking help solving challenges. Please select your role today.</p>
              <div className="popup-image-padding">
                  <div className="col-md-6 col-sm-6"><Link to='/mentor-dashboard' onClick={mentorLogin}><img src={mentor} className="popup-image"/><p className="popup-mentor">Mentor</p></Link></div>
                  <div className="col-md-6 col-sm-6"><Link to='/tasklist' onClick={userLogin}><img src={mentee} className="popup-image"/><p className="popup-mentee">Mentee</p></Link></div>
              </div>
          </div>
      </Modal>
  )
};
export default UserModal;