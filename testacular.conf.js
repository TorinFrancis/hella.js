// Testacular configuration
// Generated on Tue Feb 26 2013 12:30:06 GMT-0700 (MST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
	MOCHA,
	MOCHA_ADAPTER,
	REQUIRE,
	REQUIRE_ADAPTER,

	// libs required for test framework
	{pattern: 'node_modules/chai/chai.js', included: false},

	// put all libs in requirejs 'paths' config here (included: false)
	{pattern: 'lib/lodash.js', included: false},

	// all src and test modules (included: false)
	{pattern: 'src/hella/*.js', included: false},
	{pattern: 'src/hella/internal/*.js', included: false},
	{pattern: 'test/spec/hella/*.js', included: false},
	{pattern: 'test/spec/hella/shared/*.js', included: false},

	// test main require module last
	'test/runner.js'
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
