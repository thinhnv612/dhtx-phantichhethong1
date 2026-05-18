import 'menu_item.dart';
class Restaurant {
  const Restaurant({required this.id, required this.name, required this.description, required this.address, required this.menuItems});
  final String id;
  final String name;
  final String description;
  final String address;
  final List<MenuItem> menuItems;
  factory Restaurant.fromJson(Map<String, dynamic> json) => Restaurant(id: json['id'], name: json['name'], description: json['description'], address: json['address'], menuItems: (json['menuItems'] as List<dynamic>? ?? []).map((item) => MenuItem.fromJson(item)).toList());
}
