import { useRequest } from '../../hooks/use-request'
import Router from 'next/router'
import { useEffect } from 'react'

export default () => {

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: (data) => {
      //  console.log(data);
      Router.push('/')  // Navigate to / router
    }
  })

  useEffect(async () => {

    await doRequest()

  }, [])



  return <div> Signing out ...</div>
}
