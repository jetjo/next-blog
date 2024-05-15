import { isEmpty, kebabCase } from 'lodash-es'

const extractText = children => {
    return children
        .map(child => {
            if (!isEmpty(child.value)) {
                return child.value
            } else if (child.children && child.children.length > 0) {
                return extractText(child.children)
            } else {
                return ''
            }
        })
        .join(' ')
}

const getDefaultId = children => {
    return formatDefaultId(extractText(children))
}

const formatDefaultId = value => {
    return kebabCase(value.replace(/\\s+/g, ' ').trim())
}

const setNodeId = (node, id) => {
    if (!node.data) node.data = {}
    if (!node.data.hProperties) node.data.hProperties = {}
    node.data.id = node.data.hProperties.id = id
}

export { extractText, getDefaultId, formatDefaultId, setNodeId }