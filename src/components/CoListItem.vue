<template>
	<div class="co-list-item">
		<div class="header-panel">
			<h4 class="item-title">
				{{ title }}
			</h4>
			<slot/>
		</div>
		<ul class="item-details">
			<li> <strong>Model:</strong> {{ model }} </li>
			<li> <strong>Manufacturer:</strong> {{ manufacturer }} </li>
			<li> <strong>Crew:</strong> {{ crew }} </li>
			<li> <strong>Passengers:</strong> {{ passengers }} </li>
			<li> <strong>Starship Class:</strong> {{ starshipClass }} </li>
		</ul>

		<slot name="tag"/>

	</div>
</template>

<script>
export default {
	name: 'CoListItem',
	props: {
		title: String,
		model: String,
		manufacturer: String,
		crew: String,
		passengers: String,
		starshipClass: String
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$transition-du-tf: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
$color-yellow: #FFE81A;

.co-list-item {
	padding: 20px;
	border-radius: 5px;
	margin: 20px 0;
	animation: slideIn $transition-du-tf;
	transition: $transition-du-tf;
	transition-property: transform, box-shadow;
	position: relative;
	color: #fff;
	overflow: hidden;
	z-index: 2;

	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	&:before {
		background-image: url('https://lumiere-a.akamaihd.net/v1/images/5dd80683ccf5060001791414-image_f4a3df0e.jpeg?region=0%2C0%2C1536%2C864');
		filter: blur(30px) grayscale(100%);
		z-index: -1;
	}
	&:after {
		background: linear-gradient(to bottom, rgba(26,26,26,0.75) 0%, #1a1a1a 95%);
		z-index: -1;
	}
	@keyframes slideIn {
		0% {
			opacity: 0;
			transform: translateY(-5%)
		} 100% {
			opacity: 1;
			transform: translateY(0)
		}
	}
	.header-panel {
		display: flex;
		justify-content: space-between;

		.item-title {
			font-weight: 900;
			font-size: 20px;
			margin-bottom: 10px;
			text-transform: uppercase;
		}
	}
	.item-details {
		display: block;
		padding: 0;
		margin: 0;
		li {
			line-height: 25px;
		}
	}
}

</style>
