import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'Born again',
    price: 302,
    userId: '123',
  })
  await ticket.save()

  const instance1 = await Ticket.findById(ticket.id)
  const instance2 = await Ticket.findById(ticket.id)
  instance1!.set({ price: 402 })
  instance2!.set({ price: 502 })

  await instance1!.save()

  try {
    await instance2!.save()
  } catch (err) {
    return done()
  }

  throw new Error('Should not hit this point')
})

it('shows increased version', async () => {
  const ticket = Ticket.build({
    title: 'Born again',
    price: 302,
    userId: '123',
  })
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
