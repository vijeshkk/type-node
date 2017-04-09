import * as ts from "typescript";
import { IOptions } from "../../lint";
import { RuleWalker } from "../walker/ruleWalker";
import { IRule, IDisabledInterval, RuleFailure } from "./rule";
export declare abstract class AbstractRule implements IRule {
    private value;
    private options;
    constructor(ruleName: string, value: any, disabledIntervals: IDisabledInterval[]);
    getOptions(): IOptions;
    abstract apply(sourceFile: ts.SourceFile): RuleFailure[];
    applyWithWalker(walker: RuleWalker): RuleFailure[];
    isEnabled(): boolean;
}
