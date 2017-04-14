<template>
	<div class="app">{{msg}}</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				msg: 'Hello Vue!',
			};
		},
	};
</script>

<style>
.app {
	background-color: #eee;
}
</style>