const express = require('express');
const cors = require('cors');
const userRoutesAdmin = require('./routes/routesAdmin/routesAdmin');
const eventsRoutesAdmin = require('./routes/routesAdmin/routerEventsAdmin');
const codeRoutesClient = require('./routes/routerClient/routerCode');
const eventsRoutesStore = require('./routes/routerEventsStore/routesStoreEvents');
const clipRoutePayment = require('./routes/routerClip/routerClip');
const orderRoutes = require('./routes/routerOrders/routerOrders');
const mockPaymentRoutes = require('./routes/routesPruebasClip/routespruebas');
const whatsappRoutes = require('./routes/routesWhastApp/routeWhatApp');
const emailRoutes = require('./routes/emailRoutes/emailRoutes');
const orderAdmRouter = require('./routes/orderRouterAdmin/adminRouterOrders')


const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', userRoutesAdmin);
app.use('/api/admin' , eventsRoutesAdmin);
app.use('/api/code' , codeRoutesClient);
app.use('/api/store',eventsRoutesStore);

app.use('/api/payments',clipRoutePayment);

app.use('/api',orderRoutes);

app.use("/api", mockPaymentRoutes);

app.use('/api',whatsappRoutes);

app.use('/api', emailRoutes)

app.use('/api',orderAdmRouter)





module.exports = app;