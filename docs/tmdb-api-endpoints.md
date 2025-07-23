# Complete TMDB API Free Endpoints & Features

## 🎬 MOVIE ENDPOINTS

### Movie Lists
- `GET /movie/now_playing` - Currently playing in theaters
- `GET /movie/popular` - Popular movies
- `GET /movie/top_rated` - Top rated movies
- `GET /movie/upcoming` - Upcoming movie releases
- `GET /movie/latest` - Latest added movie

### Movie Details & Related Data
- `GET /movie/{movie_id}` - Movie details
- `GET /movie/{movie_id}/account_states` - User rating/favorite status
- `GET /movie/{movie_id}/alternative_titles` - Alternative titles
- `GET /movie/{movie_id}/changes` - Movie changes log
- `GET /movie/{movie_id}/credits` - Cast and crew
- `GET /movie/{movie_id}/external_ids` - IMDb, Facebook, Instagram IDs
- `GET /movie/{movie_id}/images` - Posters, backdrops, logos
- `GET /movie/{movie_id}/keywords` - Associated keywords
- `GET /movie/{movie_id}/lists` - Lists containing this movie
- `GET /movie/{movie_id}/recommendations` - Recommended movies
- `GET /movie/{movie_id}/release_dates` - Release dates by country
- `GET /movie/{movie_id}/reviews` - User reviews
- `GET /movie/{movie_id}/similar` - Similar movies
- `GET /movie/{movie_id}/translations` - Available translations
- `GET /movie/{movie_id}/videos` - Trailers, teasers, clips
- `GET /movie/{movie_id}/watch/providers` - Streaming/rental providers

### Movie User Actions
- `POST /movie/{movie_id}/rating` - Rate a movie
- `DELETE /movie/{movie_id}/rating` - Delete movie rating

## 📺 TV SERIES ENDPOINTS

### TV Lists
- `GET /tv/airing_today` - Shows airing today
- `GET /tv/on_the_air` - Currently airing shows
- `GET /tv/popular` - Popular TV shows
- `GET /tv/top_rated` - Top rated TV shows
- `GET /tv/latest` - Latest added TV show

### TV Series Details
- `GET /tv/{series_id}` - TV series details
- `GET /tv/{series_id}/account_states` - User rating/favorite status
- `GET /tv/{series_id}/aggregate_credits` - Combined cast/crew across all seasons
- `GET /tv/{series_id}/alternative_titles` - Alternative titles
- `GET /tv/{series_id}/changes` - TV series changes
- `GET /tv/{series_id}/content_ratings` - Age ratings by country
- `GET /tv/{series_id}/credits` - Cast and crew
- `GET /tv/{series_id}/episode_groups` - Episode groupings
- `GET /tv/{series_id}/external_ids` - External platform IDs
- `GET /tv/{series_id}/images` - Series images
- `GET /tv/{series_id}/keywords` - Associated keywords
- `GET /tv/{series_id}/lists` - Lists containing this show
- `GET /tv/{series_id}/recommendations` - Recommended shows
- `GET /tv/{series_id}/reviews` - User reviews
- `GET /tv/{series_id}/screened_theatrically` - Theatrical releases
- `GET /tv/{series_id}/similar` - Similar shows
- `GET /tv/{series_id}/translations` - Available translations
- `GET /tv/{series_id}/videos` - Trailers and clips
- `GET /tv/{series_id}/watch/providers` - Streaming providers

### TV Seasons
- `GET /tv/{series_id}/season/{season_number}` - Season details
- `GET /tv/{series_id}/season/{season_number}/account_states` - User ratings
- `GET /tv/{series_id}/season/{season_number}/aggregate_credits` - Season credits
- `GET /tv/{series_id}/season/{season_number}/changes` - Season changes
- `GET /tv/{series_id}/season/{season_number}/credits` - Season cast/crew
- `GET /tv/{series_id}/season/{season_number}/external_ids` - External IDs
- `GET /tv/{series_id}/season/{season_number}/images` - Season images
- `GET /tv/{series_id}/season/{season_number}/translations` - Translations
- `GET /tv/{series_id}/season/{season_number}/videos` - Season videos
- `GET /tv/{series_id}/season/{season_number}/watch/providers` - Watch providers

### TV Episodes
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}` - Episode details
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/account_states` - User ratings
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/changes` - Episode changes
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/credits` - Episode credits
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids` - External IDs
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/images` - Episode stills
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/translations` - Translations
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/videos` - Episode videos

### TV User Actions
- `POST /tv/{series_id}/rating` - Rate a TV show
- `DELETE /tv/{series_id}/rating` - Delete TV show rating
- `POST /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating` - Rate episode
- `DELETE /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating` - Delete episode rating

## 👥 PEOPLE ENDPOINTS

### People Lists
- `GET /person/popular` - Popular people
- `GET /person/latest` - Latest added person

### Person Details
- `GET /person/{person_id}` - Person details
- `GET /person/{person_id}/changes` - Person changes
- `GET /person/{person_id}/combined_credits` - All movie and TV credits
- `GET /person/{person_id}/external_ids` - External platform IDs
- `GET /person/{person_id}/images` - Person photos
- `GET /person/{person_id}/movie_credits` - Movie credits only
- `GET /person/{person_id}/tv_credits` - TV credits only
- `GET /person/{person_id}/tagged_images` - Images they're tagged in
- `GET /person/{person_id}/translations` - Available translations

## 🔍 SEARCH ENDPOINTS

- `GET /search/collection` - Search movie collections
- `GET /search/company` - Search companies
- `GET /search/keyword` - Search keywords
- `GET /search/movie` - Search movies
- `GET /search/multi` - Search movies, TV, people simultaneously
- `GET /search/person` - Search people
- `GET /search/tv` - Search TV shows

## 📈 TRENDING ENDPOINTS

- `GET /trending/all/{time_window}` - All trending (day/week)
- `GET /trending/movie/{time_window}` - Trending movies
- `GET /trending/person/{time_window}` - Trending people
- `GET /trending/tv/{time_window}` - Trending TV shows

## 🏢 COMPANY ENDPOINTS

- `GET /company/{company_id}` - Company details
- `GET /company/{company_id}/alternative_names` - Alternative names
- `GET /company/{company_id}/images` - Company logos

## 📚 COLLECTION ENDPOINTS

- `GET /collection/{collection_id}` - Collection details
- `GET /collection/{collection_id}/images` - Collection images
- `GET /collection/{collection_id}/translations` - Collection translations

## 🏷️ GENRE ENDPOINTS

- `GET /genre/movie/list` - Movie genres
- `GET /genre/tv/list` - TV genres

## 🔑 KEYWORD ENDPOINTS

- `GET /keyword/{keyword_id}` - Keyword details
- `GET /keyword/{keyword_id}/movies` - Movies with this keyword

## 📊 DISCOVER ENDPOINTS

- `GET /discover/movie` - Discover movies with filters
- `GET /discover/tv` - Discover TV shows with filters

## 👤 ACCOUNT ENDPOINTS (Requires Authentication)

### Favorites & Watchlist
- `GET /account/{account_id}/favorite/movies` - Favorite movies
- `GET /account/{account_id}/favorite/tv` - Favorite TV shows
- `GET /account/{account_id}/watchlist/movies` - Movie watchlist
- `GET /account/{account_id}/watchlist/tv` - TV watchlist
- `POST /account/{account_id}/favorite` - Add/remove from favorites
- `POST /account/{account_id}/watchlist` - Add/remove from watchlist

### Ratings
- `GET /account/{account_id}/rated/movies` - Rated movies
- `GET /account/{account_id}/rated/tv` - Rated TV shows
- `GET /account/{account_id}/rated/tv/episodes` - Rated episodes

### Lists
- `GET /account/{account_id}/lists` - User created lists

## 📝 REVIEW ENDPOINTS

- `GET /review/{review_id}` - Review details

## 🌐 NETWORK ENDPOINTS

- `GET /network/{network_id}` - Network details
- `GET /network/{network_id}/alternative_names` - Alternative names
- `GET /network/{network_id}/images` - Network logos

## ⚙️ CONFIGURATION ENDPOINTS

- `GET /configuration` - API configuration
- `GET /configuration/countries` - List of countries
- `GET /configuration/jobs` - List of jobs
- `GET /configuration/languages` - List of languages
- `GET /configuration/primary_translations` - Primary translations
- `GET /configuration/timezones` - List of timezones

## 📜 CERTIFICATION ENDPOINTS

- `GET /certification/movie/list` - Movie certifications
- `GET /certification/tv/list` - TV certifications

## 📺 WATCH PROVIDER ENDPOINTS

- `GET /watch/providers/regions` - Available regions
- `GET /watch/providers/movie` - Movie watch providers
- `GET /watch/providers/tv` - TV watch providers

## 🔍 FIND ENDPOINT

- `GET /find/{external_id}` - Find by external ID (IMDb, TVDB, etc.)

## 📋 LIST ENDPOINTS

- `GET /list/{list_id}` - List details
- `GET /list/{list_id}/item_status` - Check if item is in list
- `POST /list` - Create list
- `POST /list/{list_id}/add_item` - Add item to list
- `POST /list/{list_id}/remove_item` - Remove item from list
- `POST /list/{list_id}/clear` - Clear list
- `DELETE /list/{list_id}` - Delete list

## 🔐 AUTHENTICATION ENDPOINTS

- `GET /authentication/token/new` - Create request token
- `POST /authentication/session/new` - Create session
- `POST /authentication/session/convert/4` - Convert v4 token
- `POST /authentication/token/validate_with_login` - Login validation
- `DELETE /authentication/session` - Delete session
- `GET /authentication/guest_session/new` - Create guest session

## 🎲 ADDITIONAL FEATURES

### Images
- Multiple sizes available (w300, w500, w780, w1280, original)
- Posters, backdrops, profiles, logos, stills
- Vote average and vote count for images

### Videos
- Trailers, teasers, clips, behind the scenes
- YouTube and Vimeo integration
- Multiple video qualities

### External IDs
- IMDb, Facebook, Instagram, Twitter integration
- Cross-platform content discovery

### Localization
- 39+ languages supported
- Region-specific data (ratings, release dates)
- Translation support for most content

### Rate Limiting
- 40 requests per 10 seconds (free tier)
- No daily limits
- Caching recommended for production

## 💡 MISSED FEATURES YOU SHOULD CONSIDER

1. **Episode Groups** - For shows with special episode ordering
2. **Content Ratings** - Age ratings by country for TV shows
3. **Alternative Titles** - International titles for better search
4. **Watch Providers** - Where to stream/rent content
5. **Keywords** - Content tagging for better filtering
6. **Collections** - Movie franchises and series
7. **External IDs** - Social media and other platform links
8. **Reviews** - User-generated content
9. **Changes API** - Track daily updates
10. **Guest Sessions** - Allow ratings without full registration
11. **Aggregate Credits** - Combined cast/crew for TV shows
12. **Episode Groups** - Special episode ordering systems
13. **Tagged Images** - Photos where people are tagged
14. **Screened Theatrically** - TV shows that had theater releases
15. **Primary Translations** - Fallback language support