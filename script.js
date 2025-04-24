     // استيراد الكود الأصلي من script.js
     const button_list = document.getElementById("add-task-btn");
     const inputElement = document.getElementById("task-input");
     const dateElement = document.getElementById("date-input");
     const btnlist = document.getElementById("btn-inprogress");
     const btntruelist = document.getElementById("btn-completed");
     let modlists = false;

     let editId = null;

     // تفعيل زر المهام غير المكتملة
     btnlist.addEventListener("click", () => {
       modlists = false;
       showInProgressTasks();
     });

     // تفعيل زر المهام المكتملة
     btntruelist.addEventListener("click", () => {
       modlists = true;
       listmodtrue();
     });

     // تفعيل نمط الأزرار
     const buttons = document.querySelectorAll("#ulbtn button");
     buttons.forEach((button) => {
       button.addEventListener("click", () => {
         buttons.forEach((btn) => btn.classList.remove("modscren"));
         button.classList.add("modscren");
       });
     });

     const listbuttons = document.querySelectorAll("#ulListBtn button");
     listbuttons.forEach((button) => {
       button.addEventListener("click", () => {
         listbuttons.forEach((btn) => btn.classList.remove("modscren"));
         button.classList.add("modscren");
       });
     });

     function addList() {
       const input_list = inputElement.value;
       const date = dateElement.value;
       if (input_list !== "") {
         let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

         if (editId) {
           tasks = tasks.map((task) => {
             if (task.id === editId) {
               task.task = input_list;
               task.date = date;
               task.mod = false; // Reset the mod status to false when editing
             }
             return task;
           });

           editId = null;
         } else {
           const Task = {
             id: Date.now(),
             task: input_list,
             date: date,
             mod: false,
           };
           tasks.push(Task);
         }

         localStorage.setItem("tasks", JSON.stringify(tasks));
         inputElement.value = "";
         refreshTaskView();
         updateTotalCount();
       } else {
         alert("الرجاء إدخال مهمة");
       }
     }

     window.onload = function () {
       // تحميل إعدادات السمة من التخزين المحلي
       const savedTheme = localStorage.getItem('theme');
       if (savedTheme) {
         document.documentElement.className = savedTheme;
       } else {
         // استخدام وضع النظام الافتراضي
         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
           document.documentElement.classList.remove('dark');
           document.documentElement.classList.add('light');
         }
       }
       
       // تحديث عرض المهام
       refreshTaskView();
       updateTotalCount();
     };

     function refreshTaskView() {
       if (modlists) {
         listmodtrue();
       } else {
         showInProgressTasks();
       }
     }

     function shoeLists(t) {
       const isDarkMode = document.documentElement.classList.contains('dark');
       const continer = document.getElementById("task-list");
       let list = `
         <div class="${
           t.mod 
             ? (isDarkMode ? "bg-emerald-900" : "bg-emerald-100 text-emerald-900") 
             : (isDarkMode ? "bg-gradient-to-r from-zinc-900 to-zinc-800" : "bg-gradient-to-r from-slate-100 to-white text-slate-900")
         } mb-4 rounded-xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl" id="task-${
         t.id
       }">
           <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
             <div class="flex-grow">
               <h3 class="text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-1"
                   style="${
                     t.mod ? "text-decoration: line-through; opacity: 0.5;" : ""
                   }">
                 ${t.task}
               </h3>
               <p class="text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                 ${t.date}
               </p>
             </div>
     <div class="flex items-center gap-2 sm:gap-3 justify-end">
       ${
         !t.mod
           ? `
         <button onclick="completeTask(${t.id})"
                 class="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
           </svg>
           <span class="hidden sm:inline">تم</span>
         </button>

       `
           : ""
       }
           <button onclick="editTask(${t.id})"
                 class="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l3 3 9-9"/>
           </svg>
           <span class="hidden sm:inline">تعديل</span>
          </button>

         <button onclick="deleteTask(${t.id})"
               class="group p-2 rounded-full ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-slate-300 hover:bg-slate-400'} text-white transition"
               title="حذف">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
         </svg>
       </button>
     </div>

           </div>
         </div>
       `;
       continer.innerHTML += list;
     }

     function deleteTask(taskId) {
       let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
       tasks = tasks.filter((task) => task.id !== taskId);
       localStorage.setItem("tasks", JSON.stringify(tasks));
       refreshTaskView();
       updateTotalCount();
     }

     function completeTask(taskId) {
       let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

       tasks = tasks.map((task) => {
         if (task.id === taskId) {
           task.mod = true;
         }
         return task;
       });

       localStorage.setItem("tasks", JSON.stringify(tasks));
       refreshTaskView();
       updateTotalCount();
     }

     function updateTotalCount() {
       const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
       document.getElementById("numberList").textContent = tasks.length;
     }

     function editTask(taskId) {
       const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
       const taskToEdit = tasks.find((task) => task.id === taskId);

       if (taskToEdit) {
         inputElement.value = taskToEdit.task;
         dateElement.value = taskToEdit.date;
         editId = taskToEdit.id;
         inputElement.focus();
       }
     }

     function listmodtrue() {
       let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
       const completedTasks = tasks.filter((task) => task.mod === true);
       const completedContainer = document.getElementById("task-list");
       completedContainer.innerHTML = "";

       completedTasks.forEach((task) => {
         shoeLists(task);
       });
     }

     function showInProgressTasks() {
       let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
       const inProgressTasks = tasks.filter((task) => !task.mod);
       const inProgressContainer = document.getElementById("task-list");
       inProgressContainer.innerHTML = "";

       inProgressTasks.forEach((task) => {
         shoeLists(task);
       });
     }

     // كود تبديل السمة الداكنة/الفاتحة
     const themeToggle = document.getElementById('theme-toggle');
     
     themeToggle.addEventListener('click', () => {
       // تبديل الوضع
       if (document.documentElement.classList.contains('dark')) {
         document.documentElement.classList.remove('dark');
         document.documentElement.classList.add('light');
         localStorage.setItem('theme', 'light');
       } else {
         document.documentElement.classList.remove('light');
         document.documentElement.classList.add('dark');
         localStorage.setItem('theme', 'dark');
       }
       
       // تحديث قائمة المهام بعد تغيير السمة
       refreshTaskView();
     });