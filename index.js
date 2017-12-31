
const express = require('express')
//imprt middleware 
const graphqlMiddleware = require('express-graphql')
const { buildSchema } = require('graphql')
// const customers = require('./customer')
const app  =  express()
const axios = require('axios')

const endPoint = 'https://jsonplaceholder.typicode.com/users'

// console.log(customers.length)
const schema = buildSchema(`
    type Query {
        customer(id: Int!): Customer
        customers(limit: Int = 4): [Customer]
    }

    type Customer {
        id: Int
        name : String
        username : String
        email : String
    }

     
`)

const resolver = {
   async customer(args) {
         const { data: customer } = await axios.get(`${ endPoint }/${args.id}`) //{ data: customer } เป็นก่ารเปลี่ยนชื่อตัวแปลเพื่อให้สอดคล้อง
         return customer
    },

   async customers(args) {
    //    return  axios.get(`${endPoint}?_limit=${ args.limit }`).then(res => res.data)

        console.log(args);
        const { data } = await axios.get(`${endPoint}?_limit=${ args.limit }`)
        return data
    }
}
app.use(graphqlMiddleware({
    schema,
    rootValue: resolver,
    graphiql: true
}))

app.listen(3000)