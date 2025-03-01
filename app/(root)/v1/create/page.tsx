import EventForm from './eventForm'

const AdminCreate: React.FC = () => {
  return (
    <main className='p-4 flex flex-col gap-4 mx-auto max-w-4xl lg:max-w-4xl 2xl:max-w-5xl min-h-screen items-center justify-center'>
      <article className='w-full'>
        <EventForm />
      </article>
    </main>
  )
}

export default AdminCreate
