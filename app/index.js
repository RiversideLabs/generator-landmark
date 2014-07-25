var util = require('util'),
	path = require('path'),
	_ = require('lodash'),
	utils = require('landmark-utils'),
	colors = require('colors'),
	yeoman = require('yeoman-generator');


var LandmarkGenerator = module.exports = function LandmarkGenerator(args, options, config) {
	
	// Initialise default values
	this.cloudinaryURL = false;
	this.mandrillAPI = false;
	this.googleAPI = false;
	
	// Apply the Base Generator
	yeoman.generators.Base.apply(this, arguments);
	
	// Welcome
	console.log('\nWelcome to LandmarkJS.\n');
	
	// This callback is fired when the generator has completed,
	// and includes instructions on what to do next.
	var done = _.bind(function done() {
		console.log(
			'\n------------------------------------------------' +
			'\n' +
			'\nYour LandmarkJS project is ready to go!' +
			'\n' +
			'\nFor help getting started, visit http://getlandmarkproject.com/guide' +

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
				name: 'viewEngine',
				message: 'Would you like to use Jade or Handlebars for templates? ' + (('[jade | hbs]').grey),
				default: 'jade'
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
				name: 'userModel',
				message: 'What would you like to call the User model?',
				default: 'User'
			}, {
				name: 'adminLogin',
				message: 'Enter an email address for the first Admin user:',
				default: 'user@getlandmarkproject.com'
			}, {
				name: 'adminPassword',
				message: 'Enter a password for the first Admin user:',
				default: 'admin'
			}, {
				name: 'taskRunner',
				message: 'Would you like to include gulp or grunt? ' + (('[gulp | grunt]').grey),
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
		this.adminLogin = utils.escapeString(this.adminLogin);
		this.adminPassword = utils.escapeString(this.adminPassword);
		
		// Clean the viewEngine selection
		if (_.contains(['handlebars', 'hbs', 'h'], this.viewEngine.toLowerCase().trim())) {
			this.viewEngine = 'hbs';
		} else {
			this.viewEngine = 'jade';
		}
		
		// Clean the userModel name
		this.userModel = utils.camelcase(this.userModel, false);
		this.userModelPath = utils.keyToPath(this.userModel, true);
		
		// Clean the taskRunner selection
		this.taskRunner = (this.taskRunner || '').toLowerCase().trim();

		// Additional prompts may be required, based on selections
		if (this.includeBlog || this.includeGallery || this.includeEmail) {
			
			if (this.includeEmail) {
				prompts.config.push({
					name: 'mandrillAPI',
					message: '------------------------------------------------' +
						'\n    Please enter your Mandrill API Key (optional).' +
						'\n    See http://getlandmarkproject.com/guide/config/#mandrill for more info.' +
						'\n    ' +
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
				'\n    hosting. See http://getlandmarkproject.com/guide/config/#cloudinary for more info.' +
				'\n    ' +
				'\n    CloudinaryImage fields are used for all image uploads by default.' +
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
				'\n    See http://getlandmarkproject.com/docs/cms/configuration/#services-amazons3 for more information.' +
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
	
	if(this.taskRunner === 'grunt') {
		this.copy('Gruntfile.js');
	}
	
	if(this.taskRunner === 'gulp'){
		this.copy('gulpfile.js');
	}
	
};

LandmarkGenerator.prototype.models = function models() {

	var modelFiles = ['Location', 'Tour'],
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
	
	this.template('models/_User.js', 'models/'+this.userModel+'.js');
	
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
	
	this.copy('routes/views/tours.js');
	this.copy('routes/views/tour.js');
	
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
	this.copy('routes/api/tours.js');
	
};

LandmarkGenerator.prototype.templates = function templates() {
	
	if (this.viewEngine === 'hbs') {
		
		// Copy Handlebars Templates
		
		this.mkdir('templates');
		this.mkdir('templates/views');
		
		this.directory('templates/default-hbs/views/layouts', 'templates/views/layouts');
		this.directory('templates/default-hbs/views/helpers', 'templates/views/helpers');
		this.directory('templates/default-hbs/views/partials', 'templates/views/partials');
		
		
		this.copy('templates/default-hbs/views/index.hbs', 'templates/views/index.hbs');
		
		this.copy('templates/default-hbs/views/locations.hbs', 'templates/views/locations.hbs');
		this.copy('templates/default-hbs/views/location.hbs', 'templates/views/location.hbs');
		
		this.copy('templates/default-hbs/views/tours.hbs', 'templates/views/tours.hbs');
		this.copy('templates/default-hbs/views/tour.hbs', 'templates/views/tour.hbs');
		
		if (this.includeBlog) {
			this.copy('templates/default-hbs/views/blog.hbs', 'templates/views/blog.hbs');
			this.copy('templates/default-hbs/views/post.hbs', 'templates/views/post.hbs');
		}
		
		if (this.includeGallery) {
			this.copy('templates/default-hbs/views/gallery.hbs', 'templates/views/gallery.hbs');
		}
		
		if (this.includeEnquiries) {
			this.copy('templates/default-hbs/views/contact.hbs', 'templates/views/contact.hbs');
			if (this.includeEmail) {
				this.copy('templates/default-hbs/emails/enquiry-notification.hbs', 'templates/emails/enquiry-notification.hbs');
			}
		}
		
	} else {
		
		// Copy Jade/Swig Templates
		
		this.mkdir('templates');
		this.mkdir('templates/views');
		
		this.directory('templates/default-jade/layouts', 'templates/layouts');
		this.directory('templates/default-jade/mixins', 'templates/mixins');
		this.directory('templates/default-jade/views/errors', 'templates/views/errors');
		
		this.copy('templates/default-jade/views/index.jade', 'templates/views/index.jade');
		
		this.copy('templates/default-jade/views/locations.jade', 'templates/views/locations.jade');
		this.copy('templates/default-jade/views/location.jade', 'templates/views/location.jade');
		
		this.copy('templates/default-jade/views/tours.jade', 'templates/views/tours.jade');
		this.copy('templates/default-jade/views/tour.jade', 'templates/views/tour.jade');
		
		if (this.includeBlog) {
			this.copy('templates/default-jade/views/blog.jade', 'templates/views/blog.jade');
			this.copy('templates/default-jade/views/post.jade', 'templates/views/post.jade');
		}
		
		if (this.includeGallery) {
			this.copy('templates/default-jade/views/gallery.jade', 'templates/views/gallery.jade');
		}
		
		if (this.includeEnquiries) {
			this.copy('templates/default-jade/views/contact.jade', 'templates/views/contact.jade');
			if (this.includeEmail) {
				this.copy('templates/default-jade/emails/enquiry-notification.jade', 'templates/emails/enquiry-notification.jade');
			}
		}
	}
	
};

LandmarkGenerator.prototype.updates = function routes() {
	
	this.directory('updates');
	
};

LandmarkGenerator.prototype.files = function files() {
	
	this.directory('public');
	
};
