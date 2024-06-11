import React from "react";
import axios, { AxiosError, AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        common: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
        }
    }
})

const validate = async (fields: string, data: any) => {
    try {
        await axiosInstance.request({
            url: route('project.store'),
            method: "post",
            data,
            headers: {
                Precognition: "true",
                "Precognition-Validate-Only": fields
            }

        })
    } catch (error) {
        const axiosError = error as AxiosError;
        // handle errors here
        console.log(axiosError.response);
    }
}

function deepDotKeys(obj: { [key: string]: any }, parentKey: string = ""): string[] {
    return Object.keys(obj).reduce<string[]>((keys, key) => {
        const dottedKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            return keys.concat(deepDotKeys(obj[key], dottedKey));
        } else {
            return keys.concat(dottedKey);
        }
    }, []);
}

export {
    validate,
    deepDotKeys,
}