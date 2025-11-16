import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users';
import companiesRoutes from './routes/companies';
import cardsRoutes from './routes/cards';
import invoicesRoutes from './routes/invoices';
import transactionsRoutes from './routes/transactions';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swaggerOptions';

export const app = express();
    
app.use(cors());
app.use(express.json());

// Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/transactions', transactionsRoutes);
