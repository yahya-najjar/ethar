<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CategorySeeder extends Seeder
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
                'name' => 'المشاريع',
                'slug' => 'projects',
                'image' => $this->storeImage('frontend/assets/images/icon-projects.svg'),
            ],
            [
                'name' => 'تيسرت',
                'slug' => 'tyassarat',
                'image' => $this->storeImage('frontend/assets/images/icon-taysrat.svg'),
            ],
            [
                'name' => 'فرجت',
                'slug' => 'forijat',
                'image' => $this->storeImage('frontend/assets/images/icon-forijat.svg'),
            ],
            [
                'name' => 'الكفارات',
                'slug' => 'subsidy',
                'image' => $this->storeImage('frontend/assets/images/icon-store.svg'),
            ],
            [
                'name' => 'الإغاثة',
                'slug' => 'rescue',
                'image' => $this->storeImage('frontend/assets/images/icon-eghatha.svg'),
            ],
        ];

        DB::table('categories')->insert($categories);
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
