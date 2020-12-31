// CRITICALLY this should be _app.js

// NExt.JS 's Built-in CSS support
// To add global CSS, via this _app.js, that each component will use.
// https://nextjs.org/docs/basic-features/built-in-css-support
// Adding gloabal stylesheet
//https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet

import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

// What the below funtion copmponent does?
// Next.JS will pass my written compoment to this _app via prop argument 'Component'
// and to be wrapped to create its own component interpretation

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>

    <Header currentUser={currentUser} />
    <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
    </div>

  </div>


}

AppComponent.getInitialProps = async (appContext) => {
  //console.log('APP COMPONENT');
  // argument: 'appContext' instead of '{req} because we are in Custom component not page component
  //console.log(appContext);

  //console.log(pageProps);
  // console.log(appContext.ctx);


  const axiosClient = buildClient(appContext.ctx)
  const { data } = await axiosClient.get('/api/users/currentuser')

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, axiosClient, data.currentUser)
    // This is way to run Landing.getInitialProps() which is disabled by NextJS.
  }

  //console.log(data);
  return {
    pageProps,
    ...data
  }

}

export default AppComponent