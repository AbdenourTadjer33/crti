<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function show()
    {
        return Inertia::render('Profile/show');
    }

    public function update(Request $request)
    {
        $request->validate([
            'firstName' => ['required', 'string', 'min:2', 'max:50'],
            'lastName' => ['required', 'string', 'min:2', 'max:50'],
            'email' => ['required', 'email'],
            'dob' => ['required', 'dob'],
            'sex' => ['required'],
        ]);

        DB::transaction(function () use ($request) {
            $this->user->fill([
                'first_name' => $request->input('firstName'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'sex' => $request->input('sex'),
                'dob' => $request->input('dob'),
            ]);

            if ($this->user->isDirty('email')) {
                $this->user->email_verified_at = null;
            }

            $this->user->save();
        });

        return redirect(route('profile.show'))->with('alert', [
            'status' => 'success',
            'message' => 'profil mis à jour avec succès'
        ]);
    }
}
