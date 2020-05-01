<template>
	<div id="app">
		<div class="container">
			<div class="loading" v-if="loading">
				<div class="lds-ripple">
					<div></div><div></div>
				</div>
			</div>
			<div class="search-box">
				<CoSearchInput
					v-model="searchQuery"
					placeholder="Search for your favorite Starships"
				/>
			</div>

			<div class="filter-bar">
				<div :class="['bookmarked', openBookmarkedData ? 'active': 'no-items']" @click.stop.prevent="filterBookmarked">
					<span class="star"> </span>
					<span v-if="bookmarkedLength >= 0" class="item-count">
						{{ bookmarkedLength }}
					</span>
				</div>
			</div>

			<div class="tag-nav-panel">
				<span
					v-for="(inside, tagindex) in filteredShips"
					:key="tagindex"
					class="tag-list"
				>
					<span
						class="tag-item"
						v-for="(tag, tagIn) in inside.tags"
						:key="tagIn"
						@click.stop.prevent="tagFilter()"
					>
						{{ tag }}
					</span>
				</span>
			</div>

			<div style="text-align:right">
				<strong>Total results: {{ filteredShips.length }}</strong>
			</div>

			<!-- starships all item -->
			<div class="list-wrapper">

				<span v-if="openBookmarkedData && noResults" class="no-result no-bookmarked-item">
					No results were found matching: {{ searchQuery }}
				</span>

				<CoListItem
					v-for="(starship, starshipIndex) in filteredShips"
					:key="starshipIndex"
					:title="starship.name"
					:model="starship.model"
					:manufacturer="starship.manufacturer"
					:crew="starship.crew"
					:passengers="starship.passengers"
					:starshipClass="starship.starship_class"
				>

					<span
						class="bookmark-btn"
						@click.stop.prevent="clickBookmarkShip(starship, starshipIndex)"
					>
						<span :class="['star', starship.isMarked ? 'marked': null]">
						</span>
					</span>

					<div slot="tag" class="tag-panel theme-material">
						<label for="tags">Post tags:</label>
						<tag-selector name="tags" @input="tagInput" v-model="starship.tags" placeholder="tags"/>
					</div>

				</CoListItem>
			</div>

		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import TagSelector from 'vue-tag-selector';
import CoListItem from './components/CoListItem.vue';
import CoSearchInput from './components/CoSearchInput.vue';
Vue.use(VueAxios, axios);

const STORAGE_KEY = 'bookmark-storage'

export default {
	name: 'app',
	components: {
		CoListItem,
		CoSearchInput,
		TagSelector
	},
	data() {
		return {
			url: 'https://swapi.dev/api/starships/?format=json',
			starships: [],
			bookmarkedData: [],
			taggedData: [],
			searchQuery: '',
			openBookmarkedData: false,
			openTaggedData: false,
			loading: false,
			tagsList: []
		}
	},
	methods: {
		loadStarships(apiUrl) {
			this.loading = true;
			Vue.axios.get(apiUrl)
				.then((response) => {
					if (response.data.next || response.data.previous) {
						if (response.data.next !== null) {
							this.loadStarships(response.data.next.replace(/^http:\/\//i, 'https://'));
						}
						this.starships.push(...response.data.results);
						this.loading = false;
					}
				})
				.catch(e=> {
					console.error(e)
					this.loading = false;
				})
		},
		clickBookmarkShip(ship, index) {

			// check for original index
			const curIndex = this.starships.findIndex(x => x.name === ship.name);

			// set bookmark value to original data
			if (this.starships[curIndex].isMarked === undefined ||
			!this.starships[curIndex].isMarked ) {
				Vue.set(this.starships[curIndex], 'isMarked', true)
			} else if (this.starships[curIndex].isMarked) {
				Vue.set(this.starships[curIndex], 'isMarked', false)
			}

			this.bookmarkedData = this.starships.filter(item => item.isMarked)
			// save to local storage
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.starships));
		},
		tagInput() {

			this.tagsList = this.starships.reduce((tagsArray, starship) => {
				if (starship.tags) tagsArray.push(starship.tags);
				return tagsArray;
			}, [])

			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.starships));
		},
		tagFilter() {
			this.openTaggedData = !this.openTaggedData;

			let tagValue = event.target.textContent;
			tagValue = tagValue.replace(/\s/g, '').toLowerCase();

			this.taggedData = this.starships.filter((item) => {
				if ( typeof item.tags !== 'undefined') {
					const storedTag = item.tags.toString().toLowerCase().replace(/\s/g, '');
					return (storedTag.indexOf(tagValue) >= 0);
				}
			});
		},
		filterBookmarked() {
			this.openBookmarkedData = !this.openBookmarkedData;

			if (this.openBookmarkedData) {
				this.bookmarkedData = this.starships.filter(item => item.isMarked)
			}
		}
	},
	mounted() {
		// if available load stored data
		if (localStorage.getItem(STORAGE_KEY)) {
			this.starships = JSON.parse(localStorage.getItem(STORAGE_KEY));
		} else {
			this.loadStarships(this.url)
		}
	},
	computed: {
		// supply filtered data for search result
		filteredShips() {
			let searchValue = this.searchQuery.toLowerCase();
			const searchResults = this.starships.filter((starship) => {
				let tagResults;
				if (starship.tags) tagResults = starship.tags.toString().match(searchValue);
				// check for matched items
				return starship.name.toLowerCase().match(searchValue) ||
				starship.model.toLowerCase().match(searchValue) ||
				starship.manufacturer.toLowerCase().match(searchValue) ||
				starship.starship_class.toLowerCase().match(searchValue) ||
				tagResults;
			});
			if (searchValue.length > 0) {
				return searchResults;
			} else if (this.openBookmarkedData) {
				return this.bookmarkedData;
			} else if (this.openTaggedData) {
				return this.taggedData;
			} else  {
				return searchResults;
			}
			/* cache: false,
			 // getter
			get: function () {
				return this.starships;
			},
			// setter
			set: function (newValue) {
				return this.starships = newValue
			} */
		},
		noResults() {
			if (this.searchQuery.length > 1 || this.bookmarkedData.length === 0) { return true;} else { return false; }
		},
		// get bookmarked items lenght
		bookmarkedLength() {
			return this.starships.filter(x => x.isMarked ).length;
		}
	},
	created () {
		document.title = "Starship Finder | Powered by SWAPI";
	}
}
</script>

<style lang="scss">

@import url('https://db.onlinewebfonts.com/c/1daa609fdca8da38e5bcbb12c2a987db?family=DINNextW01-Regular');

#app {
	font-family: 'DINNextW01-Regular', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	background-color: $color-black;
	min-height: 100vh;
	overflow: hidden;
	padding-top: 5%;
	position: relative;
	z-index: 2;

	&:before,
	&:after {
		position: fixed;
		content: '';
		width: 200px;
		top: 0;
		height: 100%;
		background-repeat: repeat-y;
		background-size: 100% auto;
		z-index: -1;
	}
	&:before {
		left: 0;
		background-position: left center;
		background-image: url('https://static-mh.content.disney.io/starwars/assets/background/bg_starsL-fd4661a3ccea.jpg');
	}
	&:after {
		right: 0;
		background-position: left center;
		background-image: url('https://static-mh.content.disney.io/starwars/assets/background/bg_starsR-655c85e404d4.jpg');
	}
	.container {
		max-width: 740px;
		margin: 0 auto;
		padding-left: 20px;
		padding-right: 20px;
	}
	.filter-bar {
		display: flex;
		justify-content: center;
		.bookmarked {
			padding: 5px;
			display: flex;
			border-radius: 50%;
			cursor: pointer;
			position: relative;
			border: 1px solid #fff;
			&.active  {
				background-color: $color-yellow;
				.star {
					background-color: $color-black;
				}
			}
			&.no-items {
				cursor: no-drop;
			}
			.item-count {
				position: absolute;
				background-color: #CE0100;
				color: #fff;
				font-weight: bold;
				height: 15px;
				width: 15px;
				right: -4px;
				top: -6px;
				padding-top: 1px;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				display: flex;
				border-radius: 50%;
				transition: opacity 0.3s ease-out;
			}
		}

	}
	.tag-nav-panel {
		display: flex;
		height: 100%;
		margin: 28px 0;
		justify-content: center;
		.tag-list {
			display: inline-block;
			.tag-item {
				cursor: pointer;
				padding: 4px;
				background: #292929;
				margin: 4px;
				border-radius: 2px;
				color: #fafafa;
			}
		}
	}

	.no-bookmarked-item {
		display: flex;
		justify-content: center;
		padding: 30px 0;
		font-size: 20px;
		font-weight: bold;
		color: #fff;
	}
	.bookmark-btn {
		cursor: pointer;
		height: 100%;
		display: flex;
		.star {
			&.marked {
				background-color: $color-yellow;
			}
		}
	}
	.tag-panel {
		margin-top: 10px;
		> label {
			text-transform: uppercase;
			color: $color-yellow;
			font-weight: 700;
		}
	}
}
</style>
