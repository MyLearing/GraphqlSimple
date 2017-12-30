
const express = require('express')
//imprt middleware 
const graphqlMiddleware = require('express-graphql')
const { buildSchema } = require('graphql')
const customers = require('./customer')
const app  =  express()

console.log(customers.length)
const schema = buildSchema(`
    type Query {
        customer(id: Int!): Customer
        customers(limit: Int = 4, gender: String,age: AGE): [Customer]
    }

    type Customer {
        id: Int
        firstname: String
        lastname: String
        age: Int
    }

        enum AGE {
            YOUNG
            OLD
        }
`)

const resolver = {
    customer(args) {
        return customer.find( c => c.id == args.id)
    },
    customers(args) {
        
        // let result = customers การทำแบบนี้เปนการจับค่า customer ใส่ลงใน result โดยตรง โดยชี้ไปที่ Address เดียวกัน ทำให้เวลา result เปลี่ยน  customer จะเปลี้ยนด้วย

        //เราจึงต้อง clone ขึ้นมาใหม่เป็น Array โดยใช้คำสั้ง concat
        let result  = [].concat(customers)

        if(args.gender) {
            result = result.filter(c => c.gender == args.gender)
        }
        if(args.age){
            result = args.age == 'YOUNG'? result.filter( c => c.age <= 14) : result.filter( c => c.age > 14)
        }
        console.log(args.limit)
        return result.slice(0,args.limit)
    }
}
app.use(graphqlMiddleware({
    schema,
    rootValue: resolver,
    graphiql: true
}))

app.listen(3000)