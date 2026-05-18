import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/restaurant.dart';

class ApiService {
  ApiService({String? baseUrl}) : baseUrl = baseUrl ?? const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://10.0.2.2:3000/api');
  final String baseUrl;
  Future<List<Restaurant>> restaurants() async {
    final response = await http.get(Uri.parse('$baseUrl/restaurants'));
    if (response.statusCode >= 400) throw Exception(response.body);
    return (jsonDecode(response.body) as List<dynamic>).map((item) => Restaurant.fromJson(item)).toList();
  }
  Future<void> loginDemo() async {
    final response = await http.post(Uri.parse('$baseUrl/auth/login'), headers: {'Content-Type': 'application/json'}, body: jsonEncode({'email': 'customer@food.local', 'password': 'Customer@123456'}));
    if (response.statusCode >= 400) throw Exception(response.body);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', jsonDecode(response.body)['accessToken']);
  }
  Future<void> createOrder({required String restaurantId, required String address, required List<Map<String, dynamic>> items}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('accessToken');
    final response = await http.post(Uri.parse('$baseUrl/orders'), headers: {'Content-Type': 'application/json', if (token != null) 'Authorization': 'Bearer $token'}, body: jsonEncode({'restaurantId': restaurantId, 'deliveryAddress': address, 'items': items}));
    if (response.statusCode >= 400) throw Exception(response.body);
  }
}
