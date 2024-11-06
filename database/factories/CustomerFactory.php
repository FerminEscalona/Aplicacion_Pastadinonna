<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\customer;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = customer::class;
    
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'direction'=> $this->faker->address,
            'phone'=> $this->faker->phoneNumber,
        ];
    }
}
