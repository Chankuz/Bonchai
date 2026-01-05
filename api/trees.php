<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT id, name, scientific_name, description, image_url FROM trees ORDER BY id ASC");
            $trees = $stmt->fetchAll();
            echo json_encode(['success' => true, 'trees' => $trees]);
        }
        break;

    case 'get':
        if ($method === 'GET') {
            $id = $_GET['id'] ?? 0;
            $stmt = $db->prepare("SELECT * FROM trees WHERE id = ?");
            $stmt->execute([$id]);
            $tree = $stmt->fetch();

            if ($tree) {
                echo json_encode(['success' => true, 'tree' => $tree]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'ไม่พบข้อมูลต้นไม้']);
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action not found']);
        break;
}

