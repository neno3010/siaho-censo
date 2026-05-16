<?php
// 1. Incluir la conexión a la base de datos local
include 'conexion.php';

// =========================================================================
// CONFIGURACIÓN: Pega aquí la URL del Webhook de tu Google Sheet (Make/Zapier)
// =========================================================================
$url_google_sheets = "https://script.google.com/macros/s/AKfycbwCL8Crbz3ln9Rxi9kOjf2F38M9IGpZa_fIlReOLIqfYWoMwR0SwinsXr3xK92ULGx5RQ/exec"; 
// =========================================================================


// FUNCIÓN EXTRACTORA DE DATOS (Inmune a asteriscos, tildes y espacios)
function extraer($etiqueta, $msg) {
    $lineas = explode("\n", $msg);
    foreach ($lineas as $linea) {
        if (strpos(strtolower($linea), strtolower($etiqueta)) !== false) {
            $partes = explode(':', $linea);
            if (count($partes) > 1) {
                return trim(str_replace(['*', '.'], '', implode(':', array_slice($partes, 1))));
            }
        }
    }
    return "No especificado";
}

// 2. Capturar el JSON crudo que envía UltraMsg
$json_raw = file_get_contents('php://input');
$data = json_decode($json_raw, true);

// Mensaje amigable si se entra desde el navegador
if (empty($json_raw)) {
    die("¡Servidor Activo con Tailscale! El webhook automático está esperando datos reales de WhatsApp.");
}

if ($data) {
    // 3. REENVIAR A GOOGLE SHEETS EN SEGUNDO PLANO (Inmediato)
    if (!empty($url_google_sheets) && $url_google_sheets !== "AQUÍ_PEGA_TU_URL_DE_MAKE_O_ZAPIER") {
        $ch = curl_init($url_google_sheets);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_raw);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Máximo 5 segundos de espera para no frenar el script
        curl_exec($ch);
        curl_close($ch);
    }

    // 4. CAPTURAR EL TEXTO DEL WHATSAPP PARA MYSQL
    $texto = "";
    if (isset($data['data']['body'])) { $texto = $data['data']['body']; }
    elseif (isset($data['body'])) { $texto = $data['body']; }
    elseif (isset($data['data']['text'])) { $texto = $data['data']['text']; }

    if (!empty($texto)) {
        // Mapeo de variables basado estrictamente en el formato de tu censo
        $cedula = extraer("Cedula", $texto);
        if ($cedula === "No especificado") { $cedula = extraer("Cédula", $texto); }
        
        // Si el mensaje tiene cédula, procedemos a guardar en phpMyAdmin
        if ($cedula !== "No especificado" && !empty($cedula)) {
            $municipio     = extraer("Municipio", $texto);
            $parroquia     = extraer("Parroquia", $texto);
            $comuna        = extraer("Comuna", $texto);
            $comunidad     = extraer("Comunidad", $texto);
            $nombre        = extraer("Nombre", $texto);
            $fecha_nac     = extraer("Fecha nacimiento", $texto);
            $sexo          = extraer("Sexo", $texto);
            $artesania     = extraer("Artesania", $texto);
            $especialidad  = extraer("Especialidad", $texto);
            $aprendio      = extraer("aprendió", $texto);
            $enfermedades  = extraer("Enfermedades que trata", $texto);
            $plantas       = extraer("Plantas o productos", $texto);
            $observaciones = extraer("Observaciones", $texto);

            // Consulta SQL estructurada para tu tabla 'especialistas'
            $sql = "INSERT INTO specialists 
                    (municipio, parroquia, comuna, comunidad, cedula, nombre, fecha_nacimiento, sexo, artesania, especialidad, de_quien_aprendio, enfermedades_que_trata, plantas_o_productos, observaciones) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)";
            
            $stmt = $conn->prepare($sql);
            if ($stmt !== false) {
                $stmt->bind_param("ssssssssssssss", $municipio, $parroquia, $comuna, $comunidad, $cedula, $nombre, $fecha_nac, $sexo, $artesania, $especialidad, $aprendio, $enfermedades, $plantas, $observaciones);
                $stmt->execute();
                $stmt->close();
            }
        }
    }
}

// Responder siempre OK a UltraMsg para cerrar la conexión exitosamente
echo "OK";
?>