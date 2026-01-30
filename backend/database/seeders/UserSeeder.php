<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        \App\Models\User::create([
            'username' => 'admin',
            'email' => 'admin@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 1
        ]);

        // Consultant
        \App\Models\User::create([
            'username' => 'consultant',
            'email' => 'consultant@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 2
        ]);
        
        // Student
        \App\Models\User::create([
            'username' => 'student',
            'email' => 'student@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 3
        ]);
    }
}
