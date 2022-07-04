import React from "react";
import {Spin} from "antd";
import "../../styles/loder.css";

const Loader = () => (
    <div className="loader">
        <div className="position">
            <Spin spinning />
        </div>
    </div>
);

export default Loader;
