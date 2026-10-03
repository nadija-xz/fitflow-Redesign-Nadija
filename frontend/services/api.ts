export const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

export async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
    if (!API_URL) {
        throw new Error('The server address is missing. Please configure EXPO_PUBLIC_API_URL.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        return await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal });
    } catch {
        if (controller.signal.aborted) {
            throw new Error('The server took too long to respond. Please check your connection and try again.');
        }
        throw new Error('Cannot reach the server. Check your connection and try again.');
    } finally {
        clearTimeout(timeout);
    }
}
