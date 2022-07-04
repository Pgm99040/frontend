import React from 'react';

export const setInToStorage = (data) => {
    Object.keys(data).forEach(item => {
        localStorage.setItem(item,data[item])
    })
};

export const getFromStorage = key => {
    return localStorage.getItem(key);
};