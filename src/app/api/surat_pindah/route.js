import * as fs from "fs";
import * as path from "path";
import {
  Paragraph,
  patchDocument,
  PatchType,
  TableCell,
  TableRow,
  TextRun,
  Table,
} from "docx";
import { NextResponse } from "next/server";
import {
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../../../lib/firebaseConfig";
import moment from "moment";
import "moment/locale/id";

export async function POST(req) {
  const storage = getStorage(app);
  const body = await req.json();
  let {
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

  pengikut_arr = pengikut_arr.map((pengikut) => {
    return {
      nama_pengikut: pengikut.nama,
      jenis_kelamin_pengikut: pengikut.jenis_kelamin,
      tempat_lahir_pengikut: pengikut.tempat_lahir,
      tanggal_lahir_pengikut: pengikut.tanggal_lahir,
      ttl_pengikut: `${pengikut.tempat_lahir}, ${moment(
        pengikut.tanggal_lahir
      ).format("LL")}`,
      nik_pengikut: pengikut.nik,
      status_pengikut: pengikut.status,
      pekerjaan_pengikut: pengikut.pekerjaan,
      ket_pengikut: pengikut.ket,
    };
  });

  tanggal_lahir = moment(tanggal_lahir).format("LL");

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
      "template_surat pindah.docx"
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
          children: [new TextRun({ text: desa_asal, font: "Times New Roman" })],
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
        table_pindah: {
          type: PatchType.DOCUMENT,
          children: [
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "No.",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Nama",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Jenis Kelamin",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "TTL",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "NIK",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Status",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Pekerjaan",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Ket",
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                ...pengikut_arr.map((pengikut, index) => {
                  const {
                    nama_pengikut,
                    jenis_kelamin_pengikut,
                    ttl_pengikut,
                    nik_pengikut,
                    status_pengikut,
                    pekerjaan_pengikut,
                    ket_pengikut,
                  } = pengikut;
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: (index + 1).toString(),
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: nama_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: jenis_kelamin_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: ttl_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: nik_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: status_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: pekerjaan_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: ket_pengikut,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  });
                }),
              ],
            }),
          ],
        },
      },
    });

    if (!patchedDoc) {
      throw new Error("Failed to patch the document");
    }

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
    const filePath = `surat_pindah/Surat Pindah - ${new Date().toISOString()} - ${nama_lengkap}.docx`;

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, patchedDoc).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });

    return NextResponse.json({
      message: "Docs generated successfully",
      data: {
        filePath: filePath,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
