export function filterProducts(products, filters) {

    return products.filter(product => {
        // Safely get price from variants
        let price = 0;
        
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            price = parseFloat(product.variants[0].price) || 0;
        }

        // Apply max price filter
        if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
            if (price > filters.maxPrice) {
                console.log(`  ❌ ${product.title}: $${price} > max $${filters.maxPrice}`);
                return false;
            }
        }

        // Apply min price filter
        if (filters.minPrice !== undefined && filters.minPrice !== null) {
            if (price < filters.minPrice) {
                console.log(`  ❌ ${product.title}: $${price} < min $${filters.minPrice}`);
                return false;
            }
        }

        // Apply vendor filter
        if (
            filters.vendor &&
            !product.vendor?.toLowerCase().includes(filters.vendor.toLowerCase())
        ) {
            return false;
        }

        // Apply product type filter
        if (
            filters.productType &&
            !product.product_type?.toLowerCase().includes(filters.productType.toLowerCase())
        ) {
            return false;
        }

        console.log(`  ✅ ${product.title}: $${price}`);
        return true;

    });

}