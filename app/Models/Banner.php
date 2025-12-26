<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'type',
        'image',
        'mobile_image',
        'link',
        'description',
        'position',
        'start_date',
        'end_date',
        'is_active',
        'display_duration',
        'sort_order',
        'button_text',
        'button_link',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_duration' => 'integer',
        'sort_order' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now());
            });
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByPosition($query, $position)
    {
        return $query->where('position', $position);
    }

    public function scopePopups($query)
    {
        return $query->where('type', 'popup');
    }
}
