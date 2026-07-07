export function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

export function saveWishlist(product) {

    const wishlist = getWishlist();

    const exists = wishlist.find(item => item.id === product.id);

    if (!exists) {
        wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    return wishlist;
}

export function clearWishlist() {
    localStorage.removeItem("wishlist");
}