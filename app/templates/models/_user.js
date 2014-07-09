var landmark = require('landmark-serve'),
	Types = landmark.Field.Types;

/**
 * <%= userModel %> Model
 * ==========
 */

var <%= userModel %> = new landmark.List('<%= userModel %>');

<%= userModel %>.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Landmark', index: true }
});

// Provide access to Landmark
<%= userModel %>.schema.virtual('canAccessLandmark').get(function() {
	return this.isAdmin;
});

<% if (includeBlog) { %>
/**
 * Relationships
 */

<%= userModel %>.relationship({ ref: 'Post', path: 'author' });

<% } %>
/**
 * Registration
 */

<%= userModel %>.defaultColumns = 'name, email, isAdmin';
<%= userModel %>.register();
