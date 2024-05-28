<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Point of Interests</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap">
    <style>
        * {
            font-family: 'Poppins', sans-serif !important;
        }
        .popup-confirmation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 5px;
            z-index: 1000;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        header {
            background-color: #608cff;
            color: white;
            padding: 20px 0;
            text-align: center;
            font-size: 24px;
        }
        footer {
            background-color: #333;
            color: white;
            margin-top: 20px;
            padding: 10px 0;
            text-align: center;
            font-size: 14px;
            width: 100%;
            bottom: 0;
        }
        .content {
            padding: 20px;
            min-height: 80vh;
        }
        .container {
            width: 80%;
            margin: 0 auto;
        }
        .popup-content {
            width: 300px;
            text-align: center;
        }

        .popup-content p {
            margin-bottom: 15px;
        }

        .popup-content button {
            background-color: #ffc107;
            color: #fff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            margin-right: 10px;
        }

        .popup-content button:hover {
            background-color: #ffcd39;
        }

        .popup-content button:last-child {
            background-color: #4CAF50;
        }

        .popup-content button:last-child:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            Kelompok 7 Pemweb SI E - Point of Interests
        </div>
    </header>

    <div class="container mt-5">
        <div id="map" style="height: 80vh;"></div>
    </div>
    
    <footer>
        <div class="container">
            &copy; 2024 Point of Interests
        </div>
    </footer>
    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <!-- Custom JS -->
    <script src="script.js?v=1"></script>
</body>
</html>
