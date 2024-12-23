<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('charity_organization_id');
            $table->foreignId('category_id')->nullable();
            $table->foreignId('program_id')->nullable();
            $table->string('title');
            $table->text('description');
            $table->decimal('goal_amount', 15);
            $table->decimal('raised_amount', 15)->nullable();
            $table->integer('visits')->default(0);
            $table->integer('beneficiaries_goal');
            $table->integer('beneficiaries_count')->default(0);
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->string('city')->nullable();
            $table->text('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('campaigns');
    }
};
