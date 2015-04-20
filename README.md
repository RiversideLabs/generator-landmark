# Landmark Generator

A [Yeoman](http://yeoman.io) generator for [LandmarkJS](http://getlandmarkproject.com), the model-driven cms for node.js built on Express and MongoDB.

`yo landmark` will scaffold a new LandmarkJS project for you, and offer to set up blog, gallery, and enquiry (contact form) models + views.

## Getting Started

First up, you'll need Node.js >= 0.10.x and MongoDB >= 2.4.x installed. If you don't have them, follow the **Dependencies** instructions below.

Then, install the Landmark generator:

````
$ npm install -g generator-landmark
````

If you see errors, check the [problems](#err-please-try-running-this-command-again-as-rootadministrator) section below.

With the generator installed, create an empty directory for your new LandmarkJS Project, and run `yo landmark` in it:

````
$ mkdir myproject
$ cd myproject
$ yo landmark
````

The generator will ask you a few questions about which features to include, then prompt you for Cloudinary and Mandrill account details.

**These accounts are optional**, but Cloudinary is used to host the images for the blog and gallery templates. You can get a free account for each at:

* [Cloudinary](https://cloudinary.com/users/register/free) - Image serving and management in the cloud
* [Mandrill](https://mandrill.com/signup/) - Transactional email service by [Mailchimp](http://mailchimp.com)

### What next?

When you've got your new project, check out the [LandmarkJS Documentation](http://getlandmarkproject.com/docs/cms) to learn more about how to get started with LandmarkJS.

## Problems?

### ERR! Please try running this command again as root/Administrator.

When running `npm install -g generator-landmark`, you may get an **EACCES** error asking you to run the command again as root/Administrator. This indicates that there is a permissions issue.

On your development system you can change directory ownership to the current $USER so you do not have to run `sudo` while installing untrusted code:

````
sudo chown -R $USER /usr/local

# Other directories may be required depending on your O/S
sudo chown -R $USER /usr/lib/node_modules/
````

For a production/shared environment you may wish to re-run the `npm` command with the `sudo` prefix:

````
sudo npm install -g generator-landmark
````

For more information, see the ["What, no sudo?"](http://foohack.com/2010/08/intro-to-npm/#what_no_sudo) of the Intro to npm by Isaac Schulueter.

### What do you mean it couldn't find my Database?

By default, LandmarkJS will look for a MongoDB server running on `localhost` on the default port, and connect to it. If you're getting errors related to the MongoDB connection, make sure your MongoDB server is running.

If you haven't installed MongoDB yet, follow the instructions below.

To connect to a server **other** than `localhost`, add a `MONGO_URI` setting to the `.env` file in your Landmark project directory:

````
MONGO_URI=mongodb://your-server/database-name
````


## Dependencies

### Install Node.js

Download and install the node.js binaries for your platform from the [Node.js download page](http://nodejs.org/download/).

### Install MongoDB

If you're on a mac, the easiest way to install MongoDB is to use the [homebrew package manager for OS X](http://brew.sh/). To install it, run this in your terminal:

````
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
````

With Homebrew installed, run this in your terminal to download and install MongoDB:

````
brew mongo
````

For other platforms, see the [MongoDB installation guides](http://docs.mongodb.org/manual/installation/).


## Notice

The activity which is the subject of this mobile device application
and shareware has been financed in part with Federal funds from the
National Park Service, Department of the Interior, through the
California Office of Historic Preservation. However, the contents
and opinions do not necessarily reflect the views or policies of the
Department of the Interior or the California Office of Historic
Preservation, nor does mention of trade names or commercial products
constitute endorsement or recommendation by the Department of the
Interior or the California Office of Historic Preservation.
 
This program receives Federal financial assistance for identification
and protection of historic properties. Under Title VI of the Civil
Rights Act of 1964, Section 504 of the Rehabilitation Act of 1973,
and the Age Discrimination Act of 1975, as amended, the U.S.
Department of the Interior prohibits discrimination on the basis of
race, color, national origin, disability, or age in its federally
assisted programs. If you believe you have been discriminated against
in any program, activity, or facility as described above, or if you
desire further information, please write to:

Office of Equal Opportunity
National Park Service
1849 C Street, N.W.
Washington, D.C. 20240


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
