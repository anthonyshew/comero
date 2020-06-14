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
    createTypes(typeDefs)
}