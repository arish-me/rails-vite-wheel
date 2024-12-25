// cable.ts
import { createConsumer } from '@rails/actioncable';
const token = localStorage.getItem("userToken");  // Retrieve JWT token from localStorage

const getSubDomain = () => {
  const hostname = window.location.hostname; // e.g., "galaxy.localhost"
  const parts = hostname.split(".");

  if (parts.length >= 2) {
    const subdomain = parts[0]; // Extract the subdomain
    return domain_url(subdomain);
  }

  return process.env.APP_URL || "http://localhost:3000"; // Default backend URL
};

const domain_url = (subdomain) => {
  const APP_DOMAIN = process.env.APP_DOMAIN; // Ensure this environment variable is defined
  const isDevelopment = process.env.NODE_ENV === "development";

  return isDevelopment
    ? `ws://${subdomain}.${APP_DOMAIN}`
    : `ws://${subdomain}.${APP_DOMAIN}`;
};

const cable = createConsumer(`${getSubDomain()}/cable?token=${token}`);  // Adjust WS URL accordingly
//const cable = createConsumer('ws://localhost:3000/cable'); // Update URL if needed


export default cable;
