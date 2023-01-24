const form = document.querySelector(".to-form");
const container = document.querySelector(".task-container");
// dashboard elements
const todo = document.querySelector(".to-do button");
const dateview = document.querySelector(".date-view");
dateview.innerHTML = new Date().toLocaleString("en-us" , {dateStyle : "medium"})
const progress = document.querySelector(".progress button");
const completed = document.querySelector(".complete button");
function updateDashBoard(payload) {
  const Progress = payload?.filter((todo) => todo.status === "In Progres");
  const Todo = payload?.filter((todo) => todo.status === "To do");
  const Completed = payload?.filter((todo) => todo.status === "Completed");
  todo.innerHTML = Todo.length;
  progress.innerHTML = Progress.length;
  completed.innerHTML = Completed.length;
}
// update todos feed
function updateFeed(paylaod) {
  container.innerHTML = paylaod
    ?.filter((todo) => todo.status !== "Completed")
    ?.sort()
    ?.map(
      (todo) =>
        ` <div class="task-box">
        <div class="task-heading">
          <h3>${todo?.title}</h3>
          <div class="date">${new Date(todo?.date).toLocaleString("en-us", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</div>
        </div>
        <div class="task-content">
          <p>
           ${todo?.desc}
          </p>
        </div>
        <div class="footer">
          <div class="check-box">
            <input type="checkbox" class="progress-button" id='${todo?._id}' name="In progress" ${
          todo?.status === "In Progres" ? "checked" : null
        }  
        ${
          todo?.status === "In Progres" ? "disabled" : null
        } 
         />
            <label for='${todo?._id}'>In progress</label>
          </div>
         
        <label id='${todo?._id}' class="button completed-button">Completed </label>
        </div>
      </div>`
    );
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const paylaod = {};
  const data = new FormData(e.target);
  for (let key of data.keys()) {
    paylaod[key] = data.get(key);
  }
  const req = await fetch("https://light-moth-wetsuit.cyclic.app/api/v1/todo/create", {
    method: "post",
    body: JSON.stringify(paylaod),
    headers: {
      "content-type": "application/json",
    },
  });
  const res = await req.json();
  location.reload()

  // updateDashBoard(res?.todos);
  // updateFeed(res?.todos);
};
// complete todos
async function markComplete(id) {
  console.log(id);
  const req = await fetch("https://light-moth-wetsuit.cyclic.app/api/v1/todo/update", {
    method: "post",
    body: JSON.stringify({ _id: id, status: "Completed" }),
    mode : "cors",
    headers: {
      "content-type": "application/json",
    },
  });
  const res = await req.json();
  // updateDashBoard(res?.todos);
  // updateFeed(res?.todos);
  location.reload()
}

// complete todos
async function markINProgress(id) {
  console.log(id);
  const req = await fetch("https://light-moth-wetsuit.cyclic.app/api/v1/todo/update", {
    method: "post",
    body: JSON.stringify({ _id: id, status: "In Progres" }),
    mode : "cors",
    headers: {
      "content-type": "application/json",
    },
  });
  // const res = await req.json();
  // updateDashBoard(res?.todos);
  // updateFeed(res?.todos);
  location.reload()
}
//  updating dom with todos
(async () => {
  const req = await fetch("https://light-moth-wetsuit.cyclic.app/api/v1/todo/get", {
    method: "get",
    mode : "cors",
    headers: {
      "content-type": "application/json",
    },
  });
  const res = await req.json();
  updateDashBoard(res?.todos);
  updateFeed(res?.todos);

  // complete todos
  const completes = document.querySelectorAll(".completed-button") || [];
  completes?.forEach(
    (button) =>
      (button.onclick = (evt) => {
        markComplete(evt.target.id);
      })
  );

  // in progress todos
  const inprogress = document.querySelectorAll(".progress-button") || [];
  inprogress?.forEach(
    (button) =>
      (button.onfocus = (evt) => {
        markINProgress(evt.target.id);
      })
  );
})();
