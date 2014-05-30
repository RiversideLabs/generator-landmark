var util = require('util'),
	path = require('path'),
	_ = require('lodash'),
	utils = require('landmark-utils'),
	yeoman = require('yeoman-generator');


var LandmarkGenerator = module.exports = function LandmarkGenerator(args, options, config) {

	// Initialise default values
	this.cloudinaryURL = false;
	this.mandrillAPI = false;

	this.messages = [];

	// Apply the Base Generator
	yeoman.generators.Base.apply(this, arguments);

	// Init Messages
	console.log('\nWelcome to LandmarkJS.\n');

	var done = _.bind(function done() {
		console.log(
			'\n------------------------------------------------' +
			'\n' +
			'\nYour LandmarkJS project is ready to go!' +
			'\n' +
			'\nFor help getting started, visit http://landmarkjs.com/guide' +

			((this.usingTestMandrillAPI) ?
				'\n' +
				'\nWe\'ve included a test Mandrill API Key, which will simulate email' +
				'\nsending but not actually send emails. Please replace it with your own' +
				'\nwhen you are ready.'
				: '') +

			((this.usingDemoCloudinaryAccount) ?
				'\n' +
				'\nWe\'ve included a demo Cloudinary Account, which is reset daily.' +
				'\nPlease configure your own account or use the LocalImage field instead' +
				'\nbefore sending your site live.'
				: '') +

			((this.usingDemoGoogleAccount) ?
				'\n' +
				'\nWe\'ve included a demo Google API Account, which is reset daily.' +
				'\nPlease configure your own account or use the LocalImage field instead' +
				'\nbefore sending your site live.'
				: '') +

			'\n\nTo start your new website, run "node landmark".' +
			'\n');

	}, this);

	// Install Dependencies when done
	this.on('end', function () {

		this.installDependencies({
			bower: false,
			skipMessage: true,
			skipInstall: options['skip-install'],
			callback: done
		});

	});

	// Import Package.json
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

// Extends the Base Generator
util.inherits(LandmarkGenerator, yeoman.generators.Base);

LandmarkGenerator.prototype.prompts = function prompts() {

	var cb = this.async();

	var prompts = {

		project: [
			{
				name: 'projectName',
				message: 'What is the name of your project?',
				default: 'My Site'
			}, {
				type: 'confirm',
				name: 'includeBlog',
				message: 'Would you like to include a Blog?',
				default: true
			}, {
				type: 'confirm',
				name: 'includeGallery',
				message: 'Would you like to include an Image Gallery?',
				default: true
			}, {
				type: 'confirm',
				name: 'includeEnquiries',
				message: 'Would you like to include a Contact Form?',
				default: true
			}, {
				name: 'selectTaskRunner',
				message: 'Would you like to include gulp or grunt? (enter: gulp / grunt / default: none)',
				default: ''
			}, {
				type: 'confirm',
				name: 'includeEmail',
				message: '------------------------------------------------' +
					'\n    LandmarkJS integrates with Mandrill (from Mailchimp) for email sending.' +
					'\n    Mandrill accounts are free for up to 12k emails per month.' +
					'\n    Would you like to include Email configuration in your project?',
				default: true
			}
		],

		config: []

	};

	this.prompt(prompts.project, function(props) {

		_.each(props, function(val, key) {
			this[key] = val;
		}, this);

		// Keep an unescaped version of the project name
		this._projectName = this.projectName;
		// ... then escape it for use in strings (most cases)
		this.projectName = utils.escapeString(this.projectName);

		if (this.includeBlog || this.includeGallery || this.includeEmail) {

			if (this.includeEmail) {
				prompts.config.push({
					name: 'mandrillAPI',
					message: '------------------------------------------------' +
						'\n    Please enter your Mandrill API Key (optional).' +
						'\n    See http://landmarkjs.com/guide/config/#mandrill for more info.' +
						'\n    You can skip this for now (we\'ll include a test key instead)' +
						'\n    ' +
						'\n    Your Mandrill API Key:'
				});
			}

			if (this.includeBlog || this.includeGallery) {

				var blog_gallery = 'blog and gallery templates';

				if (!this.includeBlog) {
					blog_gallery = 'gallery template';
				} else if (!this.includeGallery) {
					blog_gallery = 'blog template';
				}

			}

		}

		prompts.config.push({
			name: 'cloudinaryURL',
			message: '------------------------------------------------' +
				'\n    LandmarkJS integrates with Cloudinary for image upload, resizing and' +
				'\n    hosting. See http://landmarkjs.com/guide/config/#cloudinary for more info.' +
				'\n    ' +
				'\n    CloudinaryImage fields are used for all uploads by default.' +
				'\n    ' +
				'\n    You can skip this for now (we\'ll include demo account details)' +
				'\n    ' +
				'\n    Please enter your Cloudinary URL:'
		});

		prompts.config.push({
			name: 'googleAPI',
			message: '------------------------------------------------' +
				'\n    LandmarkJS integrates with the Google API to provide Geocoding.' +
				'\n    services. See https://developers.google.com/maps/documentation/geocoding/ for more info.' +
				'\n    ' +
				'\n    You can skip this for now (we\'ll include demo account details)' +
				'\n    ' +
				'\n    Please enter your Google API Key:'
		});

		prompts.config.push({
			name: 's3Key',
			message: '------------------------------------------------' +
				'\n    LandmarkJS integrates with the Amazon S3 for uploading location tours.' +
				'\n    See http://landmarkjs.com/docs/configuration/#services-amazons3 for more information.' +
				'\n    ' +
				'\n    If you skip this, you will recieve an error in starting the app.' +
				'\n    ' +
				'\n    Please enter your S3 Key:'
		});

		prompts.config.push({
			name: 's3Secret',
			message: 'Please enter your S3 Secret:'
		});

		prompts.config.push({
			name: 's3Bucket',
			message: 'Please enter your S3 Bucket:'
		});

		if (!prompts.config.length) {
			return cb();
		}

		this.prompt(prompts.config, function(props) {

			_.each(props, function(val, key) {
				this[key] = val;
			}, this);

			if (this.includeEmail && !this.mandrillAPI) {
				this.usingTestMandrillAPI = true;
				this.mandrillAPI = 'LBlknR415P8IWu5PXtYUgA';
			}

			if (!this.cloudinaryURL) {
				this.usingDemoCloudinaryAccount = true;
				this.cloudinaryURL = 'cloudinary://369997115318114:Dzg45DYk8j5fDgvtHkPoyHZYN50@landmark-demo';
			}

			if (!this.googleBrowserKey) {
				this.usingDemoGoogleAccount = true;
				this.googleBrowserKey = 'AIzaSyD9J9BAXpQrEZCNmfBavAFzPmkOIM1cZaM';
			}

			if (!this.s3Key) {
				this.s3Key = '';
			}

			if (!this.s3Secret) {
				this.s3Secret = '';
			}

			if (!this.s3Bucket) {
				this.s3Bucket = '';
			}

			cb();

		}.bind(this));

	}.bind(this));

};

LandmarkGenerator.prototype.guideComments = function() {

	var cb = this.async();

	this.prompt([
		{
			type: 'confirm',
			name: 'includeGuideComments',
			message: '------------------------------------------------' +
				'\n    Finally, would you like to include extra code comments in' +
				'\n    your project? If you\'re new to Landmark, these may be helpful.',
			default: true
		}
	], function(props) {

		this.includeGuideComments = props.includeGuideComments;
		cb();

	}.bind(this));

};

LandmarkGenerator.prototype.keys = function keys() {

	var cookieSecretChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()-=_+[]{}|;:",./<>?`~';

	this.cookieSecret = utils.randomString(64, cookieSecretChars);

};

LandmarkGenerator.prototype.project = function project() {

	this.template('_package.json', 'package.json');
	this.template('_env', '.env');
	this.template('_jshintrc', '.jshintrc');

	this.template('_landmark.js', 'landmark.js');

	this.copy('editorconfig', '.editorconfig');
	this.copy('gitignore', '.gitignore');
	this.copy('Procfile');

	if(this.selectTaskRunner === 'grunt') {
		this.copy('Gruntfile.js');
	}

	if(this.selectTaskRunner === 'gulp'){
		this.copy('gulpfile.js');
	}


};

LandmarkGenerator.prototype.models = function models() {

	var modelFiles = ['User', 'Location'],
		modelIndex = '';

	if (this.includeBlog) {
		modelFiles.push('Post');
		modelFiles.push('PostCategory');
	}

	if (this.includeGallery) {
		modelFiles.push('Gallery');
	}

	if (this.includeEnquiries) {
		modelFiles.push('Enquiry');
	}

	this.mkdir('models');

	modelFiles.forEach(function(i) {
		this.template('models/' + i + '.js');
		modelIndex += 'require(\'./' + i + '\');\n';
	}, this);

	// we're now using landmark.import() for loading models, so an index.js
	// file is no longer required. leaving for reference.

	// this.write('models/index.js', modelIndex);

};

LandmarkGenerator.prototype.routes = function routes() {

	this.mkdir('routes');
	this.mkdir('routes/views');

	this.template('routes/_index.js', 'routes/index.js');
	this.template('routes/_middleware.js', 'routes/middleware.js');

	if (this.includeEmail) {
		this.template('routes/_emails.js', 'routes/emails.js');
	}

	this.copy('routes/views/index.js');

	this.copy('routes/views/locations.js');
	this.copy('routes/views/location.js');

	if (this.includeBlog) {
		this.copy('routes/views/blog.js');
		this.copy('routes/views/post.js');
	}

	if (this.includeGallery) {
		this.copy('routes/views/gallery.js');
	}

	if (this.includeEnquiries) {
		this.copy('routes/views/contact.js');
	}

	// API
	this.mkdir('routes/api');
	this.copy('routes/api/locations.js');
};

LandmarkGenerator.prototype.templates = function templates() {

	this.mkdir('templates');
	this.mkdir('templates/views');

	this.directory('templates/layouts');
	this.directory('templates/mixins');
	this.directory('templates/views/errors');

	this.copy('templates/views/index.jade');

	this.copy('templates/views/locations.jade');
	this.copy('templates/views/location.jade');

	if (this.includeBlog) {
		this.copy('templates/views/blog.jade');
		this.copy('templates/views/post.jade');
	}

	if (this.includeGallery) {
		this.copy('templates/views/gallery.jade');
	}

	if (this.includeEnquiries) {
		this.copy('templates/views/contact.jade');
		if (this.includeEmail) {
			this.copy('templates/emails/enquiry-notification.jade');
		}
	}

};

LandmarkGenerator.prototype.udpates = function routes() {

	this.directory('updates');

};

LandmarkGenerator.prototype.files = function files() {

	this.directory('public');

};
