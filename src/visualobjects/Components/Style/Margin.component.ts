import { Component } from "../../Types/Component.type";

export class Margin extends Component {
    //Matadata
    protected override __namespace = "Margin";
    protected override __label = "Margin / Padding";
    protected override __icon = "fa-solid fa-ruler";
    protected override __fixed = true;
    protected override __importable = false;

    public _margin: number;
    private __marginHelp = "https://www.w3schools.com/cssref/pr_margin.asp";
    private _marginChangeStyle = { style: "margin", styleVue: "margin" };

    public _padding: number;
    private __paddingHelp = "https://www.w3schools.com/cssref/pr_padding.asp";
    private _paddingChangeStyle = { style: "padding", styleVue: "padding" };

    //Margin
    public _marginTop: number;
    private __marginTopHelp = "https://www.w3schools.com/cssref/pr_margin-top.asp";
    private _marginTopChangeStyle = { style: "margin-top", styleVue: "margin-top" };

    public _marginLeft: number;
    private __marginLeftHelp = "https://www.w3schools.com/cssref/pr_margin-left.asp";
    private _marginLeftChangeStyle = { style: "margin-left", styleVue: "margin-left" };

    public _marginBottom: number;
    private __marginBottomHelp = "https://www.w3schools.com/cssref/pr_margin-bottom.asp";
    private _marginBottomChangeStyle = { style: "margin-bottom", styleVue: "margin-bottom" };

    public _marginRight: number;
    private __marginRightHelp = "https://www.w3schools.com/cssref/pr_margin-right.asp";
    private _marginRightChangeStyle = { style: "margin-right", styleVue: "margin-right" };

    //Padding
    public _paddingTop: number;
    private __paddingTopHelp = "https://www.w3schools.com/cssref/pr_padding-top.asp";
    private _paddingTopChangeStyle = { style: "padding-top", styleVue: "padding-top" };

    public _paddingLeft: number;
    private __paddingLeftHelp = "https://www.w3schools.com/cssref/pr_padding-left.asp";
    private _paddingLeftChangeStyle = { style: "padding-left", styleVue: "padding-left" };

    public _paddingBottom: number;
    private __paddingBottomHelp = "https://www.w3schools.com/cssref/pr_padding-bottom.asp";
    private _paddingBottomChangeStyle = { style: "padding-bottom", styleVue: "padding-bottom" };

    public _paddingRight: number;
    private __paddingRightHelp = "https://www.w3schools.com/cssref/pr_padding-right.asp";
    private _paddingRightChangeStyle = { style: "padding-right", styleVue: "padding-right" };
}