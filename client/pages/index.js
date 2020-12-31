//import axios from 'axios'
import buildClient from '../api/build-client'
import Link from 'next/link'


const Landing = ({ currentUser, tickets }) => {   // This is REACT component that runs in the browser
  const ticketList = tickets.map((ticket) => {
    return (

      <tr key={ticket.id}>

        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        {/* <td><Link href={`/tickets/${ticket.id}`}> */}
        <td><Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          {/* <td><Link href="/orders/[orderId]" as={`/orders/${ticket.id}`}> */}
          <a>View</a>
        </Link></td>

      </tr>

    )

  })
  // console.log(tickets);
  // console.log(currentUser);
  // const resp = axios.get('/api/users/currentuser')  
  return <div>
    <h1>Tickets</h1>
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {ticketList}
      </tbody>
    </table>
  </div>
}

// #1. This NextJS static function that runs in the server as server side rendering
// But exceptionally it runs in the browser when navigated from one page to another while in the app
// Therefore we need logic where we are; in browser or in server

// #2. if getInitialProps() used in App level ( one up higher), 
// Next.JS will disable this page level getInitialProps() 

// For the initial page load, getInitialProps will run on the server only. 
// getInitialProps will then run on the client when navigating to a different route via the next/link component 
// or by using next/router.
// However, if getInitialProps is used in a custom _app.js, 
// and the page being navigated to implements getServerSideProps, then getInitialProps will run on the server.



export async function getServerSideProps(context) {
  //console.log(context)
  const client = buildClient(context)
  const { data: tickets } = await client.get('/api/tickets')
  const { data: user } = await client.get('/api/users/currentuser')
  return {
    props: {
      tickets,
      currentUser: user.currentUser
    }
  }
}

// Landing.getInitialProps = async (context, client, currentUser) => {

//   const { data } = await client.get('api/tickets')
//   return { tickets: data }
// }

// console.log('LANDING PAGE');
// const axios = buildClient({ req })
// const { data } = await axios.get('/api/users/currentuser')
// return data


// //console.log(req.headers);
// if (typeof window === 'undefined') {    // in Server
//   // Request will go to ingress cross namespace
//   const { data } = await axios.get(
//     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
//     headers: req.headers
//   })
//   console.log('in Server');
//   return data

// } else {                                // In Browser
//   // Request will go to same namepspace. No domain info in URL is needed.
//   const { data } = await axios.get('/api/users/currentuser')
//   console.log('in Browser');
//   return data
// }

// return {}



export default Landing