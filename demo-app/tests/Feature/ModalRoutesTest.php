<?php

use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => $this->withoutVite());

test('the home page renders', function () {
    $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Welcome'));
});

test('a modal route visited directly renders on its base route', function () {
    $this->get('/profile')->assertInertia(fn (Assert $page) => $page
        ->component('Welcome')
        ->where('_inertiaui_modal.component', 'Profile')
        ->where('_inertiaui_modal.props.name', 'Ada Lovelace'));
});

test('saving the profile validates and redirects back', function () {
    $this->from('/profile')->put('/profile', ['name' => ''])->assertSessionHasErrors('name');
    $this->from('/')->put('/profile', ['name' => 'Grace Hopper'])->assertRedirect('/');
});
