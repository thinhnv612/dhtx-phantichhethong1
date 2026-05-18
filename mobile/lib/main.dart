import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
void main() => runApp(const FoodOrderingApp());
class FoodOrderingApp extends StatelessWidget {
  const FoodOrderingApp({super.key});
  @override Widget build(BuildContext context) => MaterialApp(title: 'FoodOnline', theme: ThemeData(colorSchemeSeed: Colors.deepOrange, useMaterial3: true), home: const HomeScreen());
}
