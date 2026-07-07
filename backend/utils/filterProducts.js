export function filterProducts(products, filters) {

    return products.filter(product => {

        const price = parseFloat(product.variants?.[0]?.price || 0);

        if (filters.maxPrice && price > filters.maxPrice)
            return false;

        if (
            filters.vendor &&
            !product.vendor.toLowerCase().includes(filters.vendor.toLowerCase())
        )
            return false;

        if (
            filters.productType &&
            !product.product_type.toLowerCase().includes(filters.productType.toLowerCase())
        )
            return false;

        return true;

    });

}