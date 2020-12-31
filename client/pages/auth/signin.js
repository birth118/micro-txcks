import React, { useState } from 'react'
import { useRequest } from '../../hooks/use-request'
import Router from 'next/router'

export default function signin() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //const [errors, setErrors] = useState([])
  const { doRequest, errors } = useRequest({    // Custom Hook
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => {
      Router.push('/')
    }
  })


  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log(`email: ${email}`);
    // console.log(`password: ${password}`);

    await doRequest()

  }

  return (
    <div className="container">
      <form action="" method="post" onSubmit={onSubmit}>
        <h1>Sign In</h1>


        <div div className="form-group">
          <label>Email Address</label>
          <input onChange={(e) => setEmail(e.target.value)}
            type="text" name="email" className="form-control" value={email} />
        </div>
        <div className="form-group">
          <label htmlFor="">Password</label>
          <input onChange={e => { setPassword(e.target.value) }} type="password" name="password" id="" className="form-control" value={password} />
        </div>

        {errors}


        <button className="btn btn-primary">Sign In</button>

      </form>
    </div >
  )
}
