class UserModel {
  final String? id;
  final String firstName;
  final String lastName;
  final int age;
  final String sex;
  final bool hasChronicDisease;
  final String? chronicDiseaseName;
  final String chifaNumber;
  final String email;
  final String password;
  final String role;

  UserModel({
    this.id,
    required this.firstName,
    required this.lastName,
    required this.age,
    required this.sex,
    required this.hasChronicDisease,
    this.chronicDiseaseName,
    required this.chifaNumber,
    required this.email,
    required this.password,
    this.role = 'patient',
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'age': age,
      'sex': sex,
      'hasChronicDisease': hasChronicDisease,
      'chronicDiseaseName': chronicDiseaseName,
      'chifaNumber': chifaNumber,
      'email': email,
      'password': password,
      'role': role,
    };
  }

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id']?.toString(),
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      age: map['age'] ?? 0,
      sex: map['sex'] ?? 'Male',
      hasChronicDisease: map['hasChronicDisease'] ?? false,
      chronicDiseaseName: map['chronicDiseaseName'],
      chifaNumber: map['chifaNumber'] ?? '',
      email: map['email'] ?? '',
      password: map['password'] ?? '',
      role: map['role'] ?? 'patient',
    );
  }

  factory UserModel.fromApi(Map<String, dynamic> map) {
    return UserModel(
      id: map['id']?.toString(),
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      age: map['age'] ?? 0,
      sex: map['sex'] ?? 'Male',
      hasChronicDisease: map['hasChronicDisease'] ?? false,
      chronicDiseaseName: map['chronicDiseaseName'],
      chifaNumber: map['chifaNumber'] ?? '',
      email: map['email'] ?? '',
      password: '',
      role: map['role'] ?? 'patient',
    );
  }

  Map<String, dynamic> toSignupPayload() {
    return {
      'role': role,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'phoneNumber': '',
      'age': age,
      'sex': sex,
      'hasChronicDisease': hasChronicDisease,
      'chronicDiseaseName': chronicDiseaseName,
      'chifaNumber': chifaNumber,
    };
  }

  String getFullName() => '$firstName $lastName';
}
