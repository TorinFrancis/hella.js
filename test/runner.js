require({
	// !! Testacular serves files from '/base'
	baseUrl: '/base/lib',
	paths: {
		hella: '/base/src/hella',
		spec: '../test/spec',
		chai: '../node_modules/chai/chai'
	}
}, ['spec/hella/HellaObjectSpec', 'spec/hella/ClassSpec'], function() {
	window.__testacular__.start();
});