<template>
	<div class="app">{{msg}}</div>
</template>

<script>
import Foo from './Foo';
	export default {
		/* Remove me! */
		name: 'test',
		injectableUrl: 'http://testurl.com',
		data() {
			return {
				msg: 'Hello Vue!',
			};
		},
		created: function() {
			// comment will be removed by minifier
			Vue.use(Vuex); // okay comment
		},
	};
</script>

<style>
.app {
	background-color: #eee;
}
</style>