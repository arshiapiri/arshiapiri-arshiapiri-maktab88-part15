const express = require('express');
const app = express();
const { AppError } = require('./utils/app-error');
const  apiRouter  = require('./routes/api-route')

//body parser
app.use(express.json({limit : "10kb"}))


// routing
app.use("/api", apiRouter);

// 404 handler
app.all('*', (req, res, next) => {
	next(new AppError(404, `${req.method} ${req.originalUrl} not found!`));
});

// global error handler
app.use((err, req, res, next) => {
	const {
		statusCode = 500,
		status = 'error',
		message = 'something went wrong, not fault :)'
	} = err;

	res.status(statusCode).json({ status, message });
});

app.listen(5000, '127.0.0.1', () => console.log('Listening on :5000 ...'));