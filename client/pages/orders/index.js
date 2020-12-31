const ShowMyOrder = ({ orders }) => {

  return <div>
    <h1>My Orders</h1>

    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Order status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          return (<tr key={order.id}>
            <td>{order.ticket.title}</td>
            <td>{order.ticket.price}</td>
            <td>{order.status}</td>
          </tr>)
        })}
      </tbody>
    </table>




  </div>
}

ShowMyOrder.getInitialProps = async (context, client, curentUser) => {
  const { data } = await client.get('/api/orders/')

  return { orders: data }
}

export default ShowMyOrder