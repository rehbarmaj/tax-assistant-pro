
<?php
// FILE: config/db_connect.php
// This is a sample database connection file.
// In a real application, you should use environment variables (.env file) for credentials.

$servername = "localhost"; // Or your database host
$username = "root";        // Your database username
$password = "";            // Your database password
$dbname = "tax_assistant_pro"; // The name of the database you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for full language support
$conn->set_charset("utf8mb4");

// You can include this file in your other PHP files like this:
// require_once __DIR__ . '/config/db_connect.php';
?>
