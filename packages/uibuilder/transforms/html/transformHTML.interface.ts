export interface ITransformHTMLSemantics {
    components: ITransformHTMLComponentList;
}

export interface ITransformHTMLComponentList {
    [key: string]: ITransformHTMLComponent;
}

export interface ITransformHTMLComponent {
    tag: string;
    value?: any;
    attrs?: Array<ITransformHTMLComponentAttr>;
}

export interface ITransformHTMLComponentAttr {
    name: string;
    prop: string;
    prefix?: string;
    posfix?: string;
    method?: string;
    attrName?: string;
    template?: string;
}