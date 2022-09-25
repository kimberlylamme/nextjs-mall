// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from 'node:fs/promises'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const response = await readFile(`./data/products.json`, 'utf8')
  res.status(200).json(JSON.parse(response))
}
