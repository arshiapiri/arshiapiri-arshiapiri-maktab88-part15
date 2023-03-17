const { AppError } = require("../utils/app-error");
const users = require("../dbs/users-data.json");
const { writeFile } = require("node:fs/promises");
const { join } = require("node:path")

const signup = async (req, res, next) => {
	try {
		// sanitization
		const {
			username = null,
			password = null,
			email = null,
			gender = "not-set"
		} = req.body;

		if (!username?.trim() || !password?.trim() || !email?.trim()) {
			return next(new AppError(400, 'username, password, email is required.'));
		}

		const user = users.find(user => user.username === username);

		if (!!user) {
			return next(
				new AppError(
					400,
					`username: ${username} is already taken, try another one.`
				)
			);
		}

		const usersData = [
			...users,
			{ username, password, email, gender, isLoggedIn: false }
		];

		await writeFile(
			join(__dirname, '../dbs/users-data.json'),
			JSON.stringify(usersData, null, 2)
		);

		res.status(201).json({
			status: 'success',
			data: {
				user: { username, password, email, gender, isLoggedIn: false }
			}
		});
	} catch (error) {
		next(new AppError(500, '[-]: auth controller > signup'));
	}
};

const login = async (req, res, next) => {
	try {
		// sanitization
		const {
			username = null,
			password = null,
		} = req.body;

		if (!username?.trim() || !password?.trim()) {
			return next(new AppError(400, 'username and password is required.'));
		}

		const user = users.find(user => user.username === username);

		if (!user) {
			return next(new AppError(401, 'username or password not match'));
		}

		if (user.password !== password) {
			return next(new AppError(401, 'username or password not match'));
		}

		// update user isLoggedIn status
		const usersData = users.map(user => {
			if (user.username === username) {
				return { ...user, isLoggedIn: true };
			}
			return { ...user, isLoggedIn: false };
		});
		user.isLoggedIn = true;

		await writeFile(
			join(__dirname, '../dbs/users-data.json'),
			JSON.stringify(usersData, null, 2)
		);

		res.status(200).json({
			status: 'success',
			data: { user }
		});
	} catch (error) {
		console.log(error);
		next(new AppError(500, '[-]: auth controller > login'));
	}
};

module.exports = { signup, login }