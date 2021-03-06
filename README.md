# Remarkable DocDown

Remarkable DocDown is a suite of extensions for [Remarkable](https://github.com/jonschlinkert/remarkable).

[![Build Status](https://travis-ci.org/livio/DocDown-JS.svg?branch=master)](https://travis-ci.org/livio/DocDown-JS)

## Platform Sections

Platform Sections allows for showing or hiding content sections based on which platform the documentation is being built for.

A platform section is delimited by `@![platform,section]` and `!@`. Section names are case insensitive and multiple
platform sections can be comma separated in the tag as shown above.

``` markdown
@![android]
hello world!
``` java
String test = "android";
```
!@
```

The configuration for the platform section is just `platform_section` as shown below. This is the section that will be
shown for that build and other sections will be hidden.

Example configuration:

``` javascript
{
    platform_section: {
        platform_section: 'Android'
    }
}
```

The above DocDown and configuration would produce the following HTML:

``` HTML
<p>hello world!</p>
<pre>
  <code class="language-java">
    String test = <span class="string">"android"</span>;
  </code>
</pre>
```

## Notes

Notes allows for calling out content in note like fashion.  The note type context is configurable through the options passed to the markdown extension.

A note block is delimited by three exclamation points. The beginning exclamation point also includes the note type.

``` markdown
!!! MUST
hello world!
!!!
```

Example configuration:

``` javascript
{
    note_blocks: {
        prefix: '<div class="{{ tag }}"><div class="icon">{% svg "{{{ svg }}}" %}<img class="icon--pdf" src="{% static "{{{ svg_path }}}" %}"></div><h5>{{ title }}</h5>',
        postfix: '</div>',
        tags: {
            must: {
                svg: 'standard/icon-must',
                svg_path: 'svg/standard/icon-must.svg',
                title: 'Must'
            },
            note: {
                svg: 'standard/icon-note',
                svg_path: 'svg/standard/icon-note.svg',
                title: 'Note'
            },
            may: {
                svg: 'standard/icon-may',
                svg_path: 'svg/standard/icon-may.svg',
                title: 'May'
            },
            sdl: {
                svg: 'standard/icon-sdl',
                svg_path: 'svg/standard/icon-sdl.svg',
                title: 'SDL'
            }
        }
    }
}
```

The prefix and postfix values are used to generate the HTML for around the note content.  These are [mustache template strings](https://mustache.github.io/). These prefix and postfix values are used for all note types.

Note types can be configured via the `tags` key which is a dictionary containing a context dictionary for each note type. The key for the note type should be all lower case. The context values provided in this dictionary are supplied to the mustache template string for rendering.  Each tag can optionally specify its own prefix and postfix template which overrides the prefix and postfix set at the parent level.

If the optional `default_tag` key is set and a note type which is not found in the `tags` key is specified, then
it will be treated as if the the default tag was used.

The above DocDown and configuration would produce the following HTML:

``` HTML
<div class="must">
    <div class="icon">
        {% svg "standard/icon-must" %}
        <img class="icon--pdf" src="{% static "svg/standard/icon-must.svg" %}">
    </div>
    <h5>Must</h5>
    <p>hello world!</p>
</div>
```

## Sequence Diagrams

Sequence diagrams allow for including diagram images that can be opened to be be separately vs be included directly in the HTML as a standard image.

A sequence diagram is bracketed by three pipes `|||` and the last line of the block should be a markdown image tag.  The alt title of this image can be left blank to default to `Sequence Diagram`, otherwise this will be used as the title for the sequence diagram block.

``` markdown
|||
Activate App
![Activate App Sequence Diagram](./assets/ActivateApp.png)
|||
```

``` javascript
{
    media_url: 'https://smartdevicelink.com/media/',
    sequence: {
        prefix: '<div class="visual-link-wrapper"><a href="#" data-src="{{{ image_url }}}" class="visual-link"><div class="visual-link__body"><div class="t-h6 visual-link__title">{{ title }}</div><p class="t-default">',
        postfix: '</p></div><div class="visual-link__link fx-wrapper fx-s-between fx-a-center"><span class="fc-theme">View Diagram</span><span class="icon">{% svg "standard/icon-visual" %}</span></div></a></div>\n<img class="visual-print-image" src="{{{ image_url }}}">',
    }
}
```

Similar to notes above, the configuration for the sequence diagrams has a `prefix` and `postfix` mustache template strings. The context will include `image_url` and `title` which come from the markdown image tag.  The markdown image tag is not rendered, only the content within the tag.  The image url is also updated to include the media url from the configuration.

``` html
<div class="visual-link-wrapper">
    <a href="#" data-src="https://smartdevicelink.com/media/assets/ActivateApp.png" class="visual-link">
        <div class="visual-link__body">
            <div class="t-h6 visual-link__title">Activate App Sequence Diagram</div>
            <p class="t-default">
                <p>Activate App</p>
            </p>
        </div>
        <div class="visual-link__link fx-wrapper fx-s-between fx-a-center">
            <span class="fc-theme">View Diagram</span>
            <span class="icon">{% svg "standard/icon-visual" %}</span>
        </div>
    </a>
</div>
<img class="visual-print-image" src="https://smartdevicelink.com/media/assets/ActivateApp.png">
```

## Include

The include DocDown tag allows for including code samples as well as CSV files into the markdown from separate files to allow for easier maintaining and multiple inclusions. CSV files are rendered as HTML tables, otherwise files are displayed as code blocks. The language is extracted from the file extension. The following extensions are supported by default, however, others can be easily configured via the `extension_map` option. If no mapping is found, the extension is used as the language.

* `json`
* `html`
* `css`
* `js`
* `m`
* `h`
* `txt`
* `swift`
* `cpp`
* `c`
* `java`

``` markdown
+++ test.json
```

where `test.json` contains:

``` json
{
    "test": "json",
    "asdf": true
}

```

Configuration includes a root directory which will be the top most directory that is searched.  The current directory to start the search from and the name of the assets directory which should contain the files.  If the file is not found in the current assets directory, the search continues up the file tree to the root directory.

``` javascript
{
    include: {
        root_dir: '/path/to/root/docs/',
        current_dir: '/path/to/root/docs/testing/asdf/',
        asset_dir_name: 'assets',
        extension_map: {jason: 'json'}
    }
}
```

``` html
<h1>JSON</h1>
<pre>
    <code class="language-json">{
        <span class="attr">"test"</span>:
        <span class="string">"json"</span>,
        <span class="attr">"asdf"</span>:
        <span class="literal">true</span>}
    </code>
</pre>
```

## Links

The Links DocDown extension allow for custom, pre-generated links to be reference from normal markdown link syntax. Via the configuration, a link map can be included which provides a dictionary of names to URLs. All the links are checked against this dictionary and if found in the dictionary, the URL provided in the dictionary replaces the URL in the markdown.

``` markdown
[this is a link](http://mobelux.com/)
[this is a link](to/nowhere)
[this is a link](to/nowhere#testhash)
```

``` javascript
{
    links: {
        link_map: {
            'to/nowhere': 'home/localhost',
        },
    }
}
```

``` html
<p><a href="http://mobelux.com/">this is a link</a></p>
<p><a href="home/localhost">this is a link</a></p>
<p><a href="home/localhost#testhash">this is a link</a></p>
```

## Media

The media DocDown extension just updates all images that do not start with `http` to use the configurable media URL.

``` markdown
![test image](http://mobelux.com/static/img/mobelux-mark.99537226e971.png)
![test image](assets/mobelux-mark.png)
![test image](./assets/mobelux-mark.png)
```

``` javascript
{
    media_url: 'https://smartdevicelink.com/media/'
}
```

``` html
<p><img src="http://mobelux.com/static/img/mobelux-mark.99537226e971.png" alt="test image"></p>
<p><img src="https://smartdevicelink.com/media/assets/mobelux-mark.png" alt="test image"></p>
<p><img src="https://smartdevicelink.com/media/assets/mobelux-mark.png" alt="test image"></p>
```


## Usage Example

``` JavaScript
var Remarkable = require('remarkable'),
    path       = require('path'),
    hljs       = require('highlight.js'),
    note_blocks = require('remarkable-docdown/note_blocks'),
    sequence   = require('remarkable-docdown/sequence'),
    include    = require('remarkable-docdown/include'),
    media      = require('remarkable-docdown/media'),
    links      = require('remarkable-docdown/links'),
    platform_section = require('remarkable-docdown/platform_section');

var md = new Remarkable({
    html:         true,        // Enable HTML tags in source
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed
    highlight: function (str, lang) {
        hljs.configure({classPrefix: ''});
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
    },
    platform_section: {
      platform_section: 'Android',
    }
    media_url: 'https://smartdevicelink.com/media/',
    links: {
        link_map: {
            'to/nowhere': 'home/localhost',
        },
    },
    sequence: {
        prefix: '<div class="visual-link-wrapper"><a href="#" data-src="{{{ image_url }}}" class="visual-link"><div class="visual-link__body"><div class="t-h6 visual-link__title">{{ title }}</div><p class="t-default">',
        postfix: '\n</p></div><div class="visual-link__link fx-wrapper fx-s-between fx-a-center"><span class="fc-theme">View Diagram</span><span class="icon">{% svg "standard/icon-visual" %}</span></div></a></div>\n<img class="visual-print-image" src="{{{ image_url }}}">',
    },
    note_blocks: {
        prefix: '<div class="{{ tag }}"><div class="icon">{% svg "{{{ svg }}}" %}<img class="icon--pdf" src="{% static "{{{ svg_path }}}" %}"></div><h5>{{ title }}</h5>',
        postfix: '\n</div>',
        default_tag: 'note',
        tags: {
            must: {
                svg: 'standard/icon-must',
                svg_path: 'svg/standard/icon-must.svg',
                title: 'Must'
            },
            note: {
                svg: 'standard/icon-note',
                svg_path: 'svg/standard/icon-note.svg',
                title: 'Note'
            },
            may: {
                svg: 'standard/icon-may',
                svg_path: 'svg/standard/icon-may.svg',
                title: 'May'
            },
            sdl: {
                svg: 'standard/icon-sdl',
                svg_path: 'svg/standard/icon-sdl.svg',
                title: 'SDL',
                prefix: '<div>Optional Prefix Override</div><div>',
                postfix: '<span>Optional Postfix Override</span></div>'
            }
        }
    },
    include: {
        root_dir: __dirname,
        current_dir: __dirname,
        asset_dir_name: 'assets',
        extension_map: {jason: 'json'}
    }
});

md.use(note_blocks).use(sequence).use(include).use(links).use(media).use(platform_section);

console.log(md.render('# Remarkable rulezz!\n\ntesting\nasdf\n\n!!! MUST\n## block of hmi\nthis is a _quick_ test\n!!!\nasdf'));
console.log(md.render('# Remarkable rulezz!\n\ntesting\nasdf\n\n|||\n# block of hmi\nthis is a _quick_ test\n![asdf title test](assests/test.jpg)\n|||'));
console.log(md.render('# Remarkable rulezz!\n\n+++ test.csv\n'));
console.log(md.render('# Remarkable rulezz!\n\n[this is a link](to/nowhere#testhash)\n'));
console.log(md.render('# Remarkable rulezz!\n\n![asdf title test](assests/test.jpg)\n'));
```


### Dependencies

* __csv-parse__: For parsing included CSV files and turning them into HTML tables
* __mustache__: For templating prefix and postfix HTML content blocks
