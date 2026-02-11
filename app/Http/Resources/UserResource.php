<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roleModel ? $this->roleModel->slug : $this->role,
            'role_label' => $this->roleModel ? $this->roleModel->name : null,
            'permissions' => $this->getPermissions(),
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'region' => $this->region,
            'neighborhood' => $this->neighborhood,
            'postal_code' => $this->postal_code,
            'is_active' => $this->is_active,
            'avatar' => $this->avatar ? (str_starts_with($this->avatar, 'http') ? $this->avatar : asset('storage/'.$this->avatar)) : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
