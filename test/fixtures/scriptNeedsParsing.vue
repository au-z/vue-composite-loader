<template>
	<div class="app">{{msg}}</div>
</template>

<script>
	import Foo from './Foo';
	export default {
		/* Remove me! */
		name: 'test',
		data() {
			return {
				msg: 'Hello Vue!',
			};
		},
		created: function() {
			// remove this too
			Vue.use(Vuex); // total no-no
		},
	};
</script>

<style>
.app {
	background-color: #eee;
}
</style>