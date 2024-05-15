// Register `hName`, `hProperties` types, used when turning markdown to HTML:
/// <reference types="mdast-util-to-hast" />
// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import { visit } from 'unist-util-visit'

// This plugin is an example to turn `::youtube` into iframes.
export function myRemarkYoutubeDirective() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @param {import('vfile').VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree, file) => {
    visit(tree, function (node) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'youtube') return

        // console.log(node, 'youtube node~~~~');
        const data = node.data || (node.data = {})
        const { id, si, width = 200, height = 200 } = node.attributes || {}
        const id_ = si ? `${id}?si=${si}` : id

        if (node.type === 'textDirective') {
          file.fail(
            'Unexpected `:youtube` text directive, use two colons for a leaf directive',
            node
          )
        }

        if (!id) {
          file.fail('Unexpected missing `id` on `youtube` directive', node)
        }

        data.hName = 'iframe'
        /**
         * ```html
         * <iframe
         *  width="560"
         *  height="315"
         *  src="https://www.youtube.com/embed/3eO8pon1-Xk?si=gZ3D1QndFLmBxfPJ"
         *  title="YouTube video player"
         *  frameborder="0"
         *  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         *  referrerpolicy="strict-origin-when-cross-origin"
         *  allowfullscreen>
         * </iframe>
         * ```
         */
        data.hProperties = {
          src: 'https://www.youtube.com/embed/' + id_,
          width,
          height,
          frameBorder: 0,
          allow: 'picture-in-picture',
          allowFullScreen: true
        }
      }
    })
  }
}
