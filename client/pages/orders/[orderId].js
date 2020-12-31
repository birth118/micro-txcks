import buildClient from '../../api/build-client'
import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
      //token: will be sent over doRequest({token}) below
    },
    onSuccess: (payment) => {
      //console.log(payment);
      Router.push('/orders')
    }
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()  // because setInterval() only starts after 1000 m'sec later meanig start with 59 secs, not 60 secs
    const timerId = setInterval(() => { findTimeLeft() }, 1000)

    return () => {
      // this 'return' will be called when the page is navgiated away 
      // or stop showing the compment for some reason
      // unless any dependencies are defined in place of [] below
      clearInterval(timerId)
      // Without this clearInterval(), setInterval() above will run forever even if the page is navigated away
    }
  }, [])

  if (timeLeft < 0) {
    return <div>Order Expired: {timeLeft}</div>
  }



  return <div>
    <p>{timeLeft} seconds left until the order expires</p>
    {errors}
    <StripeCheckout
      token={({ id }) => {
        console.log(id)
        doRequest({ token: id })
      }}
      stripeKey="pk_test_51I22CYDAiM1Z8WM6GHGMf0IaCWsKhEmkOrrwvctpfGvo21b66rmDG5NubMPkgdGYtpeTzdVNhPZKvJwsANc6IVQJ009sxGt36H"
      amount={order.ticket.price * 100}  //as USD$
      email={currentUser.email}
    />
  </div>
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data, currentUser }
}

// export async function getServerSideProps(context) {
//   const { orderId } = context.params
//   //console.log(ticketId);
//   const client = buildClient(context)
//   const { data } = await client.get(`/api/orders/${orderId}`)


//   return {
//     props: { order: data }, // will be passed to the page component as props
//   }
// }


export default OrderShow