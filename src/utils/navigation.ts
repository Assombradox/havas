/**
 * Centralized Navigation Utility
 * Preserves Query Parameters (UTMs) across client-side navigation.
 */

export const MapsTo = (path: string) => {
    // 1. Capture current params
    const currentParams = window.location.search;

    // 2. Prepare destination path
    let finalPath = path;

    // 3. Append params if they exist (and destination doesn't have them)
    if (currentParams) {
        if (finalPath.includes('?')) {
            // If destination already has params, we append with & but avoid duplicates
            // This is a simple concatenation. Ideally we'd parse and merge, but for speed:
            // We assume navigation targets are clean (e.g. /product/slug)
            finalPath += '&' + currentParams.substring(1);
        } else {
            finalPath += currentParams;
        }
    }

    // 4. Perform Navigation
    window.history.pushState({}, '', finalPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
};
