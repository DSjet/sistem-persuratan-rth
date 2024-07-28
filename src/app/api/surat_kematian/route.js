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
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../../lib/firebaseConfig";

export async function POST(req) {
  const storage = getStorage(app);

  const body = await req.json();
  const {
    tahun,
    nomor_surat,
    nama,
    tempat_tanggal_lahir,
    pekerjaan,
    jenis_kelamin,
    agama,
    alamat_terakhir,
    umur,
    hari_kematian,
    tanggal_kematian,
    pukul_kematian,
    tempat_kematian,
    penyebab_kematian,
    tanggal_surat,
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
      "template_surat kematian.docx"
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
        nama: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: nama, font: "Times New Roman" })],
        },
        tempat_tanggal_lahir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: tempat_tanggal_lahir,
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
    const storageRef = ref(
      storage,
      `surat_kematian/Surat Kematian - ${new Date().toISOString()} - ${nama}.docx`
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
