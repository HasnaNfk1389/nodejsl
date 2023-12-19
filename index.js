const express = require("express");
const date = require('date-and-time') 
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




//Calendar






const { google } = require('googleapis'); 

  
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'; 
const GOOGLE_PRIVATE_KEY="9cda9e3216f8011234a5121c7f963494009d5ee2"
const GOOGLE_CLIENT_EMAIL = "lmscalendar@disco-glow-194200.iam.gserviceaccount.com"
const GOOGLE_PROJECT_NUMBER = "1096867220972"
const GOOGLE_CALENDAR_ID = "2ce6cde01b5f1b7d0c9f90cfcc20b198b696c546b2ab34acace2495945afce28@group.calendar.google.com"
  
  
const jwtClient = new google.auth.JWT( 
    GOOGLE_CLIENT_EMAIL, 
    null, 
    GOOGLE_PRIVATE_KEY, 
    SCOPES 
); 
  
const calendar = google.calendar({ 
    version: 'v3', 
    project: GOOGLE_PROJECT_NUMBER, 
    auth: jwtClient 
}); 
  
app.get('/calendar', (req, res) => { 
  
  calendar.events.list({ 
    calendarId: GOOGLE_CALENDAR_ID, 
    timeMin: (new Date()).toISOString(), 
    maxResults: 10, 
    singleEvents: true, 
    orderBy: 'startTime', 
  }, (error, result) => { 
    if (error) { 
      res.send(JSON.stringify({ error: error })); 
    } else { 
      if (result.data.items.length) { 
        res.send(JSON.stringify({ events: result.data.items })); 
      } else { 
        res.send(JSON.stringify({ message: 'No upcoming events found.' })); 
      } 
    } 
  }); 
}); 



const auth = new google.auth.GoogleAuth({ 
  keyFile: 'C:/xampp/htdocs/Laravel/nodejsl/disco-glow-194200-9cda9e3216f8.json', 
  scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar 
}); 







//Calendar






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


app.post("/studentTugas", async (req, res) => {
  try {
    // Upload file to Supabase Storage
    const { data: newMateri, error: uploadError } = await supabase
      .storage
      .from('file_siswa')
      .upload(req.body.file_desc.name, Buffer.from(req.body.file_content,'base64'), {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return response(500, null, "Internal Server Error (Storage Upload)", res);
    }

    // Insert data into 'materi' table
    const { data: insertedData, error: insertError } = await supabase
    .from('tugas')  
    .upsert([
        {
          user_id: req.body.user_id,
          nama_siswa: req.body.nama_siswa,
          tanggalmasuk: req.body.tanggalmasuk,
          bucket_url: 'https://dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_siswa/'+req.body.file_desc.name,
          kelas: req.body.kelas,
          task_id: req.body.task_id,
        }
      ]);
      if (insertError) {
        console.error("Supabase Table Insert Error:", insertError);
        return response(500, null, "Internal Server Error (Table Insert)", res);
      }



    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id, // Assuming you want to use the ID from Supabase Storage
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});





app.post("/studentTugasUpdate", async (req, res) => {
  try {
    // Upload file to Supabase Storage
    const { data: newMateri, error: uploadError } = await supabase
      .storage
      .from('file_siswa')
      .upload(req.body.file_desc.name, Buffer.from(req.body.file_content,'base64'), {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return response(500, null, "Internal Server Error (Storage Upload)", res);
    }

    // Insert data into 'materi' table
    const { data: insertedData, error: insertError } = await supabase
    .from('tugas')  
    .update([
        {
          tanggalmasuk: req.body.tanggalmasuk,

          bucket_url: 'https://dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_siswa/'+req.body.file_desc.name,
        }
      ])
      .eq('task_id',req.body.task_id)
      if (insertError) {
        console.error("Supabase Table Insert Error:", insertError);
        return response(500, null, "Internal Server Error (Table Insert)", res);
      }



    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id, // Assuming you want to use the ID from Supabase Storage
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});







app.post("/tugasUpdate", async (req, res) => {
 
    var event = { 
      'summary': req.body.namatugas, 
      'location': req.body.kelas, 
      'description': req.body.desk_tugas, 
      'start': { 
        'dateTime':  req.body.tanggalmasuk, 
        'timeZone': 'Asia/Jakarta', 
      }, 
      'end': { 
        'dateTime':  req.body.tenggat, 
        'timeZone': 'Asia/Jakarta', 
      }, 
      'attendees': [], 
      'reminders': { 
        'useDefault': false, 
        'overrides': [ 
          {'method': 'email', 'minutes': 24 * 60}, 
          {'method': 'popup', 'minutes': 10}, 
        ], 
      }, 
    };
  
  
    auth.getClient().then(a=>{ 
      calendar.events.insert({ 
        auth:a, 
        calendarId: GOOGLE_CALENDAR_ID, 
        resource: event, 
      }, function(err, event) { 
        if (err) { 
          console.log('There was an error contacting the Calendar service: ' + err); 
          return; 
        } 
        console.log('Event created: %s', event.data); 
        res.jsonp("Event successfully created!"); 
      }); 
    })

    const [uploadResult, insertResult] = await Promise.all([
      supabase.storage.from('file_tugas').upload(req.body.file_desc.name, Buffer.from(req.body.file_content, 'base64'), {
        cacheControl: '3600',
        upsert: false,
      }),
      supabase.from('tugas_guru').update([
        {
          namatugas: req.body.namatugas,
          desk_tugas: req.body.desk_tugas,
          tgl_kumpul: req.body.tenggat,
          tgl_kirimguru: req.body.tanggalmasuk,
          bucket_url: 'https://dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_tugas/'+req.body.file_desc.name,
          kelas: req.body.kelas,
        }
      ])
      .eq('id',req.body.task_id),
    ]);
      if (uploadResult.error) {
        console.error("Supabase Storage Upload Error:", uploadResult.error);
        return response(500, null, "Internal Server Error (Storage Upload)", res);
      }
      if (insertResult.error) {
        console.error("Supabase Table Insert Error:", insertResult.error);
        return response(500, null, "Internal Server Error (Table Insert)", res);
      }
    }
)

// function upload_tanggal(judul, lokasi, deskripsi, start, end){
//   var event = { 
//     'summary': judul, 
//     'location': lokasi, 
//     'description': deskripsi, 
//     'start': { 
//       'dateTime':  start, 
//       'timeZone': 'Asia/Jakarta', 
//     }, 
//     'end': { 
//       'dateTime':  end, 
//       'timeZone': 'Asia/Jakarta', 
//     }, 
//     'attendees': [], 
//     'reminders': { 
//       'useDefault': false, 
//       'overrides': [ 
//         {'method': 'email', 'minutes': 24 * 60}, 
//         {'method': 'popup', 'minutes': 10}, 
//       ], 
//     }, 
//   };


//   auth.getClient().then(a=>{ 
//     calendar.events.insert({ 
//       auth:a, 
//       calendarId: GOOGLE_CALENDAR_ID, 
//       resource: event, 
//     }, function(err, event) { 
//       if (err) { 
//         console.log('There was an error contacting the Calendar service: ' + err); 
//         return; 
//       } 
//       console.log('Event created: %s', event.data); 
//       // res.jsonp("Event successfully created!"); 
//     }); 
//   })
// }


app.post("/tugas", async (req, res) => {
  try {
    var event = { 
      'summary': req.body.namatugas, 
      'location': req.body.kelas, 
      'description': req.body.desk_tugas, 
      'start': { 
        'dateTime':  req.body.tanggalmasuk, 
        'timeZone': 'Asia/Jakarta', 
      }, 
      'end': { 
        'dateTime':  req.body.tenggat, 
        'timeZone': 'Asia/Jakarta', 
      }, 
      'attendees': [], 
      'reminders': { 
        'useDefault': false, 
        'overrides': [ 
          {'method': 'email', 'minutes': 24 * 60}, 
          {'method': 'popup', 'minutes': 10}, 
        ], 
      }, 
    };

    // Insert/update event in Google Calendar
    auth.getClient().then(a => { 
      calendar.events.insert({ 
        auth: a, 
        calendarId: GOOGLE_CALENDAR_ID, 
        resource: event, 
      }, function(err, event) { 
        if (err) { 
          console.log('There was an error contacting the Calendar service: ' + err); 
          return res.status(500).jsonp("Internal Server Error (Google Calendar)");
        } 
        console.log('Event created: %s', event.data); 
        res.jsonp("Event successfully created!"); 
      }); 
    });

    // Check if a file is provided in the request
    if (req.body.file_desc && req.body.file_content) {
      // If a file is provided, perform Supabase Storage upload and table insert
      const [uploadResult, insertResult] = await Promise.all([
        supabase.storage.from('file_tugas').upload(req.body.file_desc.name, Buffer.from(req.body.file_content, 'base64'), {
          cacheControl: '3600',
          upsert: false,
        }),
        supabase.from('tugas_guru').insert([
          {
            user_id: req.body.user_id,
            namatugas: req.body.namatugas,
            desk_tugas: req.body.desk_tugas,
            tgl_kumpul: req.body.tenggat,
            tgl_kirimguru: req.body.tanggalmasuk,
            bucket_url: 'https://dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_tugas/' + req.body.file_desc.name,
            kelas: req.body.kelas,
          },
        ]),
      ]);

      // Check for errors in Supabase Storage upload
      if (uploadResult.error) {
        console.error("Supabase Storage Upload Error:", uploadResult.error);
        return res.status(500).jsonp("Internal Server Error (Storage Upload)");
      }

      // Check for errors in Supabase table insert
      if (insertResult.error) {
        console.error("Supabase Table Insert Error:", insertResult.error);
        return res.status(500).jsonp("Internal Server Error (Table Insert)");
      }
    } else {
      // If no file is provided, perform only Supabase table insert
      const insertResult = await supabase.from('tugas_guru').insert([
        {
          user_id: req.body.user_id,
          namatugas: req.body.namatugas,
          desk_tugas: req.body.desk_tugas,
          tgl_kumpul: req.body.tenggat,
          tgl_kirimguru: req.body.tanggalmasuk,
          kelas: req.body.kelas,
        },
      ]);

      // Check for errors in Supabase table insert
      if (insertResult.error) {
        console.error("Supabase Table Insert Error:", insertResult.error);
        return res.status(500).jsonp("Internal Server Error (Table Insert)");
      }
    }

    // Send a success response
    return res.status(200).jsonp("Operation successful");
  } catch (error) {
    console.error("Unhandled Error:", error);
    return res.status(500).jsonp("Internal Server Error");
  }
});


  





app.delete("/tugas/:id/:user_id", async (req, res) => {
  const tugasId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("tugas")
      .delete()
      .eq("id", tugasId)
      .eq("user_id", req.params.user_id);

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


app.get("/checkUser/:user_id", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*").eq('id',req.params.user_id);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});


app.get("/allSubmittedTask/:class", async (req, res) => {
  const { data, error } = await supabase.from("tugas").select("*").eq('kelas',req.params.class);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/allSubmittedTask/:class/:user_id", async (req, res) => {
  const { data, error } = await supabase.from("tugas").select("*").eq('kelas',req.params.class).eq('user_id',req.params.user_id);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/allTask/:class", async (req, res) => {
  const { data, error } = await supabase.from("tugas_guru").select("*").eq('kelas',req.params.class);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/all_task", async (req, res) => {
  const { data, error } = await supabase.from("tugas_guru").select("*");
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/semua_tugas/:id", async (req, res) => {
  const { data, error } = await supabase.from("tugas").select("*").eq('user_id',req.params.id);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all task success", res);
});

app.get("/cekfile/:id/:user_id", async (req, res) => {
  const { data, error } = await supabase.from("tugas").select('task_id').eq('task_id',req.params.id).eq('user_id',req.params.user_id);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Sukses", res);
});

app.get("/cekTugasGuru/:id/:user_id", async (req, res) => {
  const { data, error } = await supabase.from("tugas_guru").select('*').eq('id',req.params.id).eq('user_id',req.params.user_id);

  console.log(data);
  return response(200, data, "Sukses", res);
});


// app.post('/materi', async (req, res) => {
//   const {error} = await supabase
//       .from('materi')
//       .insert({
//           nama_materi: req.body.nama_materi,
//           deskripsi_materi: req.body.deskripsi_materi,
//       })
//   if (error) {
//       res.send(error);
//   }
//   res.send("created!!");
// });




app.post("/editMateriWithFile", async (req, res) => {
  // const fileContentBuffer = fs.readFileSync(req.body.file_content);
  // const base64Content = fileContentBuffer.toString('base64');
  try {
    // Upload file to Supabase Storage
    const { data: newMateri, error: uploadError } = await supabase
      .storage
      .from('file_materi')
      .upload(req.body.path, Buffer.from(req.body.file_content,'base64'), {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return response(500, null, "Internal Server Error (Storage Upload)", res);
    }

    // Insert data into 'materi' table
    const { data: insertedData, error: insertError } = await supabase
      .from('materi')
      .update([
        {
          nama_materi: req.body.nama_materi,
          deskripsi_materi: req.body.deskripsi_materi,
          file_metadata: req.body.file_desc,
          bucket_url: 'dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_materi/materi/'+req.body.file_desc.name,
          kelas: req.body.kelas,
        }
      ])
      .eq('id',req.body.idcurrent)
      .eq('user_id',req.body.useridcurrent)

    if (insertError) {
      console.error("Supabase Table Insert Error:", insertError);
      return response(500, null, "Internal Server Error (Table Insert)", res);
    }

    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id, // Assuming you want to use the ID from Supabase Storage
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});




app.post("/profileUpdate", async (req, res) => {
  try {

    // Insert data into 'materi' table
    const { data: newMateri, error } = await supabase
      .from('users')
      .update([
        {
          name:req.body.username,
          phone:req.body.phone,
          password:req.body.password,
        }
      ])
      .eq('id',req.body.userid)


    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});


app.post("/addScore", async (req, res) => {
  try {

    // Insert data into 'materi' table
    const { data: newMateri, error } = await supabase
      .from('tugas')
      .update([
        {
          score:req.body.score,
        }
      ])
      .eq('task_id',req.body.task_id)
      .eq('user_id',req.body.user_id)


    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});


app.post("/editMateri", async (req, res) => {
  try {

    // Insert data into 'materi' table
    const { data: newMateri, error } = await supabase
      .from('materi')
      .update([
        {
          nama_materi: req.body.nama_materi,
          deskripsi_materi: req.body.deskripsi_materi,
          kelas: req.body.kelas,
        }
      ])
      .eq('id',req.body.idcurrent)
      .eq('user_id',req.body.useridcurrent)


    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});

app.post("/materi", async (req, res) => {
  try {
    let uploadedFileData = null;

    // Check if file_content is present for optional file upload
    if (req.body.file_content) {
      // Upload file to Supabase Storage
      const { data: newMateri, error: uploadError } = await supabase
        .storage
        .from('file_materi')
        .upload(req.body.path, Buffer.from(req.body.file_content, 'base64'), {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        return response(500, null, "Internal Server Error (Storage Upload)", res);
      }

      uploadedFileData = {
        file_metadata: req.body.file_desc,
        bucket_url: 'dvhbkrmcoralcuvkpoyh.supabase.co/storage/v1/object/public/file_materi/materi/' + req.body.file_desc.name,
      };
    }

    // Insert data into 'materi' table
    const { data: insertedData, error: insertError } = await supabase
      .from('materi')
      .insert([
        {
          user_id: req.body.user_id,
          nama_materi: req.body.nama_materi,
          deskripsi_materi: req.body.deskripsi_materi,
          kelas: req.body.kelas,
          ...uploadedFileData, // Include file data if uploaded
        }
      ]);

    if (insertError) {
      console.error("Supabase Table Insert Error:", insertError);
      return response(500, null, "Internal Server Error (Table Insert)", res);
    }

    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id, // Assuming you want to use the ID from Supabase Storage
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error("Unhandled Error:", error);
    return response(500, null, "Internal Server Error", res);
  }
});


app.post("/deleteTugas", async (req, res) => {
  const {  } = req.body;

  try {
    const { data: newMateri, error } = await supabase
    .from('tugas')
    .delete()
    .eq('task_id', req.body.task_id)
    .eq('user_id', req.body.user_id)



    if (error) {
      console.error(error);
      return response(500, null, "Internasl Server Error", res);
    }

    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error(error);
    return response(500, null, "Insternal Server Error", res);
  }
});


app.post("/deleteTask", async (req, res) => {
  const {  } = req.body;

  try {
    const { data: newMateri, error } = await supabase
    .from('tugas_guru')
    .delete()
    .eq('id', req.body.task_id)
    .eq('user_id', req.body.user_id)



    if (error) {
      console.error(error);
      return response(500, null, "Internasl Server Error", res);
    }

    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error(error);
    return response(500, null, "Insternal Server Error", res);
  }
});

app.post("/deleteMateri", async (req, res) => {
  const {  } = req.body;
  try {
    const { data: newMateri, error } = await supabase
    .from('materi')
    .delete()
    .eq('id', req.body.id)
    .eq('user_id', req.body.user_id)
    .eq('nama_materi', req.body.nama_materi)



    if (error) {
      console.error(error);
      return response(500, null, "Internasl Server Error", res);
    }

    const responseUser = {
      isSuccess: "success",
      // id: newMateri[0].id,
      message: "Materi berhasil ditambahkan",
    };

    return response(200, responseUser, "Materi berhasil ditambahkan", res);
  } catch (error) {
    console.error(error);
    return response(500, null, "Insternal Server Error", res);
  }
});


app.get("/all_materi/:kelas", async (req, res) => {
  const { data, error } = await supabase.from("materi").select("*").eq('kelas', req.params.kelas);
  if (error) {
    return response(500, null, error.message, res);
  }
  console.log(data);
  return response(200, data, "Get all user success", res);
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
