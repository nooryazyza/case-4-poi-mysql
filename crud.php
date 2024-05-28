<?php

$mysqli = new mysqli("localhost", "root", "", "data_poi");

if ($mysqli->connect_error) {
    die("Koneksi ke database gagal: " . $mysqli->connect_error);
}

if ($_GET['method'] == 'create') {
    $lat = $_POST['latitude'];
    $long = $_POST['longitude'];
    $name = $_POST['nama'];
    $desc = $_POST['description'];
    $cat = $_POST['category'];
    $rate = $_POST['rating'];
    $contact = $_POST['contact'];

    $query = "INSERT INTO poi (latitude, longitude, nama, description, category, rating, contact) VALUES ('$lat', '$long', '$name', '$desc', '$cat', '$rate',  '$contact')";
    if ($mysqli->query($query) === true) {
        echo "Data POI berhasil disimpan";
    } else {
        echo "Error: " . $query . "<br>" . $mysqli->error;
    }
}
elseif ($_GET['method'] == 'read') {
    $query = "SELECT * FROM poi";
    $result = $mysqli->query($query);
    $poiData = array();
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $poiData[] = $row;
        }
    }
    echo json_encode($poiData);
}
elseif ($_GET['method'] == 'update') {
    $id = $_POST['id'];
    $lat = $_POST['latitude'];
    $long = $_POST['longitude'];
    $name = $_POST['nama'];
    $desc = $_POST['description'];
    $cat = $_POST['category'];
    $rate = $_POST['rating'];
    $contact = $_POST['contact'];

    $query = "UPDATE poi SET latitude=?, longitude=?, nama=?, description=?, category=?, rating=?, contact=? WHERE id=?";
    $stmt = $mysqli->prepare($query);

    $stmt->bind_param("ddsssssi", $lat, $long, $name, $desc, $cat, $rate, $contact, $id);

    if ($stmt->execute()) {
        echo "Data POI berhasil diupdate";
    } else {
        echo "Error: " . $query . "<br>" . $mysqli->error;
    }

    $stmt->close();
}
elseif ($_GET['method'] == 'delete') {
    $id = $_POST['id'];
    $query = "DELETE FROM poi WHERE id=?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error: " . $query . "<br>" . $mysqli->error;
    }
    $stmt->close();
}
$mysqli->close();