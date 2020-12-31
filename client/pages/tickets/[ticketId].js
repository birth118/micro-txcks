import buildClient from '../../api/build-client'
import { useRequest } from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => {
      console.log(order);
      //id: "5feb0c65d84e3e00197c74df"
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
      // orderId will be part of contex.params in getServerSideProps() in orders/[orderId].js
      // same idea as <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>

    }
  })


  return <div>

    <h1>{ticket.title}</h1>
    <h4>Price: {ticket.price}</h4>
    {errors}
    <button onClick={() => {
      doRequest()
    }} className="btn btn-primary">Purchase</button>

  </div>


}

// const ticket = TicketShow.getInitialProps = async (context, client) => {
//   const { ticketId } = context.query   //to get the value in the [id]
//   //console.log(context.query);
//   const { data } = await client.get(`/api/tickets/${ticketId}`)

//   return { ticket: data }
// }

export async function getServerSideProps(context) {
  const { ticketId } = context.params
  //console.log(ticketId);
  const client = buildClient(context)
  const { data } = await client.get(`/api/tickets/${ticketId}`)


  return {
    props: { ticket: data }, // will be passed to the page component as props
  }
}





export default TicketShow