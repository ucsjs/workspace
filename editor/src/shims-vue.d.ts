/* eslint-disable */
declare module '*.vue' {
    import type Vue, { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default Vue;
}