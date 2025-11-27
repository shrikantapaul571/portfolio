<?php
// session_start();
include "php/db.php";

// Handle contact form submission
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['send_message'])) {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $message = trim($_POST['message'] ?? '');

  if (!empty($name) && !empty($email) && !empty($message)) {
    $sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $message);
    $stmt->execute();
    $stmt->close();
    $success = "Message sent successfully!";
  } else {
    $error = "All fields are required.";
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Contact - Shrikanta</title>
  <link rel="stylesheet" href="../styles/navbar.css" />
  <link rel="stylesheet" href="../styles/contact.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>

<body>
  <header>
    <nav>
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="about.html">About Me</a></li>
        <li><a href="skills.html">Skills</a></li>
        <li><a href="projects.php">Projects</a></li>
        <li><a href="design.html">Graphics Design</a></li>
        <li><a href="research.html">Research & Publications</a></li>
        <li><a href="resume.html">Resume/CV</a></li>
        <li><a href="contact.php" class="active">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main class="contact-page">
    <h2>Get in Touch</h2>

    <?php if (isset($success))
      echo "<p class='msg-status msg-success'>$success</p>"; ?>
    <?php if (isset($error))
      echo "<p class='msg-status msg-error'>$error</p>"; ?>

    <form method="POST" class="contact-form">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required />

      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />

      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>

      <button type="submit" name="send_message">Send Message</button>
    </form>

    <div class="social-links">
      <h3>Or connect with me</h3>
      <a href="https://facebook.com/" target="_blank"><i class="fab fa-facebook"></i></a>
      <a href="https://linkedin.com/" target="_blank"><i class="fab fa-linkedin"></i></a>
    </div>
  </main>


  <!-- Floating Login Button -->
  <button class="login-btn" onclick="openModal('loginModal')"><i class="fas fa-user-lock"></i></button>

  <!-- Login Modal -->
  <div class="modal" id="loginModal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('loginModal')">&times;</span>
      <h3>Admin Login</h3>
      <form id="loginForm">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p id="loginError" style="color:red; display:none;">Invalid email or password.</p>
    </div>
  </div>

  <footer>
    <p>© 2025 Shrikanta Paul | All Rights Reserved</p>
    <div class="footer-socials">
      <a href="https://www.facebook.com/shrikanta571" target="_blank"><i class="fab fa-facebook-f"></i></a>
      <a href="https://linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
      <a href="https://github.com/shrikantapaul571" target="_blank"><i class="fab fa-github"></i></a>
    </div>
  </footer>

  <script>
    // Modal controls using .show class
    function openModal(id) {
      document.getElementById(id).classList.add("show");
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove("show");
    }

    // AJAX login
    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch("php/login.php", {
        method: "POST",
        body: formData
      })
        .then(res => res.text())
        .then(data => {
          if (data.trim() === "success") {
            window.location.href = "php/messages.php";
          } else {
            document.getElementById("loginError").style.display = "block";
          }
        })
        .catch(err => console.error(err));
    });
  </script>
</body>

</html>