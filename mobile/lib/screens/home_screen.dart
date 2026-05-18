import 'package:flutter/material.dart';
import '../models/menu_item.dart';
import '../models/restaurant.dart';
import '../services/api_service.dart';
import '../widgets/restaurant_tile.dart';

class HomeScreen extends StatefulWidget { const HomeScreen({super.key}); @override State<HomeScreen> createState() => _HomeScreenState(); }
class _HomeScreenState extends State<HomeScreen> {
  final ApiService api = ApiService();
  final Map<String, int> cart = {};
  Restaurant? selected;
  List<Restaurant> restaurants = [];
  bool loading = true;
  @override void initState() { super.initState(); _load(); }
  Future<void> _load() async { final data = await api.restaurants(); setState(() { restaurants = data; selected = data.isEmpty ? null : data.first; loading = false; }); }
  void _add(MenuItem item) => setState(() => cart[item.id] = (cart[item.id] ?? 0) + 1);
  Future<void> _checkout() async { await api.loginDemo(); await api.createOrder(restaurantId: selected!.id, address: '01 Nguyen Hue, Ho Chi Minh City', items: cart.entries.map((e) => {'menuItemId': e.key, 'quantity': e.value}).toList()); setState(cart.clear); if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đặt hàng thành công'))); }
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('FoodOnline'), backgroundColor: Colors.deepOrange), body: loading ? const Center(child: CircularProgressIndicator()) : ListView(padding: const EdgeInsets.all(16), children: [const Text('Nhà hàng', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)), ...restaurants.map((r) => RestaurantTile(restaurant: r, onTap: () => setState(() => selected = r))), if (selected != null) ...[const SizedBox(height: 24), Text('Menu ${selected!.name}', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)), ...selected!.menuItems.map((item) => Card(child: ListTile(title: Text(item.name), subtitle: Text(item.description), trailing: ElevatedButton(onPressed: () => _add(item), child: Text('${double.parse(item.price).toStringAsFixed(0)}đ'))))), FilledButton(onPressed: cart.isEmpty ? null : _checkout, child: Text('Đặt hàng (${cart.values.fold(0, (a, b) => a + b)} món)'))]]));
}
