
<?php
// FILE: products.php
// This is a placeholder for your products page.

// Include the database connection and header
require_once __DIR__ . '/config/db_connect.php';
require_once __DIR__ . '/includes/header.php';

// --- Your PHP logic would go here ---
// Example: Fetch all products from the database
$products = [];
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}
?>

<!-- Your HTML content for the products page goes here -->
<h1>Products</h1>
<button>Add New Product</button>

<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Sale Price</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if (count($products) > 0): ?>
            <?php foreach ($products as $product): ?>
                <tr>
                    <td><?php echo htmlspecialchars($product['code']); ?></td>
                    <td><?php echo htmlspecialchars($product['name']); ?></td>
                    <td><?php echo htmlspecialchars($product['sale_price']); ?></td>
                    <td><a href="#">Edit</a> | <a href="#">Delete</a></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="4">No products found.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php
// Include the footer
require_once __DIR__ . '/includes/footer.php';

// Close the database connection
$conn->close();
?>
