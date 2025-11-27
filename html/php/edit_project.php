<?php
session_start();
include "db.php";

if (!isset($_SESSION['user'])) {
    echo "Unauthorized";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $github = $_POST['github'] ?? '';
    $demo = $_POST['demo'] ?? '';
    $video = $_POST['video'] ?? '';

    $sql = "UPDATE projects SET title=?, description=?, github=?, demo=?, video=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $title, $description, $github, $demo, $video, $id);

    if ($stmt->execute()) {
        echo "Project edited successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
