import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../components/Auth/AuthProvider';
import { ThemeProvider } from '../components/ui/ThemeProvider';
import { PlanProvider } from '../components/Permissions/PlanProvider';
import { NotificationProvider } from '../components/Notifications/NotificationProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <PlanProvider>
          <NotificationProvider>
            <ThemeProvider>
              <Component {...pageProps} />
            </ThemeProvider>
          </NotificationProvider>
        </PlanProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;