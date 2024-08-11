import React from 'react'
import { useRouter } from 'next/router'

function page() {
    const router = useRouter()
  return (
    <div>

        page

        <p>Post: {router.query.slug}</p>
        </div>
  )
}

export default page
