require({
	baseUrl: '/base/lib',
	paths: {
		hella: '/base/src/hella',
		spec: '../test/spec',
		chai: '../node_modules/chai/chai'
	}
}, [
	'spec/hella/HellaObjectSpec',
	'spec/hella/ClassSpec',
	'spec/hella/ModuleSpec',
	'spec/hella/SingletonSpec'
], function() {
	window.__testacular__.start();
});