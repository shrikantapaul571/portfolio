<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: ../contact.php"); 
    exit;
}
include "db.php";

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: ../contact.php");
    exit;
}

// Handle delete
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $conn->query("DELETE FROM messages WHERE id = $id");
    header("Location: messages.php"); // refresh after delete
    exit;
}

$result = $conn->query("SELECT * FROM messages ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Messages</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    body { background:#1e1e1e; color:#fff; font-family:"Segoe UI",sans-serif; }
    .messages-container { max-width:800px; margin:auto; padding:20px; }
    .message-card {
      background:#2a2a2a; padding:15px; border-radius:8px; margin-bottom:15px;
      position: relative;
    }
    .message-card strong { color:#ff9800; }
    .delete-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      color: #f44336;
      font-size: 18px;
      cursor: pointer;
    }
    .delete-btn:hover { color: #ff0000; }
    .logout-btn {
      display:inline-block;
      background:#ff5722;
      color:#fff;
      padding:10px 20px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
      margin:20px auto;
    }
    .logout-btn:hover { background:#e64a19; }
  </style>
</head>
<body>
  <h2 style="text-align:center; color:#ff9800;">📩 Messages</h2>

  <div class="messages-container">
    <?php while($row = $result->fetch_assoc()): ?>
      <div class="message-card">
        <form method="GET" style="display:inline;">
          <input type="hidden" name="delete" value="<?= $row['id'] ?>">
          <button type="submit" class="delete-btn" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </form>
        <p><strong><?= htmlspecialchars($row['name']) ?></strong> 
        (<?= htmlspecialchars($row['email']) ?>)</p>
        <p><?= nl2br(htmlspecialchars($row['message'])) ?></p>
        <small style="color:#aaa;">Sent at <?= $row['created_at'] ?></small>
      </div>
    <?php endwhile; ?>

    <!-- 🔹 Logout Button -->
    <div style="text-align:center;">
      <a href="messages.php?logout=1" class="logout-btn">Logout</a>
    </div>
  </div>
</body>
</html>
