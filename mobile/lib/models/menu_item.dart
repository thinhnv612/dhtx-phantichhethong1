class MenuItem {
  const MenuItem({required this.id, required this.name, required this.description, required this.price, required this.restaurantId});
  final String id;
  final String name;
  final String description;
  final String price;
  final String restaurantId;
  factory MenuItem.fromJson(Map<String, dynamic> json) => MenuItem(id: json['id'], name: json['name'], description: json['description'], price: json['price'], restaurantId: json['restaurantId']);
}
