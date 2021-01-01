import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {   // In server (in Kubernetes)
    console.log('on Server');
    return axios.create({

      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://www.waitaralab.xyz',
      headers: req.headers
    })

  } else {                               // In browser
    console.log('on Browser');
    return axios.create({
      baseURL: '/',
      // headers: not needed as browser will take care of that.
    })
  }

}