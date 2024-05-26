import '@/styles/globals.css'
import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { hasCookie, setCookie } from 'cookies-next';
import WelcomeDialog from '@/components/welcome-dialog/welcome-dialog';
import Footer from '@/components/footer/footer';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { grey, purple } from '@mui/material/colors';
import { alpha, getContrastRatio } from '@mui/material/styles';


// Augment the palette to include a violet color
declare module '@mui/material/styles' {
  interface Palette {
    violet: Palette['primary'];
  }

  interface PaletteOptions {
    violet?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include a violet option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    violet: true;
  }
}
const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);

export default function CustomApp({ Component, pageProps, data }: AppProps & AppOwnProps) {

  const theme = createTheme({
    palette: {
      violet: {
        main: violetMain,
        light: alpha(violetBase, 0.5),
        dark: alpha(violetBase, 0.9),
        contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
      },
    },
    components: {
      // Name of the component
      MuiButton: {
        defaultProps: {
          // The props to change the default for.
          color: 'violet', // No more ripple, on the whole application 💣!
        },
      },
      MuiAlert: {
        defaultProps: {
          // The props to change the default for.
          color: 'violet', // No more ripple, on the whole application 💣!
        },
      },
      MuiChip: {
        _styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              px: 1,
              py: 0.25,
              borderRadius: 1,
            }),
          label: {
            padding: 'initial',
          },
          icon: ({ theme }) =>
            theme.unstable_sx({
              mr: 0.5,
              ml: '-2px',
            }),
        },
        defaultProps: {
          // The props to change the default for.
          color: 'violet', // No more ripple, on the whole application 💣!
        },
      },
      MuiIconButton: {
        defaultProps: {
          // The props to change the default for.
          color: 'violet', // No more ripple, on the whole application 💣!
        },
      },
    },
  });
  return (
    <AppCacheProvider {...pageProps}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div onContextMenu={(e) => {
          // e.preventDefault();
        }} className='min-h-[100vh] flex flex-col overflow-y-hidden'>
          <div style={{ flex: 1 }}>
            <Component {...pageProps} />
          </div>
          {data.isNewUser && <WelcomeDialog open={true} />}
          <Footer />
        </div>
      </ThemeProvider>
    </AppCacheProvider>
  )
}



type AppOwnProps = {
  data: {
    isNewUser: boolean,
    configuration: {
      service: {
        host: string
      }
    }
  }
}
CustomApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)
  const { req, res } = context.ctx;
  const isNewUser = !hasCookie('danceiq.u', { req, res });
  if (isNewUser) setCookie('danceiq.u', 'mx:1', { req, res, maxAge: 60 * 60 * 24 });
  return ({
    ...ctx, data: {
      isNewUser: isNewUser,
      configuration: {
        service: {
          host: 'http://localhost:3001',
        }
      }
    }
  })
}