
import React, { useState } from 'react'
import { useRequest } from '../../hooks/use-request'
import Router from 'next/router'

const NewTicket = () => {

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: (data) => {
      //  console.log(data);
      Router.push('/')  // Navigate to '/' router
    }
  })

  const onSubmit = (e) => {
    e.preventDefault()
    doRequest()
  }
  const onBlur = (e) => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }


  return <div >


    <h1> Create Ticket</h1>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input className="form-control" value={title} name="title"
          onChange={(e) => { return setTitle(e.target.value) }} />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input className="form-control" value={price} name="price"
          onChange={(e) => { return setPrice(e.target.value) }}
          onBlur={onBlur} />
        {/* onBlur  when a user leaves an input field: */}

      </div>
      {errors}
      <button className="btn btn-primary">Submit</button>
    </form>




  </div>
}

export default NewTicket