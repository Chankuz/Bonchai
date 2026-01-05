<?php
session_start();
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบ']);
    exit;
}

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
$user_id = $_SESSION['user_id'];

switch ($action) {
    case 'toggle':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $tree_id = intval($data['tree_id'] ?? 0);

            if ($tree_id <= 0) {
                echo json_encode(['success' => false, 'message' => 'ข้อมูลไม่ถูกต้อง']);
                exit;
            }

            // Check if tree exists
            $stmt = $db->prepare("SELECT id FROM trees WHERE id = ?");
            $stmt->execute([$tree_id]);
            if (!$stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'ไม่พบข้อมูลต้นไม้']);
                exit;
            }

            // Check if already favorited
            $stmt = $db->prepare("SELECT id FROM favorites WHERE user_id = ? AND tree_id = ?");
            $stmt->execute([$user_id, $tree_id]);
            $existing = $stmt->fetch();

            if ($existing) {
                // Remove from favorites
                $stmt = $db->prepare("DELETE FROM favorites WHERE user_id = ? AND tree_id = ?");
                $stmt->execute([$user_id, $tree_id]);
                echo json_encode(['success' => true, 'is_favorite' => false, 'message' => 'ลบออกจากรายการโปรดแล้ว']);
            } else {
                // Add to favorites
                $stmt = $db->prepare("INSERT INTO favorites (user_id, tree_id) VALUES (?, ?)");
                $stmt->execute([$user_id, $tree_id]);
                echo json_encode(['success' => true, 'is_favorite' => true, 'message' => 'เพิ่มในรายการโปรดแล้ว']);
            }
        }
        break;

    case 'check':
        if ($method === 'GET') {
            $tree_id = intval($_GET['tree_id'] ?? 0);
            if ($tree_id <= 0) {
                echo json_encode(['success' => false, 'is_favorite' => false]);
                exit;
            }

            $stmt = $db->prepare("SELECT id FROM favorites WHERE user_id = ? AND tree_id = ?");
            $stmt->execute([$user_id, $tree_id]);
            $is_favorite = $stmt->fetch() ? true : false;
            echo json_encode(['success' => true, 'is_favorite' => $is_favorite]);
        }
        break;

    case 'list':
        if ($method === 'GET') {
            $stmt = $db->prepare("
                SELECT t.id, t.name, t.scientific_name, t.description, t.image_url 
                FROM trees t
                INNER JOIN favorites f ON t.id = f.tree_id
                WHERE f.user_id = ?
                ORDER BY f.created_at DESC
            ");
            $stmt->execute([$user_id]);
            $favorites = $stmt->fetchAll();
            echo json_encode(['success' => true, 'favorites' => $favorites]);
        }
        break;

    case 'check-multiple':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $tree_ids = $data['tree_ids'] ?? [];
            
            if (empty($tree_ids)) {
                echo json_encode(['success' => true, 'favorites' => []]);
                exit;
            }

            $placeholders = implode(',', array_fill(0, count($tree_ids), '?'));
            $stmt = $db->prepare("SELECT tree_id FROM favorites WHERE user_id = ? AND tree_id IN ($placeholders)");
            $stmt->execute(array_merge([$user_id], $tree_ids));
            $favorited_ids = array_column($stmt->fetchAll(), 'tree_id');
            echo json_encode(['success' => true, 'favorites' => $favorited_ids]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action not found']);
        break;
}

