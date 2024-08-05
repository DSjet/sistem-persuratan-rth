import * as fs from "fs";
import * as path from "path";
import { patchDocument, PatchType, TextRun } from "docx";
import { NextResponse } from "next/server";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
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
    tempat_lahir,
    tanggal_lahir,
    pekerjaan,
    jenis_kelamin,
    agama,
    alamat_terakhir,
    umur,
    waktu_kematian,
    tempat_kematian,
    penyebab_kematian,
    tanggal_surat,
  } = body;

  moment().locale("id");
  let pukul_kematian = waktu_kematian.split("T")[1];
  let tanggal_kematian = waktu_kematian.split("T")[0];
  // set moment locale to id
  const hari_kematian = moment(waktu_kematian).format("dddd");

  // convert yyyy-mm-dd to dd-mm-yyyy date format using moment
  tanggal_lahir = moment(tanggal_lahir).format("LL");
  tanggal_kematian = moment(tanggal_kematian).format("LL");

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
      "template_surat kematian.docx"
    );

    // Ensure the template path points to a file
    const stat = fs.statSync(templatePath);
    if (stat.isDirectory()) {
      throw new Error(
        `Expected a file but found a directory at ${templatePath}`
      );
    }

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
        nama: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: nama_lengkap, font: "Times New Roman" }),
          ],
        },
        tempat_tanggal_lahir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${tempat_lahir}, ${tanggal_lahir}`,
              font: "Times New Roman",
            }),
          ],
        },
        pekerjaan: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: pekerjaan, font: "Times New Roman" })],
        },
        jenis_kelamin: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: jenis_kelamin, font: "Times New Roman" }),
          ],
        },
        agama: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: agama, font: "Times New Roman" })],
        },
        alamat_terakhir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: alamat_terakhir, font: "Times New Roman" }),
          ],
        },
        umur: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: umur, font: "Times New Roman" })],
        },
        hari_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: hari_kematian, font: "Times New Roman" }),
          ],
        },
        tanggal_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: tanggal_kematian, font: "Times New Roman" }),
          ],
        },
        pukul_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: pukul_kematian, font: "Times New Roman" }),
          ],
        },
        tempat_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: tempat_kematian, font: "Times New Roman" }),
          ],
        },
        penyebab_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: penyebab_kematian, font: "Times New Roman" }),
          ],
        },
        tanggal_surat: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: tanggal_surat, font: "Times New Roman" }),
          ],
        },
      },
    });

    // locally installed
    // const exportPath = path.join(
    //   process.cwd(),
    //   "public",
    //   "export",
    //   `Surat Kematian - ${new Date().toISOString()} - ${nama}.docx`
    // );

    // fs.writeFile(exportPath, patchedDoc, (err) => {
    //   if (err) throw err;
    //   console.log("File written successfully!");
    // });

    // Upload the patched document to Firebase Storage
    const filePath = `surat_kematian/Surat Kematian - ${new Date().toISOString()} - ${nama_lengkap}.docx`;
    const storageRef = ref(storage, filePath);
    uploadBytes(storageRef, patchedDoc).then((snapshot) => {
      console.log("Uploaded a blob or file!");
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
