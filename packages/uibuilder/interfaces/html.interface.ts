export interface IScript {
    src: string;
    integrity?: string;
    crossorigin?: string;
}

export interface IStyleLink {
    href: string;
    integrity?: string;
    crossorigin?: string;
}

export interface IHead {
    css: Array<IStyleLink>
}

export interface IBody {
    scripts: Array<IScript>
}