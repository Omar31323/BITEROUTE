const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Thin wrapper around fetch that:
 * - Prepends the base URL
 * - Always sends credentials (cookies)
 * - Sets Content-Type to JSON when body is an object
 * - Returns { data, ok, status } — never throws for server errors
 * - Throws only on network failure (no connection)
 */
export const apiFetch = async (path, options = {}) => {
    const { body, ...rest } = options;

    const isFormData = body instanceof FormData;

    const config = {
        credentials: 'include',
        ...rest,
        ...(body && {
            body: isFormData ? body : JSON.stringify(body),
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...(rest.headers || {}),
            },
        }),
    };

    const response = await fetch(`${BASE_URL}${path}`, config);
    const data = await response.json().catch(() => null);

    return { data, ok: response.ok, status: response.status };
};
