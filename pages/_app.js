import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../components/Auth/AuthProvider';
import { ThemeProvider } from '../components/ui/ThemeProvider';
import { PlanProvider } from '../components/Permissions/PlanProvider';
import { NotificationProvider } from '../components/Notifications/NotificationProvider';
import '../styles/globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <PlanProvider>
          <NotificationProvider>
            <ThemeProvider>
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </NotificationProvider>
        </PlanProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;