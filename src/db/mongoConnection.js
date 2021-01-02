import { getConfig } from '../config/global_config'

export default function connectMongo(mongoose) {
  const mongoURI = getConfig('/mongoDbUrl')
  mongoose.connect(
    mongoURI,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    err => {
      if (err) {
        console.error(err)
        console.log('Failed to connect database')
      } else {
        console.log('Connected to Mongo database')
      }
    }
  )
}
