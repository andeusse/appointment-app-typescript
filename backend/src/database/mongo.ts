import mongoose from 'mongoose';

export class MongoDB {
	private static instance: MongoDB;

	private constructor(public mongoUri: string = '') {
		mongoose.connection.on('connected', () => {
			console.log('Connected to mongoDB instance');
		});

		mongoose.connection.on('error', (err) => {
			console.log(`Error connectiong to mongoDB instance: ${err}`);
		});
	}

	static getInstance(): MongoDB {
		if (!this.instance) {
			this.instance = new MongoDB();
		}
		return this.instance;
	}

	start = (): void => {
		mongoose.connect(this.mongoUri);
	};

	stop = (): void => {
		mongoose.connection.close();
	};

	getStatus = (): string => {
		return mongoose.ConnectionStates[mongoose.connection.readyState];
	};
}
