import assert from 'node:assert/strict';
import test from 'node:test';
import { ESLint } from 'eslint';

const eslint = new ESLint();
const lint = async (source) => (await eslint.lintText(source, { filePath: 'resources/js/pages/LintFixture.vue' }))[0];

test('parses TypeScript scripts and template expressions with the existing any exception', async () => {
    const result = await lint('<script setup lang="ts">const count: any = 1;</script><template>{{ (count as number).toFixed() }}</template>');
    assert.equal(result.errorCount, 0, JSON.stringify(result.messages));
});

test('reports unused TypeScript bindings inside Vue components', async () => {
    const result = await lint('<script setup lang="ts">const unused: string = "value";</script><template><div /></template>');
    assert.ok(result.messages.some((message) => message.ruleId === '@typescript-eslint/no-unused-vars' && message.severity === 2));
});

test('preserves the TypeScript script language requirement', async () => {
    const result = await lint('<script setup lang="js">const count = 1;</script><template>{{ count }}</template>');
    assert.ok(result.messages.some((message) => message.ruleId === 'vue/block-lang' && message.severity === 2));
});

test('keeps essential Vue template validation enabled', async () => {
    const result = await lint('<script setup lang="ts">const count = 1;</script><template><div id="a" id="b">{{ count }}</div></template>');
    assert.ok(result.messages.some((message) => message.ruleId === 'vue/no-duplicate-attributes' && message.severity === 2));
});
