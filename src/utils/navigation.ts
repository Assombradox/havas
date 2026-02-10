/**
 * Centralized Navigation Utility
 * Preserves Query Parameters (UTMs) across client-side navigation.
 */
export const MapsTo = (to: string) => {
    // 1. Captura os params atuais
    const currentParams = new URLSearchParams(window.location.search);
    // 2. Prepara a URL de destino
    const [path, toParamsString] = to.split('?');
    const toParams = new URLSearchParams(toParamsString);
    // 3. Mescla (Prioridade: Params Atuais > Params do Destino)
    currentParams.forEach((value, key) => {
        if (!toParams.has(key)) {
            toParams.set(key, value);
        }
    });
    const finalSearch = toParams.toString();
    const finalUrl = finalSearch ? `${path}?${finalSearch}` : path;
    // 4. Navega
    window.history.pushState({}, '', finalUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
};
