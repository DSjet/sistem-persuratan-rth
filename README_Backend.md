This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# API Endpoints

### `/api/surat_kematian`

**Endpoint:** `/api/surat_kematian`

**Method:** `POST`

**Description:** This endpoint generates a death certificate document (`Surat Kematian`) based on the provided information, patches the data into a template, uploads the document to Firebase Storage, and returns the document's storage path.

#### Request Body

The request body should be in JSON format and include the following fields:

- `tahun` (string): The year of the document.
- `nomor_surat` (string): The document's number.
- `nama_lengkap` (string): The full name of the deceased.
- `tempat_lahir` (string): The birthplace of the deceased.
- `tanggal_lahir` (string): The birth date of the deceased (in `yyyy-mm-dd` format).
- `pekerjaan` (string): The occupation of the deceased.
- `jenis_kelamin` (string): The gender of the deceased.
- `agama` (string): The religion of the deceased.
- `alamat_terakhir` (string): The last known address of the deceased.
- `umur` (string): The age of the deceased.
- `waktu_kematian` (string): The date and time of death (in ISO 8601 format, e.g., `2024-08-01T14:30:00`).
- `tempat_kematian` (string): The place of death.
- `penyebab_kematian` (string): The cause of death.
- `tanggal_surat` (string): The date the document is issued.

#### Response

- **Success (200)**:

  - **Message:** "Docs generated successfully"
  - **Data:**
    - `filePath` (string): The path to the generated document in Firebase Storage.

- **Error (500)**:
  - **Message:** "An error occurred"

#### Example Request

```json
{
  "tahun": "2024",
  "nomor_surat": "123/ABC",
  "nama_lengkap": "John Doe",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1980-01-01",
  "pekerjaan": "Engineer",
  "jenis_kelamin": "Male",
  "agama": "Christian",
  "alamat_terakhir": "Jl. Example No. 123",
  "umur": "44",
  "waktu_kematian": "2024-08-01T14:30:00",
  "tempat_kematian": "Rumah Sakit ABC",
  "penyebab_kematian": "Cardiac Arrest",
  "tanggal_surat": "2024-08-01"
}
```

#### Example Response

```json
{
  "message": "Docs generated successfully",
  "data": {
    "filePath": "surat_kematian/Surat Kematian - 2024-08-01T14:30:00 - John Doe.docx"
  }
}
```

#### Notes

- The date format for `tanggal_lahir` and `tanggal_kematian` will be converted to Indonesian long date format (e.g., "1 Januari 1980") using the `moment` library.
- The generated document will be uploaded to Firebase Storage, and the `filePath` will be provided in the response.
- The `waktu_kematian` field is used to derive the `hari_kematian` (day of death), `tanggal_kematian` (date of death), and `pukul_kematian` (time of death) for the document.

### `/api/surat_kurang_mampu`

**Endpoint:** `/api/surat_kurang_mampu`

**Method:** `POST`

**Description:** This endpoint generates a certificate of poverty (`Surat Kurang Mampu`) based on the provided information, patches the data into a template, uploads the document to Firebase Storage, and returns the document's storage path.

#### Request Body

The request body should be in JSON format and include the following fields:

- `tahun` (string): The year of the document.
- `nomor_surat` (string): The document's number.
- `nama_lengkap` (string): The full name of the person.
- `tempat_lahir` (string): The birthplace of the person.
- `tanggal_lahir` (string): The birth date of the person (in `yyyy-mm-dd` format).
- `jenis_kelamin` (string): The gender of the person.
- `kewarganegaraan` (string): The nationality of the person.
- `pekerjaan` (string): The occupation of the person.
- `agama` (string): The religion of the person.
- `alamat` (string): The address of the person.
- `nik` (string): The national identification number of the person.
- `tanggal_surat` (string): The date the document is issued.

#### Response

- **Success (200)**:

  - **Message:** "Docs generated successfully"
  - **Data:**
    - `filePath` (string): The path to the generated document in Firebase Storage.

- **Error (500)**:
  - **Message:** "An error occurred"

#### Example Request

```json
{
  "tahun": "2024",
  "nomor_surat": "456/XYZ",
  "nama_lengkap": "Jane Doe",
  "tempat_lahir": "Bandung",
  "tanggal_lahir": "1995-05-15",
  "jenis_kelamin": "Female",
  "kewarganegaraan": "Indonesia",
  "pekerjaan": "Unemployed",
  "agama": "Islam",
  "alamat": "Jl. Example No. 456",
  "nik": "1234567890123456",
  "tanggal_surat": "2024-08-01"
}
```

#### Example Response

```json
{
  "message": "Docs generated successfully",
  "data": {
    "filePath": "surat_kurang_mampu/Surat Kurang Mampu - 2024-08-01T14:30:00 - Jane Doe.docx"
  }
}
```

#### Notes

- The date format for `tanggal_lahir` will be converted to Indonesian long date format (e.g., "15 Mei 1995") using the `moment` library.
- The generated document will be uploaded to Firebase Storage, and the `filePath` will be provided in the response.
- The implementation uses the `docx` library to patch the provided data into the document template.

### `/api/surat_pindah`

**Endpoint:** `/api/surat_pindah`

**Method:** `POST`

**Description:** This endpoint generates a relocation certificate (`Surat Pindah`) based on the provided information, inserts the data into a document template, uploads the document to Firebase Storage, and returns the document's storage path.

#### Request Body

The request body should be in JSON format and include the following fields:

- `tahun` (string): The year of the document.
- `nomor_surat` (string): The document's number.
- `nama_lengkap` (string): The full name of the person.
- `jenis_kelamin` (string): The gender of the person.
- `tempat_lahir` (string): The birthplace of the person.
- `tanggal_lahir` (string): The birth date of the person (in `yyyy-mm-dd` format).
- `kewarganegaraan` (string): The nationality of the person.
- `pekerjaan` (string): The occupation of the person.
- `status_perkawinan` (string): The marital status of the person.
- `pendidikan` (string): The education level of the person.
- `agama` (string): The religion of the person.
- `alamat_asal` (string): The original address.
- `desa_asal` (string): The original village.
- `kecamatan_asal` (string): The original sub-district.
- `kabupaten_asal` (string): The original regency.
- `provinsi_asal` (string): The original province.
- `alamat_pindah` (string): The new address.
- `desa_pindah` (string): The new village.
- `kecamatan_pindah` (string): The new sub-district.
- `kab_kota_pindah` (string): The new city/regency.
- `provinsi_pindah` (string): The new province.
- `alasan_pindah` (string): The reason for relocation.
- `tanggal_surat` (string): The date the document is issued.
- `pengikut_arr` (array): An array of objects representing people accompanying the move. Each object includes:
  - `nama` (string): The name of the accompanying person.
  - `jenis_kelamin` (string): The gender of the accompanying person.
  - `tempat_lahir` (string): The birthplace of the accompanying person.
  - `tanggal_lahir` (string): The birth date of the accompanying person (in `yyyy-mm-dd` format).
  - `nik` (string): The national identification number of the accompanying person.
  - `status` (string): The relationship status with the main person.
  - `pekerjaan` (string): The occupation of the accompanying person.
  - `ket` (string): Additional notes.

#### Response

- **Success (200)**:

  - **Message:** "Docs generated successfully"
  - **Data:**
    - `filePath` (string): The path to the generated document in Firebase Storage.

- **Error (500)**:
  - **Message:** "An error occurred"

#### Example Request

```json
{
  "tahun": "2024",
  "nomor_surat": "123/ABC",
  "nama_lengkap": "John Doe",
  "jenis_kelamin": "Male",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1985-10-10",
  "kewarganegaraan": "Indonesia",
  "pekerjaan": "Software Developer",
  "status_perkawinan": "Married",
  "pendidikan": "Bachelor's Degree",
  "agama": "Christian",
  "alamat_asal": "Jl. Example No. 123",
  "desa_asal": "Desa Example",
  "kecamatan_asal": "Kecamatan Example",
  "kabupaten_asal": "Kabupaten Example",
  "provinsi_asal": "Provinsi Example",
  "alamat_pindah": "Jl. New Example No. 456",
  "desa_pindah": "Desa New Example",
  "kecamatan_pindah": "Kecamatan New Example",
  "kab_kota_pindah": "Kabupaten New Example",
  "provinsi_pindah": "Provinsi New Example",
  "alasan_pindah": "Job relocation",
  "tanggal_surat": "2024-08-01",
  "pengikut_arr": [
    {
      "nama": "Jane Doe",
      "jenis_kelamin": "Female",
      "tempat_lahir": "Bandung",
      "tanggal_lahir": "1990-05-15",
      "nik": "1234567890123456",
      "status": "Wife",
      "pekerjaan": "Teacher",
      "ket": "Accompanying spouse"
    }
  ]
}
```

#### Example Response

```json
{
  "message": "Docs generated successfully",
  "data": {
    "filePath": "surat_kematian/Surat Kematian - 2024-08-01T14:30:00 - John Doe.docx"
  }
}
```

#### Notes

- The date format for `tanggal_lahir` will be converted to Indonesian long date format (e.g., "10 Oktober 1985") using the `moment` library.
- The implementation uses the `docx` library to generate a table for the accompanying people (`pengikut`) and to patch the provided data into the document template.
- The generated document will be uploaded to Firebase Storage, and the `filePath` will be provided in the response.

### `/api/surat_usaha`

**Endpoint:** `/api/surat_usaha`

**Method:** `POST`

**Description:** This endpoint generates a business certificate (`Surat Usaha`) based on the provided information, inserts the data into a document template, uploads the document to Firebase Storage, and returns the document's storage path.

#### Request Body

The request body should be in JSON format and include the following fields:

- `tahun` (string): The year of the document.
- `nomor_surat` (string): The document's number.
- `nama_lengkap` (string): The full name of the person.
- `tempat_lahir` (string): The birthplace of the person.
- `tanggal_lahir` (string): The birth date of the person (in `yyyy-mm-dd` format).
- `jenis_kelamin` (string): The gender of the person.
- `kewarganegaraan` (string): The nationality of the person.
- `pekerjaan` (string): The occupation of the person.
- `nik` (string): The national identification number of the person.
- `alamat` (string): The address of the person.
- `bidang_usaha` (string): The business field.
- `nama_usaha` (string): The name of the business.
- `tanggal_surat` (string): The date the document is issued.

#### Response

- **Success (200)**:

  - **Message:** "Docs generated successfully"
  - **Data:**
    - `filePath` (string): The path to the generated document in Firebase Storage.

- **Error (500)**:
  - **Message:** "An error occurred"

#### Example Request

```json
{
  "tahun": "2024",
  "nomor_surat": "123/ABC",
  "nama_lengkap": "John Doe",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1985-10-10",
  "jenis_kelamin": "Male",
  "kewarganegaraan": "Indonesia",
  "pekerjaan": "Business Owner",
  "nik": "1234567890123456",
  "alamat": "Jl. Example No. 123",
  "bidang_usaha": "Retail",
  "nama_usaha": "Toko Example",
  "tanggal_surat": "2024-08-01"
}
```

#### Example Response

```json
{
  "message": "Docs generated successfully",
  "data": {
    "filePath": "surat_usaha/Surat Usaha - 2024-08-01T14:30:00 - John Doe.docx"
  }
}
```

#### Implementation Details

- The endpoint uses the `docx` library to generate the document based on the provided template.
- The `moment` library is used to format the birth date (`tanggal_lahir`) into Indonesian long date format.
- The document template is read asynchronously from the `public/template/template_surat usaha.docx` file.
- The provided data is patched into the template using the `patchDocument` function from the `docx` library.
- The generated document is uploaded to Firebase Storage.
- The storage path of the uploaded document is returned in the response.

#### Notes

- Ensure that the document template (`template_surat usaha.docx`) exists in the `public/template` directory.
- The `moment` library is used for date formatting and locale settings.
- The `firebase/storage` library is used for uploading the document to Firebase Storage.
- Proper error handling is implemented to return a 500 status code in case of any errors.
