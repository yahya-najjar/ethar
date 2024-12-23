<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CharityOrganization;
use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = [
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => Category::query()->first()->id,
                'program_id' => null,
                'title' => 'مساعدة مرضى السرطان',
                'description' => 'تقديم الدعم المالي والعلاجي لمرضى السرطان المحتاجين.',
                'goal_amount' => 5000.00,
                'raised_amount' => 1500.00,
                'visits' => 100,
                'beneficiaries_goal' => 200,
                'beneficiaries_count' => 50,
                'status' => 'active',
                'city' => 'بيروت',
                'image' => $this->storeImage('frontend/assets/images/projects/med_kit.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => Category::query()->first()->id,
                'program_id' => null,
                'title' => 'ترميم المنازل للأسر الفقيرة',
                'description' => 'تمويل مشاريع ترميم المنازل لتحسين ظروف المعيشة.',
                'goal_amount' => 2000.00,
                'raised_amount' => 1000.00,
                'visits' => 23,
                'beneficiaries_goal' => 30,
                'beneficiaries_count' => 15,
                'status' => 'active',
                'city' => 'بيروت',
                'image' => $this->storeImage('frontend/assets/images/projects/house_fix.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'توفير المياه للمناطق النائية',
                'description' => 'إنشاء شبكات مياه للمناطق التي تعاني من نقص حاد في المياه.',
                'goal_amount' => 3000.00,
                'raised_amount' => 1200.00,
                'visits' => 924,
                'beneficiaries_goal' => 1000,
                'beneficiaries_count' => 500,
                'status' => 'active',
                'city' => 'صيدا',
                'image' => $this->storeImage('frontend/assets/images/projects/water.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'توزيع الطرود الغذائية',
                'description' => 'توزيع طرود غذائية تحتوي على المواد الأساسية للأسر المحتاجة.',
                'goal_amount' => 1000.00,
                'raised_amount' => 750.00,
                'visits' => 400,
                'beneficiaries_goal' => 500,
                'beneficiaries_count' => 300,
                'status' => 'active',
                'city' => 'صيدا',
                'image' => $this->storeImage('frontend/assets/images/projects/food.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'دعم الأيتام',
                'description' => 'توفير الدعم المالي والاجتماعي للأيتام لضمان مستقبل أفضل.',
                'goal_amount' => 4000.00,
                'raised_amount' => 2000.00,
                'visits' => 200,
                'beneficiaries_goal' => 150,
                'beneficiaries_count' => 100,
                'status' => 'active',
                'city' => 'طرابلس',
                'image' => $this->storeImage('frontend/assets/images/projects/aytam.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'خيام الايواء والاسكان',
                'description' => 'لاجئين ونازحين تضرروا من الكوارث والمصائب ويعانون من التنقل وعدم الاستقرار، ساهم بتوفير خيام الإيواء والسكن لهم من خلال تبرعك، وكنا عونًا لهم على أحمال الحياة.',
                'goal_amount' => 150000.00,
                'raised_amount' => 75449,
                'visits' => 12164,
                'beneficiaries_goal' => 1200,
                'beneficiaries_count' => 751,
                'status' => 'active',
                'city' => 'طرابلس',
                'image' => $this->storeImage('frontend/assets/images/projects/khyam.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'عمليات القلب والقسطرة للمحتاجين',
                'description' => 'فقراء بحاجة ماسة لإجراء عمليات قلب عاجلة، بتبرعك تساهم في حفظ حياتهم بعد الله، وتكن سببًا في عيشهم حياة صحية ومستقرة.',
                'goal_amount' => 150000.00,
                'raised_amount' => 75449,
                'visits' => 3529,
                'beneficiaries_goal' => 1200,
                'beneficiaries_count' => 751,
                'status' => 'active',
                'city' => 'طرابلس',
                'image' => $this->storeImage('frontend/assets/images/projects/heart.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'حفر آبار',
                'description' => 'قرى فقيرة بحاجة ماسة إلى مياه صالحة للشرب، ساهم بتبرعك في حفر آبار توفر لهم مياه صحية تقيهم من الأمراض وتقلل من انتشار الأوبئة.',
                'goal_amount' => 100000.00,
                'raised_amount' => 45642,
                'visits' => 3529,
                'beneficiaries_goal' => 2500,
                'beneficiaries_count' => 228,
                'status' => 'active',
                'city' => 'طرابلس',
                'image' => $this->storeImage('frontend/assets/images/projects/abar.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'charity_organization_id' => CharityOrganization::query()->first()->id,
                'category_id' => null,
                'program_id' => Program::query()->first()->id,
                'title' => 'الكسوة الشتوية للأسر المتعففة',
                'description' => 'يسعى المشروع إلى توفير قسائم شراء الكسوة الشتوية للأسر المتعففة، ساهم بتبرعك في كسوتها ومن تعول، لتفرج كربتها وتحيي أملها، قال رسول الله -ﷺ-:"كلُّ امرئٍ في ظلِّ صدَقتِه يومَ القيامةِ".',
                'goal_amount' => 100000,
                'raised_amount' => 28705,
                'visits' => 1614,
                'beneficiaries_goal' => 2500,
                'beneficiaries_count' => 228,
                'status' => 'active',
                'city' => 'طرابلس',
                'image' => $this->storeImage('frontend/assets/images/projects/winter.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('campaigns')->insert($campaigns);

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
        $newPath = 'campaign/' . basename($path);
        Storage::disk('public')->put($newPath, file_get_contents(public_path($path)));

        // Return the storage path
        return $newPath;
    }
}
