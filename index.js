const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const response = require("./response");
require("dotenv").config;
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://dvhbkrmcoralcuvkpoyh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aGJrcm1jb3JhbGN1dmtwb3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4MTY0OTEsImV4cCI6MjAxNDM5MjQ5MX0.EVm69J6eHvVXksf0MpuYk_RtL8EWgsYRVtBage2fAjY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const multer = require("multer");
const upload = multer();
const bucketName = 'file_materi';
const filePath = 'path/in/bucket/notul_hasna.txt';
const fileContents = require('fs').readFileSync(filePath);

app.use(bodyParser.json());

supabase.storage
    .from(bucketName)
    .upload('path/in/bucket/notul_hasna.txt', fileContents, {
        contentType: 'text/plain', // Sesuaikan dengan tipe file Anda
    })
    .then((response) => {
        if (response.status === 201) {
            // File diunggah dengan sukses
            console.log('File diunggah:', response.data.Key);
        } else {
            // Tangani kesalahan
            console.error('Upload gagal:', response.error);
        }
    })
    .catch((error) => {
        // Tangani kesalahan lainnya
        console.error('Error:', error);
    });

app.get("/hello", (req, res) => {
  res.send("Hello World!");
  console.log(supabase);
});

app.get("/get", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all user success", res);
});

app.get("/getIDUser/:id", async (req, res) => {
  const userId = req.params.id;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);
  if (error) {
    return response(500, null, error.message, res);
  }
  return response(200, data, "Get all user success", res);
  console.log(data);
});

app.post("/register", async (req, res) => {
  const { name, email, password, phone, role, kelas } = req.body;
  try {
    const { data: checkEmail, error: checkEmailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (checkEmailError) {
      console.error("Supabase Check Email Error:", checkEmailError);
      return response(500, null, "Internal Server Error", res);
    }

    if (checkEmail && checkEmail.length > 0) {
      const userData = {
        isSuccess: "error",
        message: "Email sudah terdaftar",
      };
      return response(200, userData, "Email sudah terdaftar", res);
    } else {
      try {
        const { data: newUser, error: newUserError } = await supabase
          .from("users")
          .insert({ name, email, password, phone, role, kelas })
          .select("*")
          .eq("email", email);

        if (newUserError) {
          return response(500, null, "Internal Server Error", res)
        }
        const responseUser = {
          isSuccess: "success",
          id: newUser[0].id,
          messege: "Data berhasil ditambahkan",
        };
        return response(200, responseUser, "Data berhasil ditambahkan", res);
      } catch (error) {
        return response(500, null, "Internal Server Error", res);
      }
    }
  } catch (error) {
    console.error("Supabase Check Email Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password);

    if (error) {
      return response(500, null, "Internal Server Error", res);
    }

    if (data.length === 1) {
      const user = data[0];
      const userData = {
        isSuccess: "success",
        id: user.id,
      };
      return response(200, userData, "Berhasil login", res);
    } else {
      return response(404, null, "Pengguna tidak ditemukan", res);
    }
  } catch (error) {
    console.error(error);
    return response(500, null, "Internal Server Error", res);
  }
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const { data: checkEmail, error: checkEmailError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email);

//     if (checkEmailError) {
//       console.error("Supabase Check Email Error:", checkEmailError);
//       return response(500, null, "Internal Server Error", res);
//     }

//     if (checkEmail && checkEmail.length > 0) {
//       const userData = {
//         isSuccess: "error",
//         message: "Email sudah terdaftar",
//       };
//       return response(200, userData, "Email sudah terdaftar", res);
//     } else {
//       try {
//         const { data: newUser, error: newUserError } = await supabase
//           .from("users")
//           .insert({ email, password })
//           .select("*")
//           .eq("email", email);

//         if (newUserError) {
//           return response(500, null, "Internal Server Error", res);
//         }
//         const responseUser = {
//           isSuccess: "success",
//           id: newUser[0].id,
//           messege: "Data berhasil ditambahkan",
//         };
//         return response(200, responseUser, "Data berhasil ditambahkan", res);
//       } catch (error) {
//         return response(500, null, "Internal Server Error", res);
//       }
//     }
//   } catch (error) {
//     console.error("Supabase Check Email Error:", error);
//     return response(500, null, "Internal Server Error", res);
//   }
// });

app.post("/tugas", async (req, res) => {
  const { user_id, nama_siswa, kelas, tanggalmasuk, task_id } = req.body;
  try {
    const { data: newTugas, error } = await supabase
      .from("tugas")
      .insert([{ user_id, nama_siswa, kelas, tanggalmasuk, task_id }])
      .select("*");

    if (error) {
      console.error(error);
      return response(500, null, "Internal Server Error", res);
    }

    const responseUser = {
      isSuccess: "success",
      id: newTugas[0].id,
      message: "Tugas berhasil ditambahkan",
    };

    console.log(newTugas[0]);

    return response(200, responseUser, "Tugas berhasil ditambahkan", res);
  } catch (error) {
    console.error(error);
    return response(500, null, "Internal Server Error", res);
  }
});

app.delete("/tugas/:id", async (req, res) => {
  const tugasId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("tugas")
      .delete()
      .eq("id", tugasId);
    if (error) {
      console.log("Supabase Delete Error:", error);
      return response(500, null, "Internal Server Error", res);
    }
    const responseData = {
      isSuccess: "success",
      message: "tugas berhasil dihapus",
    };
    return response(200, responseData, "tugas berhasil dihapus", res);
  } catch (error) {
    console.log("Supabase Delete Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});

app.put("/tugas/:id", upload.single("file"), async (req, res) => {
  const tugasId = req.params.id;
  const { nama_siswa, namatugas, kelas, desk_tugas, tanggalmasuk, user_id } = req.body;
  const file = req.file;

  try {
    const { data: fileData, error: fileError } = await supabase.storage
      .from("your-storage-bucket") // Replace with your Storage Bucket name
      .upload(`materi/${file.originalname}`, file.buffer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (fileError) {
      console.error("Error uploading file:", fileError);
      return response(500, null, "Internal Server Error", res);
    }

    const { data: updatedadd_task, error: updateError } = await supabase
      .from("tugas")
      .update({
        nama_siswa,
        namatugas,
        kelas,
        desk_tugas,
        tanggalmasuk,
        user_id,
        file: fileData.key,
      })
      .eq("id", tugasId)
      .select("*");
    //dd($nama_siswa, $namatugas, $kelas, $tanggalmasuk, $user_id);
    dd($data);
    if (updateError) {
      return response(500, null, "Internal Server Error", res);
    }

    if (updatedadd_task.length === 1) {
      const tugasData = {
        isSuccess: "success",
        message: "Tugas berhasil diupdate",
      };
      return response(200, tugasData, "Tugas berhasil diupdate", res);
    } else {
      return response(404, null, "Tugas not found", res);
    }
  } catch (error) {
    console.log("Supabase Update tugas Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});

// app.get("/get", async (req, res) => {
//   const { data, error } = await supabase.from("users").select("*");
//   if (error) {
//     return response(500, null, error.message, res);
//   }
//   console.log(data);
//   return response(200, data, "Get all user success", res);
// });

app.get("/all_task", async (req, res) => {
  const { data, error } = await supabase.from("tugas_guru").select("*");
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/semua_tugas", async (req, res) => {
  const { data, error } = await supabase.from("tugas").select("*");
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/all_materi", async (req, res) => {
  const { data, error } = await supabase.from("materi").select("*");
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all user success", res);
});

app.post("/materi", async (req, res) => {
  const { judul, deskripsi } = req.body;
  try {
    const { data: newMateri, error } = await supabase
      .from("materi")
      .insert([{ judul, deskripsi }])
      .select("*");

    if (error) {
      console.error(error);
      return response(500, null, "Internal Server Error", res);
    }

    const responseUser = {
      isSuccess: "success",
      id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error(error);
    return response(500, null, "Internal Server Error", res);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.post("/materi", async (req, res) => {
//   const { nama_materi, user_id, deskripsi_materi, file } = req.body;
//   try {
//     const { data: newMateri, error: newMateriError } = await supabase
//       .from("materi")
//       .insert({ nama_materi, user_id, deskripsi_materi, file })
//       .select("*");

//     if (newMateriError) {
//       console.error(newMateriError);
//       return response(500, null, "Internal Server Error", res);
//     }

//     const responseUser = {
//       isSuccess: "success",
//       id: newMateri[0].id,
//       message: "Data berhasil ditambahkan",
//     };

//     return response(200, responseUser, "Data berhasil ditambahkan", res);
//   } catch (error) {
//     console.error(error);
//     return response(500, null, "Internal Server Error", res);
//   }
// });
