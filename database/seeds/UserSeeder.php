<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id' => '410006e1-ca4e-4502-a9ec-e54d922d2c00',
            'username' => 'Supervisor',
            'name' => 'Supervisor',
            'password' => Hash::make('Supervisor'),
        ]);
    }
}
