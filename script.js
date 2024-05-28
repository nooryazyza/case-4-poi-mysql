$(document).ready(function () {
  var map = L.map("map").setView([-7.250445, 112.7456], 14);
  var newMarker = null;
  var poiData = [];

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", function (e) {
    if (newMarker) {
      map.removeLayer(newMarker);
    }

    newMarker = L.marker(e.latlng, { draggable: true }).addTo(map);

    var popup = L.popup().setLatLng(e.latlng).setContent(`
              <div class="popup-content">
                  <h4 class="mb-3">Tambah POI</h4>
                  <form id="formPoi">
                      <div class="row">
                        <div class="form-group col-md-6">
                          <label for="nama">Nama:</label>
                          <input type="text" class="form-control" id="nama" name="nama" required>
                        </div>
                        <div class="form-group col-md-6">
                          <label for="category">Kategori:</label>
                          <input type="text" class="form-control" id="category" name="category" required>
                        </div>
                        <div class="form-group col-6">
                            <label for="rating">Rating:</label>
                            <input type="number" class="form-control" id="rating" name="rating" min="0" max="5" step="0.1" required>
                        </div>
                        <div class="form-group col-6">
                            <label for="contact">Kontak:</label>
                            <input type="text" class="form-control" id="contact" name="contact">
                        </div>
                        <div class="form-group col-12">
                          <label for="description">Deskripsi:</label>
                          <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                        </div>
                      </div>
                      <div class="form-group text-center">
                          <button type="button" class="btn btn-warning mr-2" id="cancelBtn">Batal</button>
                          <button type="submit" class="btn btn-primary ml-2" id="saveBtn">Simpan</button>
                      </div>
                  </form>
              </div>
          `);

    newMarker.bindPopup(popup).openPopup();
  });

  $(document).on("click", "#cancelBtn", function () {
    map.removeLayer(newMarker);
  });

  $(document).on("submit", "#formPoi", function (e) {
    e.preventDefault();

    var formData = {
      latitude: newMarker.getLatLng().lat.toFixed(8),
      longitude: newMarker.getLatLng().lng.toFixed(8),
      nama: $("#nama").val(),
      description: $("#description").val(),
      category: $("#category").val(),
      rating: $("#rating").val(),
      contact: $("#contact").val(),
    };

    $.ajax({
      url: "crud.php?method=create",
      type: "POST",
      data: formData,
      success: function (response) {
        console.log(response);
        map.removeLayer(newMarker);
        getDataPOI();
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      },
    });
  });

  function getRatingStars(rating) {
    var stars = "";
    var yellowStars = Math.floor(rating);
    var greyStars = 5 - yellowStars;

    for (var i = 0; i < yellowStars; i++) {
      stars +=
        "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='gold'>" +
        "<path d='M12 2l3.09 6.26h6.31l-4.82 4.73 1.14 6.65L12 17.27l-5.72 3.37 1.14-6.65L2.6 8.26H8.9L12 2z'/>" +
        "</svg>";
    }

    for (var j = 0; j < greyStars; j++) {
      stars +=
        "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='grey'>" +
        "<path d='M12 2l3.09 6.26h6.31l-4.82 4.73 1.14 6.65L12 17.27l-5.72 3.37 1.14-6.65L2.6 8.26H8.9L12 2z'/>" +
        "</svg>";
    }

    return stars;
  }

  function openPopup(marker, popupContent) {
    marker.on("mouseover", function (e) {
      this.openPopup();
    });

    marker.on("mouseout", function (e) {
      this.closePopup();
    });
  }

  function getDataPOI() {
    $.ajax({
      url: "crud.php?method=read",
      type: "GET",
      dataType: "json",
      success: function (data) {
        poiData = data;
        console.log(poiData);
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        $.each(poiData, function (index, poi) {
          var marker = L.marker([poi.latitude, poi.longitude], {
            draggable: true,
          }).addTo(map);
          marker.poiId = poi.id;
          marker.on("dragend", function (e) {
            var updatedLatLng = e.target.getLatLng();
            showEditPopup(e.target, poi);
          });
          var popupContent =
            "<b>" +
            poi.nama +
            "</b><br>" +
            "Description: " +
            poi.description +
            "<br>" +
            "Rating: " +
            getRatingStars(poi.rating);
          marker.bindPopup(popupContent);

          openPopup(marker, popupContent);

          marker.on("contextmenu", function (e) {
            e.originalEvent.preventDefault();
            var popupConfirmation = document.createElement("div");
            popupConfirmation.classList.add("popup-confirmation");
            popupConfirmation.innerHTML = `
          <div class="popup-content">
              <p>Apakah Anda yakin ingin menghapus ${poi.nama}?</p>
              <button id="confirmDelete">Ya, hapus</button>
              <button id="cancelDelete">Batal</button>
          </div>
      `;

            document.body.appendChild(popupConfirmation);

            document
              .getElementById("cancelDelete")
              .addEventListener("click", function () {
                document.body.removeChild(popupConfirmation);
              });

            document
              .getElementById("confirmDelete")
              .addEventListener("click", function () {
                document.body.removeChild(popupConfirmation);

                $.ajax({
                  url: "crud.php?method=delete",
                  type: "POST",
                  data: { id: poi.id },
                  success: function (response) {
                    console.log(response);
                    if (response === "success") {
                      map.removeLayer(marker);
                      console.log("Delete berhasil.");
                    } else {
                      console.log("Delete gagal: " + response);
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                    console.log("Delete gagal: " + xhr.responseText);
                  },
                });
              });
          });

          marker.on("dragend", function (e) {
            var poi = poiData.find((poi) => poi.id === e.target.poiId);
            showEditPopup(e.target, poi);
          });

          function showEditPopup(marker, poi) {
            newMarker = marker;

            var popupEdit = L.popup().setLatLng(marker.getLatLng()).setContent(`
          <div class="popup-content">
              <h4 class="mb-3">Edit POI</h4>
              <form id="editformPoi">
                  <input type="hidden" id="editPoiId" value="${poi.id}">
                  <div class="row">
                  <div class="form-group col-6">
                      <label for="editNama">Nama:</label>
                      <input type="text" class="form-control" id="editNama" name="nama" value="${poi.nama}" required>
                  </div>
                  <div class="form-group col-6">
                    <label for="editCategory">Kategori:</label>
                    <input type="text" class="form-control" id="editCategory" name="category" value="${poi.category}" required>
                  </div>
                  <div class="form-group col-6">
                    <label for="editRating">Rating:</label>
                    <input type="number" class="form-control" id="editRating" name="rating" min="0" max="5" step="0.1" value="${poi.rating}" required>
                  </div>
                  <div class="form-group col-6">
                    <label for="editContact">Kontak:</label>
                    <input type="text" class="form-control" id="editContact" name="contact" value="${poi.contact}">
                  </div>
                  <div class="form-group col-12">
                      <label for="editDescription">Deskripsi:</label>
                      <textarea class="form-control" id="editDescription" name="description" rows="3" required>${poi.description}</textarea>
                  </div>
                  </div>
                  <div class="form-group text-center">
                      <button type="button" class="btn btn-warning mr-2" id="cancelEdit">Batal</button>
                      <button type="button" class="btn btn-primary ml-2" id="updatePoi">Update</button>
                  </div>
              </form>
          </div>
      `);

            popupEdit.openOn(map);

            $(document).on("click", "#cancelEdit", function () {
              map.closePopup();
            });

            $(document).on("click", "#updatePoi", function () {
              if (newMarker !== null) {
                var updatedData = {
                  id: $("#editPoiId").val(),
                  nama: $("#editNama").val(),
                  description: $("#editDescription").val(),
                  category: $("#editCategory").val(),
                  rating: $("#editRating").val(),
                  contact: $("#editContact").val(),
                  latitude: newMarker.getLatLng().lat.toFixed(8), // Ambil lokasi baru dari marker
                  longitude: newMarker.getLatLng().lng.toFixed(8),
                };

                $.ajax({
                  url: "crud.php?method=update",
                  type: "POST",
                  data: updatedData,
                  success: function (response) {
                    console.log(response);
                    getDataPOI();
                    map.closePopup();
                  },
                  error: function (xhr, status, error) {
                    console.error(xhr.responseText);
                  },
                });
              } else {
                console.error("newMarker is null");
              }
            });
          }
        });
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      },
    });
  }

  getDataPOI();
});
