const DEFAULT_BASE_URL = "http://localhost:3200";

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

const buildUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const request = async (path, options = {}) => {
  const { body, headers, method = "GET", ...rest } = options;

  const token = localStorage.getItem("token");

  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  if (token) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), init);
  const rawBody = await response.text();

  let parsedBody;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedBody = rawBody;
  }

  if (!response.ok) {
    const errorMessage =
      (parsedBody && typeof parsedBody === "object" && parsedBody.message) ||
      (typeof parsedBody === "string" && parsedBody) ||
      response.statusText ||
      `Request failed: ${response.status}`;

    throw new Error(errorMessage);
  }

  return parsedBody;
};

export { API_BASE_URL, buildUrl, request };
