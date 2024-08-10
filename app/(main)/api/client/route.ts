import { Client, CompteClient } from "@/types/types"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()
export async function GET() {
  // const res = await fetch('https://freetestapi.com/api/v1/products', {
  //   next: { revalidate: 60 }, // Revalidate every 60 seconds
  // })
  const clients:Client[] & CompteClient[] =await prisma.clients.findMany({
    include: {
      CompteClients: true
    }
  }) as unknown as Client[] & CompteClient[]

  console.log(clients[0]);


  // const data = clients

  return Response.json(clients)
}
