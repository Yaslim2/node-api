export default {
  mongoUrl: process.env.MONGODB_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || '5050',
  jwtSecret: process.env.JWT_SECRET || 'tj2i1j23=@2'
}
