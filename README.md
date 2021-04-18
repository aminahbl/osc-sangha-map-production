(Working draft)

# Sangha Map 
Developed for the [Open Sangha Collective](https://opensanghacollective.org/); useable by whomever.

## 💡 Initial Spec

> Creating a custom, growable google map that we can embed on the wordpress site that we and interested visitors to our site can gradually grow to be a thoroughly comprehensive map of monastic buddhist communities around the world. Just to give you the full picture we want users to be able to pin a site on but we want to be able to verify it before their addition becomes fixed / public. Hopefully that is possible. Also we would ideally be able to capture quite al ot of info about each place. Name, tradition, location, website, telephone, name of abbot, photos etc. What do you think? Doable?
>
> …
>
> this is the page it will go on:
>
> https://opensanghacollective.org/traditional-buddhist-communities/
>
> It really is about forging links between lay practice and the monastic sangha so I would say do not include a dharma centre where there is no monastic presence … But it is no problem if those boundaries are not strictly adhered to and tend towards including gray areas rather than excluding them. One thing that would be great is to make sure that we include a wide variety of of wats, viharas and temples across the lineages so zen, chan, son, thien, shingon, Tientai, vajrayana etc as well as a variety from within the theravada tradition (sri lankan, burmese, thai, laotion, cambodian etc). Another thing to consider is that we want some geographic spread across all the continents (though Antarctica may be tricky...).
>
>…
>
> we realised that for the map to help with our aim of helping people connect with the monastic Sangha one thing it would need would be a way of indicating whether each monastic community had confirmed with us that they accepted live in lay practitioners on a Dana basis. Could this be built in? I’m thinking a key or asterisk type thing to indicate this function has been confirmed.


## 🤔 Porject Plan Sketch:

- Build map with:
  - [Gatsby](https://www.gatsbyjs.com/)
  - [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)
  - [react-google-maps/api](https://react-google-maps-api-docs.netlify.app/)
- Collect & clean exisiting data
  - manual search
  - [Places APIs](https://developers.google.com/maps/documentation/places/web-service/overview)
- Host repo on GitHub
- Deploy to Netlify
- Embed with `iframe` 
- Rinse & repeat: data collection, clean, update & UI/UX development


### Place Inclusion Criteria

- The community follows [Vinaya](https://suttacentral.net/pitaka/vinaya) based ordination (see [intro to the Vinaya](https://suttacentral.net/vinaya)).
- By case by case assesment for boarder cases.

#### Verified property values:

- `"true"`
- `"tentative"`
- `"verified with lay residents"`
- `"false"`


### Working Data Schema

```
{   
  "properties": {
    "geometry": {
        "location": {
          longitude,
          latitude
        }
      },
      "name": "",
      "address": "",
      "telephone": "",
      "website": "",
      "description": "",
      "photos": [],
      "video": [],
      "audio": [],
      "tradition": ""
      "monastics": [],

  },
  "meta": {
      "verified": "false",
      "last_updated": ""
  }
}
```

### So Far:

- Working map built
- 3743 records taken from the Places API, of which:
- 1760 places marked as tentatively varified (places with "vihara", "monastery", "wat", "temple", or "hermitage" in the place name)

### Next Steps:

- Refine data
- WP intergration
- Image retrieval
- UI/UX improvement (search, full data display +)
- design contribution & maintanence strategy


<br>


## 🧐 What's inside the repo?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── public
    ├── src
    ├──├── TODO
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-config.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/public`**: TODO.

3.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

4.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

5.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.com/docs/gatsby-config/) for more detail).

7.  **`LICENSE`**: <span xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license"
     href="http://creativecommons.org/publicdomain/zero/1.0/">
    <img src="https://licensebuttons.net/p/zero/1.0/80x15.png" style="border-style: none;" alt="CC0" />
  </a>
  To the extent possible under law,
  <a rel="dct:publisher"
     href="https://github.com/aminahbl/osc-sangha-map-production">
    <span property="dct:title">OSC Mappers</span></a>
  has waived all copyright and related or neighboring rights to
  <span property="dct:title">Sangha Map</span>.
This work is published from:
<span property="vcard:Country" datatype="dct:ISO3166"
      content="GB" about="https://github.com/aminahbl/osc-sangha-map-production">
  United Kingdom</span>.
</span>

8. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

9. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

10. **`README.md`**: This page!


<!-- AUTO-GENERATED-CONTENT:END -->
