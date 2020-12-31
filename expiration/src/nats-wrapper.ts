// Singleton class to make  similar to moongoose.connect()
//  - Used Promise
//  - Exporting instance instead of class

import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan

  get client() {
    // Typescript method 'get'
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }
    return this._client
  }

  connect(clusterId: string, cilentId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, cilentId, { url })

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS Streaming')
        resolve()
      })
      this.client.on('error', (err) => {
        console.log('Failed to connect to NATS Streaming')
        reject(err)
      })
    })
  }
}

export const natsWrapper = new NatsWrapper()
// To export NatsWrapper instance as Singleton
// Submodule can use the instance just by importing it
// This is same way mongoose

//const client = natsWrapper.connect()
