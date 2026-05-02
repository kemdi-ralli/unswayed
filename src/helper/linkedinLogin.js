export function initiateLinkedInLogin(loginType) {
  const uuid = crypto.randomUUID();
  // Encode user type into state so the callback knows where to redirect
  const state = loginType === "employer" ? `${uuid}:employer` : uuid;
  sessionStorage.setItem("linkedin_oauth_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
    scope: "openid profile email",
    state,
  });

  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}
