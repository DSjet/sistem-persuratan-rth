import * as fs from "fs";
import * as path from "path";
import {
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Paragraph,
  patchDocument,
  PatchType,
  Table,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
} from "docx";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const {
    tahun,
    nomor_surat,
    nama_lengkap,
    jenis_kelamin,
    tempat_lahir,
    tanggal_lahir,
    kewarganegaraan,
    pekerjaan,
    status_perkawinan,
    pendidikan,
    agama,
    alamat_asal,
    desa_asal,
    kecamatan_asal,
    kabupaten_asal,
    provinsi_asal,
    alamat_pindah,
    desa_pindah,
    kecamatan_pindah,
    kab_kota_pindah,
    provinsi_pindah,
    alasan_pindah,
    tanggal_surat,
    pengikut_arr,
  } = body;

  // Wrap the fs.readFile in a promise to use it with async/await
  const readFileAsync = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };

  try {
    // Resolve the path to the template file
    const templatePath = path.join(
      process.cwd(),
      "public",
      "template",
      "template_surat kurang mampu.docx"
    );

    // Ensure the template path points to a file
    const stat = fs.statSync(templatePath);
    if (stat.isDirectory()) {
      throw new Error(
        `Expected a file but found a directory at ${templatePath}`
      );
    }

    console.log(req);

    const docTemplate = await readFileAsync(templatePath);

    const patchedDoc = await patchDocument(docTemplate, {
      patches: {
        tahun: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: tahun, font: "Times New Roman" })],
        },
        nomor_surat: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: nomor_surat, font: "Times New Roman" }),
          ],
        },
        nama_lengkap: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: nama_lengkap, font: "Times New Roman" }),
          ],
        },
        tempat_lahir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: tempat_lahir,
              font: "Times New Roman",
            }),
          ],
        },
        tanggal_lahir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: tanggal_lahir,
              font: "Times New Roman",
            }),
          ],
        },
        jenis_kelamin: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: jenis_kelamin, font: "Times New Roman" }),
          ],
        },
        kewarganegaraan: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: kewarganegaraan, font: "Times New Roman" }),
          ],
        },
        pekerjaan: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: pekerjaan, font: "Times New Roman" })],
        },
        status_perkawinan: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: status_perkawinan, font: "Times New Roman" }),
          ],
        },
        pendidikan: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: pendidikan, font: "Times New Roman" }),
          ],
        },
        agama: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: agama, font: "Times New Roman" })],
        },
        alamat_asal: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: alamat_asal, font: "Times New Roman" }),
          ],
        },
        desa_asal: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: desa_asal, font: "Times New Roman" }),
          ],
        },
        kecamatan_asal: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: kecamatan_asal, font: "Times New Roman" }),
          ],
        },
        kabupaten_asal: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: kabupaten_asal, font: "Times New Roman" }),
          ],
        },
        provinsi_asal: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: provinsi_asal, font: "Times New Roman" }),
          ],
        },
        alamat_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: alamat_pindah, font: "Times New Roman" }),
          ],
        },
        desa_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: desa_pindah, font: "Times New Roman" }),
          ],
        },
        kecamatan_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: kecamatan_pindah, font: "Times New Roman" }),
          ],
        },
        kab_kota_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: kab_kota_pindah, font: "Times New Roman" }),
          ],
        },
        provinsi_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: provinsi_pindah, font: "Times New Roman" }),
          ],
        },
        alasan_pindah: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: alasan_pindah, font: "Times New Roman" }),
          ],
        },
        tanggal_surat: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: tanggal_surat, font: "Times New Roman" }),
          ],
        },
        pengikut: { 
            type: PatchType.DOCUMENT,
            children:[
                new TableRow({
                    chilren:[
                        new TableCell({
                            children:[
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "No.", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "Nama", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "Jenis Kelamin", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "TTL", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "NIK", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "Status", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            pekerjaan: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "Pekerjaan", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children:[
                                        new TextRun({text: "Ket", font: "Times New Roman"})
                                    ]
                                })
                            ]
                        }),
                    ]
                }),
                ...pengikut_arr.map((pengikut, index) => {
                    const { nama, jenis_kelamin, ttl, nik, status, pekerjaan, ket } = pengikut;
                    return new TableRow({
                        children:[
                            new TableCell({
                                children:[
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: index + 1, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: nama, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: jenis_kelamin, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: ttl, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: nik, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: status, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: pekerjaan, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children:[
                                            new TextRun({text: ket, font: "Times New Roman"})
                                        ]
                                    })
                                ]
                            }),
                        ]
                    })
                })
            ]
        }
        
      },
    });

    // const exportPath = path.join(
    //   process.cwd(),
    //   "public",
    //   "export",
    //   `Surat Pindah - ${new Date().toISOString()} - ${nama_lengkap}.docx`
    // );

    // fs.writeFile(exportPath, patchedDoc, (err) => {
    //   if (err) throw err;
    //   console.log("File written successfully!");
    // });

    // Upload the patched document to Firebase Storage
    const storageRef = ref(
        storage,
        `surat_pindah/Surat Pindah - ${new Date().toISOString()} - ${nama_lengkap}.docx`
      );
      const uploadTask = uploadBytesResumable(storageRef, patchedDoc);
      uploadTask.on("state_changed", {
        next(snapshot) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error(error) {
          console.error(error);
        },
        complete() {
          console.log("Upload successful");
        },
      });

    return NextResponse.json({ message: "Docs generated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
