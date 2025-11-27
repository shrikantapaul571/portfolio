<?php
session_start();
include "db.php";

// Ensure only logged-in users can add projects
if (!isset($_SESSION['user'])) {
    echo "Unauthorized";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $github = $_POST['github'] ?? '';
    $demo = $_POST['demo'] ?? '';
    $video = $_POST['video'] ?? '';

    $sql = "INSERT INTO projects (title, description, github, demo, video)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $title, $description, $github, $demo, $video);

    if ($stmt->execute()) {
        echo "Project added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>