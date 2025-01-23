function redirectToPage(url, openInNewTab = false) {
  if (openInNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
}

function deleteUser() {
  fetch(`/api/deleteUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/api/signOut";
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data && data.error) {
        alert(`Ошибка: ${data.error}`);
      }
    })
    .catch((err) => {
      console.error("Ошибка при удалении пользователя:", err);
    });
}

function deleteLogic(id, type) {
  fetch(`/api/${type}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      window.location.href = `/${type}s?error=true`;
    })
    .catch((error) => {
      console.log("Ошибка при удалении: ", error.message);
    });
}

async function changeRole(userId) {
  try {
    const response = await fetch("/api/changeRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при изменении роли");
    }

    location.reload();
  } catch (error) {
    console.error(error.message);
    alert("Произошла ошибка. Попробуйте снова.");
  }
}
