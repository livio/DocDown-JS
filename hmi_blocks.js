'use strict';

var Mustache = require('mustache');

var parser = function hmi_block_parser(state, startLine, endLine, silent) {
    var marker, len, tag, nextLine, mem, context,
        haveEndMarker = false,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine],
        options = state.options.hmi_block;

    if (pos + 3 > max) { return false; }

    marker = state.src.charCodeAt(pos);

    if (marker !== 0x21/* ! */) {
        return false;
    }

    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);

    len = pos - mem;

    if (len < 3) { return false; }

    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }

    tag = state.src.slice(pos, max).trim().toLowerCase();

    // search end of block
    nextLine = startLine;

    for (;;) {
        nextLine++;
        if (nextLine >= endLine) {
            // unclosed block should be autoclosed by end of document.
            // also block seems to be autoclosed by end of parent
            break;
        }

        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];

        if (state.src.charCodeAt(pos) !== marker) { continue; }

        pos = state.skipChars(pos, marker);

        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) { continue; }

        // make sure tail has spaces only
        pos = state.skipSpaces(pos);

        if (pos < max) { continue; }

        haveEndMarker = true;
        // found!
        break;
    }

    context = options.tags[tag] || {};
    context.tag = tag;

    if (! context.title) {
        context.title = tag;
    }

    state.tokens.push({
        type: 'htmltag',
        content: Mustache.render(options.prefix, context),
        level: state.level
    });

    state.parser.tokenize(state, startLine + 1, nextLine);

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    state.tokens.push({
        type: 'htmltag',
        content: Mustache.render(options.postfix, context),
        level: state.level
    });

    return true;
};

module.exports = function hmi_blocks(md, options) {
    md.block.ruler.before('code', 'hmi_blocks', parser, {alt: ['paragraph']});
}
