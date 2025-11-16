export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express.js API',
      version: '1.0.0',
      description: 'A sample Express.js API built with TypeScript and Swagger',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6913acc476d41eb129f78075' },
            email: { type: 'string', example: 'test@google.com' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6913ad0a76d41eb129f78077' },
            userId: { type: 'string', example: '6913acc476d41eb129f78075' },
            companyName: { type: 'string', example: 'Test Company' },
          },
        },
        Card: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6913a78345e9890b855e3f59' },
            cardNumber: { type: 'string', example: '1234-5678-1010-6666' },
            isActivated: { type: 'boolean', example: true },
            creditLimit: { type: 'number', example: 20000 },
            companyId: { type: 'string', example: '6913ad0a76d41eb129f78077' },
          },
        },
        Invoice: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6913b9881ecb981dd22cf349' },
            cardId: { type: 'string', example: '6913a78345e9890b855e3f59' },
            amount: { type: 'number', example: 5000 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6914b4a2f3a6e5eb19c86cda' },
            cardId: { type: 'string', example: '6913ad0a76d41eb129f78077' },
            description: { type: 'string', example: 'AWS' },
            amount: { type: 'number', example: -3000 },
            date: { type: 'string', format: 'date-time' },
          },
        },
        CardData: {
          type: 'object',
          description: 'Card with monthly remaining spend and transactions',
          properties: {
            id: { type: 'string' },
            cardNumber: { type: 'string' },
            isActivated: { type: 'boolean' },
            remainingSpend: {
              type: 'object',
              properties: {
                used: { type: 'number', example: 10000 },
                limit: { type: 'number', example: 20000 },
              },
            },
            transactions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Transaction',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};
