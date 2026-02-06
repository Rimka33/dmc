<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Deprecated but kept for compatibility
        'role_id',
        'phone',
        'address',
        'city',
        'region',
        'neighborhood',
        'postal_code',
        'is_active',
        'avatar', // Added based on home controller usage
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relation: Rôle de l'utilisateur
     */
    public function roleModel()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Relation: Commandes de l'utilisateur
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Relation: Adresses de l'utilisateur
     */
    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    /**
     * Vérifier si l'utilisateur est admin
     */
    public function isAdmin(): bool
    {
        // Check old role column OR new role relationship
        if ($this->role === 'admin') {
            return true;
        }

        return $this->roleModel && $this->roleModel->slug === 'admin';
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    public function hasRole(string $slug): bool
    {
        return $this->roleModel && $this->roleModel->slug === $slug;
    }

    /**
     * Vérifier si l'utilisateur a une permission spécifique
     */
    public function hasPermission(string $permissionSlug): bool
    {
        if ($this->isAdmin()) {
            return true;
        } // Admin has all permissions

        if (! $this->roleModel) {
            return false;
        }

        return $this->roleModel->permissions()->where('slug', $permissionSlug)->exists();
    }

    /**
     * Obtenir toutes les permissions de l'utilisateur
     */
    public function getPermissions()
    {
        if (! $this->roleModel) {
            return collect();
        }

        return $this->roleModel->permissions->pluck('slug');
    }

    /**
     * Scope: Administrateurs uniquement
     */
    public function scopeAdmins($query)
    {
        return $query->whereHas('roleModel', function ($q) {
            $q->where('slug', 'admin');
        })->orWhere('role', 'admin');
    }

    /**
     * Scope: Clients uniquement
     */
    public function scopeCustomers($query)
    {
        return $query->whereHas('roleModel', function ($q) {
            $q->where('slug', 'customer');
        });
    }

    /**
     * Scope: Utilisateurs actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
