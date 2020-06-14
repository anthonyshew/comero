exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions


    const typeDefs = `
    type MarkdownRemarkFrontmatter {
        frontMatter: Frontmatter
        specialSubtitle: String
        specialDescription: String
        specialTitle: String
        title: String
    }

    type Frontmatter {
        title: String
        sectionTitle: String
        orderPosition: String
        specialDescription: String
        specialSubtitle: String
        specialTitle: String
        menuSectionList: MenuSectionList
    }

    type MenuSectionList {
        favorite: String
        menuItem: String
        menuItemDescription: String
        menuItemImage: String
        menuItemPrice: String
        orderOptions: OrderOptions
    }

    type OrderOptions {
        orderOptionName: String
        orderOptionPriceChange: String
    }

    type MarkdownRemark {
        frontmatter: Frontmatter
    }

    type Frontmatter {
        title: String
        sectionTitle: String
        orderPosition: String
        specialDescription: String
        specialSubtitle: String
        specialTitle: String
        menuSectionList: [MenuSectionList]
    }

    type MenuSectionList {
        favorite: String
        menuItem: String
        menuItemDescription: String
        menuItemImage: String
        menuItemPrice: String
        orderOptions: [OrderOptions]
    }

    type OrderOptions {
        orderOptionName: String
        orderOptionPriceChange: String
    }
    `

    // const typeDefs = `
    // type MarkdownRemark implements Node {
    //     edges: [Edge]
    //     nodes: Nodes
    // }

    // type Nodes {
    //     frontmatter: Frontmatter
    // }

    // type Edge {
    //     node: InnerNode
    // }

    // type InnerNode {
    //     frontmatter: Frontmatter
    // }

    // type Frontmatter {
    //     title: String
    //     sectionTitle: String
    //     orderPosition: String
    //     specialDescription: String
    //     specialSubtitle: String
    //     specialTitle: String
    //     menuSectionList: MenuSectionList
    // }

    // type MenuSectionList {
    //     favorite: String
    //     menuItem: String
    //     menuItemDescription: String
    //     menuItemImage: String
    //     menuItemPrice: String
    //     orderOptions: OrderOptions
    // }

    // type OrderOptions {
    //     orderOptionName: String
    //     orderOptionPriceChange: String
    // }
    // `

    createTypes(typeDefs)
}