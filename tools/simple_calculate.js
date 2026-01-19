import { create, all } from 'mathjs';

export default async function simple_calculate(expression) {
    const math = create(all, {
        number: 'BigNumber',
        precision: 64
    });
    try {
        const result = math.evaluate(expression);
        return result.toString();
    } catch (error) {
        return `[ERROR] Invalid expression: ${error.message}`;
    }
}