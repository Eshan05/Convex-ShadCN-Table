import { AuthProvider } from '@/context/UserContext'

export default function VLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <div className=''>{children}</div>
    </AuthProvider>
  )
}
