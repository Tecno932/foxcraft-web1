const BASE_URL = "https://visage.surgeplay.com";

export function getVisageFullUrl(uuid: string) {
  return `${BASE_URL}/full/512/${uuid}`;
}

export function getVisageBustUrl(uuid: string) {
  return `${BASE_URL}/bust/512/${uuid}`;
}