export function filterProducts(products, keyword) {

    keyword = keyword.toLowerCase();

    return products.filter(product => {

        return (
            product.title.toLowerCase().includes(keyword) ||
            product.body_html?.toLowerCase().includes(keyword) ||
            product.product_type?.toLowerCase().includes(keyword) ||
            product.vendor?.toLowerCase().includes(keyword)
        );

    });

}