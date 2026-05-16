<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "censo_saberes";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
// Forzar UTF-8 para que no se rompan los acentos ni las Ñ
$conn->set_charset("utf8"); 
?>