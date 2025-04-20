import {z} from 'zod'

export const bookSchema=z.object({
    title:z.string().min(1),
    author:z.string().min(1),
    status:z.enum(['not_started','in_progress','finished'])    

})

