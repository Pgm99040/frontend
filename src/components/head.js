import React, { useEffect, useState } from 'react';

const Head = (props) => {

    const { title, description, coverPicture } = props;

    return(
        <head>
            <meta charSet='UTF-8' />
            <title>{`${title || ''}`}</title>
            <meta name='og:title' content={`${title || ''} | CodeDiy`} />
            <meta name='og:description' content={description || ''} />
            <meta property="og:image" content={coverPicture || ''} />
        </head>
    )
};

export default Head;
