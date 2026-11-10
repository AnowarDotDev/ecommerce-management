<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopOwnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage shop owners') ?? false;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        /** @var User $shopOwner */
        $shopOwner = $this->route('shop_owner');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($shopOwner)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];
    }
}
