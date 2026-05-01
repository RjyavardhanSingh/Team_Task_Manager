export const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const responseData = error?.response?.data;
    const fieldErrors = responseData?.errors;

    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return fieldErrors.map((issue) => issue?.message).filter(Boolean).join(', ');
    }

    return responseData?.message || error?.message || fallback;
};
