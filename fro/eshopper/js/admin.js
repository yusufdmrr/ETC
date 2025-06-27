const API = "https://etc-9ryn.onrender.com/api/v1/clean/admin";

function getToken() {
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  return match ? match[2] : null;
}

const headers = {
  headers: {
    Authorization: "Bearer " + getToken(),
  },
};

async function getAllOrders() {
  try {
    const res = await axios.post(`${API}/getAllOrders`, {}, headers);
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    res.data.forEach((order, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${order._id}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>${order.userId}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order._id}')">
            Detay
          </button>
        </td>
      `;
      orderList.appendChild(row);
    });
  } catch (err) {
    Swal.fire("Hata", "Siparişler getirilemedi", "error");
  }
}

async function viewOrderDetails(orderId) {
  try {
    const res = await axios.post(`${API}/getOrderById`, { orderId }, headers);
    const order = res.data;

    const modalBody = document.getElementById("orderDetailsBody");
    modalBody.innerHTML = `
      <p><strong>Sipariş ID:</strong> ${order._id}</p>
      <p><strong>Tarih:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Durum:</strong> ${order.status}</p>
      <p><strong>Toplam Tutar:</strong> ${order.totalPrice}₺</p>
      <p><strong>Ürünler:</strong></p>
      <ul>
        ${order.products.map(p => `<li>${p.name} - ${p.quantity} adet</li>`).join("")}
      </ul>
    `;

    const modal = new bootstrap.Modal(document.getElementById("orderDetailsModal"));
    modal.show();
  } catch (err) {
    Swal.fire("Hata", "Sipariş detayı alınamadı", "error");
  }
}

window.onload = () => {
  getAllOrders();
};
