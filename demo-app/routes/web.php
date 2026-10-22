<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'Welcome')->name('home');

Route::get('/profile', fn () => Inertia::modal('Profile', [
    'name' => 'Ada Lovelace',
    'bio' => '',
])->baseRoute('home'))->name('profile');

Route::put('/profile', function (Request $request) {
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'bio' => ['nullable', 'string', 'max:1000'],
    ]);

    return back();
})->name('profile.update');

Route::get('/nested', fn () => Inertia::modal('Nested')->baseRoute('home'))->name('nested');

Route::get('/pick', fn () => Inertia::modal('Pick')->baseRoute('home'))->name('pick');

Route::get('/stats', fn () => Inertia::modal('Stats', [
    'time' => now()->format('H:i:s.u'),
    'visits' => Inertia::defer(function () {
        usleep(1_000_000);

        return 42;
    }),
])->baseRoute('home'))->name('stats');

Route::get('/long', fn () => Inertia::modal('Long')->baseRoute('home'))->name('long');
