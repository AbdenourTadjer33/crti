import * as React from "react";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { transformObject } from "./utils";

type Method = "get" | "post" | "put" | "patch" | "delete";

export interface ValidationOptions {
    url: string;
    method: Method;
    data: any;
    onError?: (errors: Record<string, string>) => void;
    onSuccess?: () => void;
}

export interface UseValidation {
    validating: boolean;
    validate: (fields: string, options?: Partial<ValidationOptions>) => void;
}

const useValidation = ({ url, method, data, onError, onSuccess }: ValidationOptions) => {
    const [validating, setValidating] = React.useState(false);

    const axiosInstance: AxiosInstance = axios.create({
        withCredentials: true,
        withXSRFToken: true,
        headers: {
            common: {
                Precognition: "true",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
            }
        }
    });

    async function validate(fields: string, overrideOptions?: Partial<ValidationOptions>) {
        setValidating(true);
        try {
            const config: AxiosRequestConfig = {
                url: overrideOptions?.url ?? url,
                method: overrideOptions?.method ?? method,
                data: overrideOptions?.data ?? data,
                headers: {
                    "Precognition-Validate-Only": fields
                }
            };

            await axiosInstance.request(config);

            if (overrideOptions?.onSuccess) {
                overrideOptions.onSuccess()
            } else if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            const axiosError = error as AxiosError;
            const errorResponse = axiosError.response;

            if (errorResponse && errorResponse.status === 422) {
                const errors = transformObject((errorResponse.data as any)?.errors);
                if (overrideOptions?.onError) {
                    overrideOptions.onError(errors);
                } else if (onError) {
                    onError(errors);
                }
            }
        } finally {
            setValidating(false);
        }
    }

    return { validating, validate };
}

export { useValidation };