import 'package:flutter/material.dart';
import '../models/restaurant.dart';
class RestaurantTile extends StatelessWidget {
  const RestaurantTile({super.key, required this.restaurant, required this.onTap});
  final Restaurant restaurant;
  final VoidCallback onTap;
  @override Widget build(BuildContext context) => Card(child: ListTile(title: Text(restaurant.name), subtitle: Text('${restaurant.description}\n${restaurant.address}'), isThreeLine: true, trailing: const Icon(Icons.chevron_right), onTap: onTap));
}
