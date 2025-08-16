'use client'

import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';
import SetClear from '@/components/applicant/dashboard/SetClear';
import CustomLayout from '@/components/rootLayout/CustomLayout';
import ReduxProvider from '@/ReduxProvider';

export default function AppProviders({ children }) {
  const pathname = usePathname();
  const showCookieBanner = pathname !== '/manage-cookies';

  return (
    <ReduxProvider>
      {showCookieBanner && <SetClear />}
      <ThemeProvider theme={theme}>
        <CustomLayout>{children}</CustomLayout>
      </ThemeProvider>
    </ReduxProvider>
  );
}
