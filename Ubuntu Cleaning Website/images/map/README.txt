Put a map image here if you want a static map on the contact page.

Filename suggestions:
- map.jpg (recommended)

How to use:
- If you prefer a static image map, add a JPG file named "map.jpg" to this folder and then open `contact.html` and replace the iframe with:
  <img src="images/map/map.jpg" alt="Map to our location" style="width:100%;height:auto;" />

How to use Google Maps embed:
- Open Google Maps, search for "Roodepoort", click Share -> Embed a map, copy the iframe `src` attribute and paste it into the iframe in `contact.html`.

Notes:
- The site expects JPG images per your request. If you have other formats, convert them to JPG before adding them here.
- If you prefer a static image instead of the iframe, take a screenshot of the map and save it as `map.jpg` in this folder. The contact page includes a `<noscript>` fallback that will show `images/map/map.jpg` when JS/iframe is blocked.
