<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CharitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name' => ' جمعية سند التعليمية',
                'description' => 'ملف جمعية سند التعليمية',
                'email' => 'info@sanadedu.lb',
                'phone' => '71819122',
                'website' => 'https://sanadedu.lb',
            ],
            [
                'name' => 'جمعية بالوالدين إحسانا برّكم',
                'description' => 'ملف جمعية بالوالدين إحسانا برّكم',
                'email' => 'info@parentber.lb',
                'phone' => '71819133',
                'website' => 'https://parentber.lb',
            ],
            [
                'name' => 'جمعية التنمية الأسرية بخميس مشيط (آمال)',
                'description' => 'ملف جمعية التنمية الأسرية بخميس مشيط (آمال)',
                'email' => 'info@amaal.lb',
                'phone' => '71819144',
                'website' => 'https://amaal.lb',
            ],
        ];

        DB::table('charity_organizations')->insert($categories);
    }

    /**
     * Store an image in the storage folder.
     *
     * @param string $path
     * @return string
     */
    private function storeImage(string $path): string
    {
        // Copy the file to the storage directory
        $newPath = 'categories/' . basename($path);
        Storage::disk('public')->put($newPath, file_get_contents(public_path($path)));

        // Return the storage path
        return $newPath;
    }
}
