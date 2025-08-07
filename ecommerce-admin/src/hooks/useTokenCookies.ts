import { useCookies } from 'react-cookie';

const useTokenCookies = () => {
  const [cookies, setCookies, removeCookie] = useCookies(['authToken', 'refreshToken']);

  const setAuthToken = (data: { token: string; expiresIn: number }) => {
    // Store the JWT token
    setCookies('authToken', data.token, {
      path: '/', // Accessible throughout the site
      maxAge: data.expiresIn, // Cookie expires after `expires_in` seconds
      secure: true, // Use secure cookies if on HTTPS
      sameSite: 'none',
    });
  };

  const removeToken = (name: 'authToken' | 'refreshToken') => {
    removeCookie(name, {
      path: '/', // Ensure the path matches the one used when setting the cookie
    });
  };

  const setRefreshToken = (refreshToken: string) => {
    // Store the refresh token
    setCookies('refreshToken', refreshToken, {
      path: '/', // Accessible throughout the site
      maxAge: 30 * 24 * 60 * 60, // Expires in 30 days
      secure: true,
      sameSite: 'none',
    });
  };

  return {
    cookies,
    setAuthToken,
    setRefreshToken,
    removeToken,
  };
};

export default useTokenCookies;
