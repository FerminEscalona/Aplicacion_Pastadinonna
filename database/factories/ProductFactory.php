<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\product;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = product::class;
    
    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence,
            'price'=> $this->faker->randomFloat(2, 0, 90000),
            'image'=> $this->faker->imageUrl(640, 480, 'food', true),
            'category'=> $this->faker->text(5),
        ];
    }
}
