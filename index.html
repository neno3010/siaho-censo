<?php include 'conexion.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Censo de Saberes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container my-5">
    <div class="card shadow-sm mb-4">
        <div class="card-body bg-dark text-white rounded-top">
            <h2 class="m-0">📊 Sistema de Registro: Saberes Ancestrales</h2>
        </div>
    </div>

    <div class="row mb-4 g-3">
        <div class="col-md-6">
            <input type="text" id="buscar" class="form-control" placeholder="🔍 Buscar por nombre o cédula...">
        </div>
        <div class="col-md-6">
            <select id="filtroEspecialidad" class="form-select">
                <option value="">Todas las Especialidades</option>
                <option value="Chaman">Chaman</option>
                <option value="Partera">Partera</option>
                <option value="Artesano">Artesano</option>
            </select>
        </div>
    </div>

    <div class="table-responsive card shadow-sm">
        <table class="table table-hover align-middle m-0">
            <thead class="table-secondary">
                <tr>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Municipio</th>
                    <th>Especialidad</th>
                    <th>Enfermedades que trata</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaEspecialistas">
                <?php
                $sql = "SELECT * FROM especialistas ORDER BY id DESC";
                $result = $conn->query($sql);
                
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td><b>{$row['cedula']}</b></td>";
                        echo "<td>{$row['nombre']}</td>";
                        echo "<td>{$row['municipio']}</td>";
                        echo "<td><span class='badge bg-info text-dark'>{$row['especialidad']}</span></td>";
                        echo "<td>{$row['enfermedades_que_trata']}</td>";
                        echo "<td><button class='btn btn-sm btn-outline-dark'>Ver Ficha</button></td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='6' class='text-center text-muted'>No hay registros procesados aún.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<script>
document.getElementById('buscar').addEventListener('keyup', function(){
    let value = this.value.toLowerCase();
    let rows = document.querySelectorAll('#tablaEspecialistas tr');
    
    rows.forEach(row => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(value) ? '' : 'none';
    });
});
</script>
<script>
// Registrar el Service Worker para habilitar la PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar el Service Worker', err));
    });
}
</script>
</body>
</html>