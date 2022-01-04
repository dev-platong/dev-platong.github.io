import { publish } from 'gh-pages';

publish(
	'build',
	{
		branch: 'gh-pages',
		repo: 'git@github.com:dev-platong/dev-platong.github.io.git',
		user: {
			name: 'dev-platong',
			email: 'platong8249@gmail.com'
		}
	},
	() => {
		console.log('Deploy has been finished.');
	}
);
