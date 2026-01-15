const DEFAULT_BASE_URL = "http://localhost:3200";

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

const buildUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const request = async (path, options = {}) => {
  const { body, headers, method = "GET", ...rest } = options;

  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json();
};

export { API_BASE_URL, buildUrl, request };
