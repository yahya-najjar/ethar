<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $programs = [
            [
                'name' => 'التبرع بالدم',
                'slug' => 'blood',
                'icon' => $this->storeImage('frontend/assets/images/icon-blood.svg'),
                'image' => null,
                'description' => null,
                'slogan' => null,
            ],
            [
                'name' => 'غِراس',
                'slug' => 'gheras',
                'icon' => $this->storeImage('frontend/assets/images/icon-gheras.svg'),
                'image' => null,
                'description' => null,
                'slogan' => null,
            ],
            [
                'name' => 'الزكاة',
                'slug' => 'zakat',
                'icon' => $this->storeImage('frontend/assets/images/icon-zakat.svg'),
                'image' => $this->storeImage('frontend/assets/images/Tysrt.png'),
                'description' => null,
                'slogan' => 'إحسانك ييسّر حالًا',
            ],
            [
                'name' => 'هدية',
                'slug' => 'gift',
                'icon' => $this->storeImage('frontend/assets/images/icon-gift.svg'),
                'image' => null,
                'description' => null,
                'slogan' => null,
            ],
            [
                'name' => 'الأضاحي',
                'slug' => 'adahi',
                'icon' => $this->storeImage('frontend/assets/images/icon-adahi.svg'),
                'image' => null,
                'description' => null,
                'slogan' => null,
            ],
            [
                'name' => 'الحملات',
                'slug' => 'donation-campaign',
                'icon' => $this->storeImage('frontend/assets/images/icon-campaign.svg'),
                'image' => $this->storeImage('frontend/assets/images/camp2.web.png'),
                'description' => null,
                'slogan' => 'للمساهمة في جمع التبرعات',
            ],
            [
                'name' => 'التبرع الدوري',
                'slug' => 'periodic-donation',
                'icon' => $this->storeImage('frontend/assets/images/icon-periodic-donation.svg'),
                'image' => $this->storeImage('frontend/assets/images/Dawri2.web.png'),
                'description' => null,
                'slogan' => 'عطاءٌ منهمر, وخيرٌ مستمر',
            ],
            [
                'name' => 'التبرع بالرسائل',
                'slug' => 'sms-donation',
                'icon' => $this->storeImage('frontend/assets/images/icon-sms-5005.svg'),
                'image' => null,
                'description' => null,
                'slogan' => null,
            ],
            [
                'name' => 'تطهير الأسهم',
                'slug' => 'stocks-purification',
                'icon' => $this->storeImage('frontend/assets/images/icon-stocksPurification.svg'),
                'image' => $this->storeImage('frontend/assets/images/Housing2.web.png'),
                'description' => null,
                'slogan' => 'راحة واستقرار للمحتاجين',
            ],
        ];

        DB::table('programs')->insert($programs);
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
        $newPath = 'programs/' . basename($path);
        Storage::disk('public')->put($newPath, file_get_contents(public_path($path)));

        // Return the storage path
        return $newPath;
    }
}
