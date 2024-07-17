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
          children: [new TextRun({ text: "2020", font: "Times New Roman" })],
        },
        nomor_surat: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "2", font: "Times New Roman" })],
        },
        nama: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "Sir. ", font: "Times New Roman" }),
            new TextRun({ text: "Genghis Khan", font: "Times New Roman" }),
            new TextRun({ text: "(The Conqueror)", font: "Times New Roman" }),
          ],
        },
        tempat_tanggal_lahir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: "Mongolia, 1 Januari 1250",
              font: "Times New Roman",
            }),
          ],
        },
        pekerjaan: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "Kaisar", font: "Times New Roman" })],
        },
        jenis_kelamin: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "Laki-laki", font: "Times New Roman" }),
          ],
        },
        agama: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "Buddha", font: "Times New Roman" })],
        },
        alamat_terakhir: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "Mongolia", font: "Times New Roman" }),
          ],
        },
        umur: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "60", font: "Times New Roman" })],
        },
        hari_kematian: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "Senin", font: "Times New Roman" })],
        },
        tanggal_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "1 Januari 1310", font: "Times New Roman" }),
          ],
        },
        pukul_kematian: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "12:00", font: "Times New Roman" })],
        },
        tempat_kematian: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "Mongolia", font: "Times New Roman" }),
          ],
        },
        penyebab_kematian: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: "Kanker", font: "Times New Roman" })],
        },
        tanggal_surat: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({ text: "1 Januari 2022", font: "Times New Roman" }),
          ],
        },
      },
    });

    const exportPath = path.join(
      process.cwd(),
      "public",
      "export",
      `Surat Kematian - ${new Date().toISOString()}.docx`
    );

    fs.writeFile(exportPath, patchedDoc, (err) => {
      if (err) throw err;
      console.log("File written successfully!");
    });

    return NextResponse.json({ message: "Docs generated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
