import { apiConfig } from "./config";
import ApiError from "./error";

type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: HeadersInit;
}

export default class Service {

    protected async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {

        const {
            method = "GET",
            body,
            headers = {}
        } = options;

        const response = await fetch(
            `${apiConfig.baseUrl}${endpoint}`,
            {
                method,
                credentials: "include",

                headers: {
                    ...(body instanceof FormData
                        ? {}
                        : {
                            "Content-Type":
                                "application/json"
                        }),
                    ...headers
                },

                body:
                    body instanceof FormData
                        ? body
                        : body
                            ? JSON.stringify(body)
                            : undefined
            }
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new ApiError(
                errorText || "Something went wrong",
                response.status
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null as T;
        }

        const contentType =
            response.headers.get("content-type");

        if (
            contentType?.includes(
                "application/json"
            )
        ) {
            return response.json();
        }

        return (
            await response.text()
        ) as T;
    }

    protected get<T>(endpoint: string) {
        return this.request<T>(endpoint);
    }

    protected post<T>(
        endpoint: string,
        body?: unknown
    ) {
        return this.request<T>(
            endpoint,
            {
                method: "POST",
                body
            }
        );
    }

    protected put<T>(
        endpoint: string,
        body?: unknown
    ) {
        return this.request<T>(
            endpoint,
            {
                method: "PUT",
                body
            }
        );
    }

    protected delete<T>(
        endpoint: string
    ) {
        return this.request<T>(
            endpoint,
            {
                method: "DELETE"
            }
        );
    }
}
