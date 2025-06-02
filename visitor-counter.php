<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$countFile = 'visitor_count.txt';
$visitsFile = 'visitor_visits.txt';

function getVisitorCount() {
    global $countFile;
    if (file_exists($countFile)) {
        return (int)file_get_contents($countFile);
    }
    return 0;
}

function incrementVisitorCount() {
    global $countFile, $visitsFile;
    
    // Get current count
    $count = getVisitorCount();
    
    // Get visitor IP and timestamp
    $visitorIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $timestamp = date('Y-m-d H:i:s');
    $today = date('Y-m-d');
    
    // Check if visitor already counted today
    $dailyVisits = [];
    if (file_exists($visitsFile)) {
        $visits = file($visitsFile, FILE_IGNORE_NEW_LINES);
        foreach ($visits as $visit) {
            $visitData = explode('|', $visit);
            if (count($visitData) >= 3 && $visitData[2] === $today) {
                $dailyVisits[] = $visitData[0]; // Store IPs from today
            }
        }
    }
    
    // Only increment if IP hasn't visited today
    if (!in_array($visitorIP, $dailyVisits)) {
        $count++;
        
        // Save new count
        file_put_contents($countFile, $count);
        
        // Log visit
        $logEntry = $visitorIP . '|' . $timestamp . '|' . $today . "\n";
        file_put_contents($visitsFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    return $count;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment and return new count
    $count = incrementVisitorCount();
    echo json_encode(['count' => $count, 'action' => 'incremented']);
} else {
    // Just return current count
    $count = getVisitorCount();
    echo json_encode(['count' => $count, 'action' => 'retrieved']);
}
?>
