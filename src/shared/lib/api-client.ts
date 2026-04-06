import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import clientEnv from '../config/load-client-env'
import type { ApiResponse } from '../types/api'

type ClerkSession = {
    session: {
        getToken: (options?: { template?: string }) => Promise<string | null>
    } | null // ✅ session can be null
}

class ApiClient {
    private client: AxiosInstance
    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            withCredentials: true
        })

        this.initAuthInterceptor()
    }

    private initAuthInterceptor() {
        this.client.interceptors.request.use(async (config) => {
            try {
                const clerk = (window as Window & { Clerk?: ClerkSession }).Clerk

                if (clerk?.session) {
                    const token = await clerk.session.getToken()
                    if (token) {
                        config.headers = config.headers || {}
                        config.headers['Authorization'] = `Bearer ${token}` // Attach the token to the Authorization header
                    }
                }
            } catch (error) {
                console.warn('Failed to refresh token:', error)
            }

            return config
        })
    }

    public async get<TResponse>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.get(path, config)
        return response.data
    }

    public async post<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.post(path, data, config)
        return response.data
    }

    public async put<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.put(path, data, config)
        return response.data
    }

    public async patch<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.patch(path, data, config)
        return response.data
    }

    public async delete<TResponse>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.delete(path, config)
        return response.data
    }
}

const client = new ApiClient(clientEnv.BACKEND_PROXY)

export default client
