<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $order->order_number }}</title>
    <style>
        body { font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif; font-size: 14px; color: #333; }
        .header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #d00000; float: left; }
        .invoice-details { text-align: right; float: right; }
        .clear { clear: both; }
        .client-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f9f9f9; padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">DMC</div>
        <div class="invoice-details">
            <strong>Facture #{{ $order->order_number }}</strong><br>
            Date: {{ $order->created_at->format('d/m/Y') }}<br>
            Statut: {{ ucfirst($order->payment_status) }}
        </div>
        <div class="clear"></div>
    </div>

    <div class="client-info">
        <h3>Facturé à :</h3>
        <strong>{{ $order->customer_name }}</strong><br>
        {{ $order->customer_email }}<br>
        {{ $order->customer_phone }}<br>
        {!! nl2br(e($order->shipping_address)) !!}
    </div>

    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product ? $item->product->name : 'Produit supprimé' }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->price, 0, ',', ' ') }} FCFA</td>
                <td>{{ number_format($item->price * $item->quantity, 0, ',', ' ') }} FCFA</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        <p>Sous-total: {{ number_format($order->subtotal, 0, ',', ' ') }} FCFA</p>
        @if($order->tax > 0)
        <p>Taxe: {{ number_format($order->tax, 0, ',', ' ') }} FCFA</p>
        @endif
        @if($order->shipping_cost > 0)
        <p>Livraison: {{ number_format($order->shipping_cost, 0, ',', ' ') }} FCFA</p>
        @endif
        @if($order->discount > 0)
        <p>Réduction: -{{ number_format($order->discount, 0, ',', ' ') }} FCFA</p>
        @endif
        <p style="font-size: 18px; color: #d00000;">TOTAL PAYÉ: {{ number_format($order->total, 0, ',', ' ') }} FCFA</p>
    </div>

    <div class="footer">
        DMC - Darou Mouhty Computer | Tel: +221 77 123 45 67 | Email: contact@dmc.sn
    </div>
</body>
</html>
