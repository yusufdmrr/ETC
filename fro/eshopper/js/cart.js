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

function getUserId() {
  return localStorage.getItem("userId") || "guest";
}

async function addToCart(productId, quantity = 1) {
  try {
    const userId = getUserId();
    const res = await axios.post(`${API}/addToCart`, { userId, productId, quantity }, headers);
    Swal.fire("Başarılı", "Ürün sepete eklendi", "success");
  } catch (err) {
    Swal.fire("Hata", "Sepete eklenirken hata oluştu", "error");
  }
}

async function loadCart() {
  try {
    const userId = getUserId();
    const res = await axios.post(`${API}/getCartByUserId`, { userId }, headers);
    const cart = res.data;
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = "";

    let total = 0;
    for (const item of cart.products) {
      total += item.product.price * item.quantity;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>${item.product.price}₺</td>
        <td>${item.product.price * item.quantity}₺</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${item._id}')">Sil</button></td>
      `;
      cartList.appendChild(row);
    }
    document.getElementById("totalPrice").textContent = total + "₺";
  } catch {
    Swal.fire("Hata", "Sepet yüklenemedi", "error");
  }
}

async function removeFromCart(cartItemId) {
  try {
    await axios.post(`${API}/removeFromCart`, { cartItemId }, headers);
    await loadCart();
    Swal.fire("Başarılı", "Ürün sepetten silindi", "success");
  } catch {
    Swal.fire("Hata", "Silme işlemi başarısız", "error");
  }
}

window.onload = () => {
  if (document.getElementById("cartList")) {
    loadCart();
  }
};
