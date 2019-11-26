<template>
	<input
		class="co-search-input"
		type="text"
		:value="value"
		@input="updateValue($event.target.value)"
	>
</template>

<script>
export default {
	name: 'CoSearchInput',
	props: {
		value: ''
	},
	methods: {
		updateValue(value) {
			this.$emit('input', value)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-search-input {
	display: block;
	width: 100%;
	margin: 40px 0;
	padding: 15px;
	font-size: 18px;
	border-radius: 5px;
	outline: 0;
	border: 0;
	transition: opacity .3s ease-in;
	background-color: #343434;
	color: #fff;
	opacity: 0.7;
	&:focus {
		opacity: 1;
	}

}
</style>