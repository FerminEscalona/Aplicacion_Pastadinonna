<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\transaction;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = transaction::class;
    
    public function definition(): array
    {
        return [
            "amount"=> $this->faker->numberBetween(1,8),
            "total"=> $this->faker->randomFloat(3,8900,400000),
            "id_cliente"=> $this->faker->randomNumber(1,1),
            "id_product"=> $this->faker->randomNumber(1,1),
        ];
    }
}
