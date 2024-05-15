import * as React from "react";
import {
    FormDataConvertible,
    Method,
    Progress,
    VisitOptions,
} from "@inertiajs/core";
import { useForm as useInertiaForm } from "@inertiajs/react";
import axios, { AxiosError, AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        common: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
        },
    },
});

export type setDataByObject<TForm> = (data: TForm) => void;
export type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
export type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(
    key: K,
    value: TForm[K]
) => void;
type FormDataType = object;

export interface InertiaFormProps<TForm extends FormDataType> {
    data: TForm;
    isDirty: boolean;
    errors: Partial<Record<keyof TForm, string>>;
    hasErrors: boolean;
    processing: boolean;
    progress: Progress | null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    setData: setDataByObject<TForm> &
        setDataByMethod<TForm> &
        setDataByKeyValuePair<TForm>;
    transform: (callback: (data: TForm) => TForm) => void;
    setDefaults(): void;
    setDefaults(field: keyof TForm, value: FormDataConvertible): void;
    setDefaults(fields: Partial<TForm>): void;
    reset: (...fields: (keyof TForm)[]) => void;
    clearErrors: (...fields: (keyof TForm)[]) => void;
    setError(field: keyof TForm, value: string): void;
    setError(errors: Record<keyof TForm, string>): void;
    submit: (method: Method, url: string, options?: VisitOptions) => void;
    get: (url: string, options?: VisitOptions) => void;
    patch: (url: string, options?: VisitOptions) => void;
    post: (url: string, options?: VisitOptions) => void;
    put: (url: string, options?: VisitOptions) => void;
    delete: (url: string, options?: VisitOptions) => void;
    cancel: () => void;
}

interface ExtendedFormProps<TForm extends FormDataType>
    extends InertiaFormProps<TForm> {
    validate: (...fields: (keyof TForm)[]) => void;
    validating: boolean;
}

const useForm = <TForm extends FormDataType>(
    url: string,
    method: Method,
    initialValues?: TForm
): ExtendedFormProps<TForm> => {
    // Initialize the Inertia useForm hook
    const form = useInertiaForm(initialValues) as ExtendedFormProps<TForm>;

    const [validating, setValidating] = React.useState<boolean>(false);

    const validate = async (...fields: (keyof TForm)[]) => {
        setValidating(true);

        const dataToValidate: Partial<TForm> = {};
        fields.forEach((field) => (dataToValidate[field] = form.data[field]));

        try {
            await axiosInstance.request({
                url: url,
                method: method,
                data: dataToValidate,
                headers: {
                    Precognition: "true",
                    "Precognition-Validate-Only": fields.join(","),
                },
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status, data } = axiosError.response;

                if (status !== 422) {
                    throw new Error(`Server responded with status: ${status}`);
                }

                const errorsObject: Record<keyof TForm, string> = {} as Record<
                    keyof TForm,
                    string
                >;

                // @ts-expect-error
                Object.keys(data.errors).forEach((key) => {
                    // @ts-expect-error
                    errorsObject[key as keyof TForm] = data.errors[key][0];
                });

                form.setError(errorsObject);
            } else {
                throw new Error(
                    `Error setting up the request: ${axiosError.message}`
                );
            }
        }
        setValidating(false);
    };

    return {
        ...form,
        validating,
        validate,
        processing: form.processing || validating,
    };
};

export { useForm };
