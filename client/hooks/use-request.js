import React, { useState } from 'react'
import axios from 'axios'

export function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  /* 
    // 
    // ***** doRequest(): v.1
    //
  
    const doRequest = async () => {
      try {
        setErrors(null)
        const resp = await axios[method](url, body)
  
        if (onSuccess) {        // just consider the case onSuccess argument is not provided 
          onSuccess(resp.data)  // just we need something 'defined' to pass 
        }
        return resp.data
  
      } catch (err) {
        console.log(err.response);
        setErrors(
          <div className="alert alert-danger ">
            <h4>Oooops...</h4>
            <ul className="my-0">
              {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
            </ul>
          </div>
        )
  
      }
    }
  
   */

  // 
  // ***** doRequest(): v.2 : 
  // Added 'props={}' argument to get payment token as argument and make request it together
  //  

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const resp = await axios[method](url, { ...body, ...props })

      if (onSuccess) {        // just consider the case onSuccess argument is not provided 
        onSuccess(resp.data)  // just we need something 'defined' to pass 
      }
      return resp.data

    } catch (err) {
      console.log(err.response);
      setErrors(
        <div className="alert alert-danger ">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      )

    }
  }


  return { doRequest, errors }
}
