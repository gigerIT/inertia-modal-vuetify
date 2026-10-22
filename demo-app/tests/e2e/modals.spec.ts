import { expect, test, type Page } from '@playwright/test';

const dialog = (page: Page) => page.locator('.v-overlay--active[role="dialog"]').last();

async function openModal(page: Page, label: string) {
    await page.goto('/');
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(dialog(page).locator('[data-inertiaui-modal-entered="true"]')).toBeVisible();
}

test('opens a routed modal and closes it with Escape', async ({ page }) => {
    await openModal(page, 'Modal');

    await expect(dialog(page)).toHaveAccessibleName('Profile');
    await expect(page).toHaveURL('/');
    await expect(page.locator('#app')).toHaveAttribute('aria-hidden', 'true');

    await page.keyboard.press('Escape');
    await expect(page.locator('.v-overlay')).toHaveCount(0);
    await expect(page.locator('#app')).not.toHaveAttribute('aria-hidden');
    await expect(page.getByRole('link', { name: 'Modal', exact: true })).toBeFocused();
});

test('shows validation errors inside the modal and closes after saving', async ({ page }) => {
    await openModal(page, 'Modal');
    const name = dialog(page).getByLabel('Name');

    await name.fill('');
    await dialog(page).getByRole('button', { name: 'Save' }).click();
    await expect(dialog(page)).toContainText('The name field is required.');

    await name.fill('Grace Hopper');
    await dialog(page).getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.v-overlay')).toHaveCount(0);
});

test('asks before discarding unsaved changes', async ({ page }) => {
    await openModal(page, 'Modal');
    await dialog(page).getByLabel('Name').fill('Changed');

    page.once('dialog', (confirm) => confirm.dismiss());
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeVisible();

    page.once('dialog', (confirm) => confirm.accept());
    await dialog(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('.v-overlay')).toHaveCount(0);
});

test('closes on backdrop click unless disabled', async ({ page }) => {
    await openModal(page, 'Slideover');
    await page.mouse.click(10, 300);
    await expect(page.locator('.v-overlay')).toHaveCount(0);

    await page.getByRole('link', { name: 'No outside close' }).click();
    await expect(dialog(page).locator('[data-inertiaui-modal-entered="true"]')).toBeVisible();
    await page.mouse.click(10, 300);
    await expect(dialog(page)).toBeVisible();
});

test('updates the URL in navigate mode and closes on back', async ({ page }) => {
    await openModal(page, 'Navigate');
    await expect(page).toHaveURL('/profile');

    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.locator('.v-overlay')).toHaveCount(0);
});

test('stacks nested modals and closes them one by one', async ({ page }) => {
    await openModal(page, 'Nested');
    await dialog(page).getByRole('link', { name: 'Open profile' }).click();
    await expect(page.locator('.v-overlay[aria-hidden="true"]')).toHaveCount(1);
    await expect(dialog(page)).toHaveAccessibleName('Profile');

    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveAccessibleName('Nested');
    await expect(dialog(page).getByRole('link', { name: 'Open profile' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('.v-overlay')).toHaveCount(0);
});

test('loads deferred props and reloads props', async ({ page }) => {
    await openModal(page, 'Stats');
    await expect(dialog(page).getByRole('progressbar')).toBeVisible();
    await expect(dialog(page)).toContainText('42 visits');

    const time = await dialog(page).locator('.time').textContent();
    await dialog(page).getByRole('button', { name: 'Refresh' }).click();
    await expect(dialog(page).locator('.time')).not.toHaveText(time!);
});

test('sends events from a nested modal to its parent', async ({ page }) => {
    await openModal(page, 'Nested');
    await dialog(page).getByRole('link', { name: 'Pick a color' }).click();
    await expect(dialog(page)).toHaveAccessibleName('Pick a color');

    await dialog(page).getByRole('button', { name: 'Blue' }).click();
    await expect(dialog(page)).toHaveAccessibleName('Nested');
    await expect(dialog(page)).toContainText('Picked Blue');
});

test('opens prefetched modals from the cache', async ({ page }) => {
    await page.goto('/');
    const requests: string[] = [];
    page.on('request', (request) => {
        if (new URL(request.url()).pathname === '/profile') requests.push(request.method());
    });

    await page.getByRole('link', { name: 'Prefetched', exact: true }).hover();
    await expect.poll(() => requests.length).toBe(1);

    await page.getByRole('link', { name: 'Prefetched', exact: true }).click();
    await expect(dialog(page)).toHaveAccessibleName('Profile');
    expect(requests).toHaveLength(1);
});

test('restores the URL after closing a prefetched modal in navigate mode', async ({ page }) => {
    await page.goto('/');
    const prefetched = page.waitForResponse((response) => new URL(response.url()).pathname === '/profile');
    await page.getByRole('link', { name: 'Prefetched navigate' }).hover();
    await prefetched;

    await page.getByRole('link', { name: 'Prefetched navigate' }).click();
    await expect(page).toHaveURL('/profile');

    await page.keyboard.press('Escape');
    await expect(page).toHaveURL('/');
});

test('renders a modal URL on top of its base route', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.getByRole('link', { name: 'Slideover', exact: true })).toBeAttached();
    await expect(dialog(page)).toHaveAccessibleName('Profile');
});

test('opens modals fullscreen on phones', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openModal(page, 'Modal');

    await expect(page.locator('.v-dialog--fullscreen')).toHaveCount(1);
});

test('server-renders the base page under a modal URL', async ({ request }) => {
    test.skip(!process.env.E2E_SSR, 'Needs the Inertia SSR server');

    const html = await (await request.get('/profile')).text();
    expect(html).toContain('v-application');
});
