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

async function loadUserData() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await axios.post(`${API}/getUserById`, { userId }, headers);

    const user = res.data;
    document.getElementById("name").value = user.name || "";
    document.getElementById("surname").value = user.surname || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";
  } catch {
    Swal.fire("Hata", "Kullanıcı bilgileri alınamadı", "error");
  }
}

document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const userId = localStorage.getItem("userId");
    const formData = {
      userId,
      name: document.getElementById("name").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
    };
    await axios.post(`${API}/updateUser`, formData, headers);
    Swal.fire("Başarılı", "Bilgiler güncellendi", "success");
  } catch {
    Swal.fire("Hata", "Güncelleme yapılamadı", "error");
  }
});

window.onload = () => {
  loadUserData();
};
