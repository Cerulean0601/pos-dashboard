export function isValidStr(value) {
    const str = String(value); // 轉換為字串，保留空白字符

    // 定義危險字符和關鍵字的正規表達式
    const sqlInjectionPattern = /['"();\-\-]|SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC/i;
    
    // 如果字串包含上述模式，則可能有 SQL 注入風險
    return !sqlInjectionPattern.test(str);
}
