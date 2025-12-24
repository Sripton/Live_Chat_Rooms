export const googleAuthHandler = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
