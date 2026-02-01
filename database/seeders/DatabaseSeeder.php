<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Roles
        \App\Models\Role::firstOrCreate(['name' => 'Admin']);      // 1
        \App\Models\Role::firstOrCreate(['name' => 'Consultant']); // 2
        \App\Models\Role::firstOrCreate(['name' => 'Student']);    // 3

        // Create Admin User
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@probmax.com'],
            [
                'username' => 'admin',
                'password' => bcrypt('password'),
                'role_id' => 1
            ]
        );

        // Create Consultant User
        \App\Models\User::updateOrCreate(
            ['email' => 'dosen@probmax.com'],
            [
                'username' => 'dosen',
                'password' => bcrypt('password'),
                'role_id' => 2
            ]
        );

        // Create Student User
        \App\Models\User::updateOrCreate(
            ['email' => 'mahasiswa@probmax.com'],
            [
                'username' => 'mahasiswa',
                'password' => bcrypt('password'),
                'role_id' => 3
            ]
        );
    }
}
