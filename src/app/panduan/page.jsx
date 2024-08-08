"use client";

import Button from "../components/button/button";

const Panduan = () => {
  return (
    <main>
      <Button
        text="Kembali"
        className={`!w-48 my-2 mx-5`}
        onClick={() => {
          window.history.back();
        }}
      />
      <div className="h-screen mx-5">
        {/* embed pdf in google drive https://drive.google.com/file/d/1OUFtOZnYaO8Nq3IxY7S1YU-6u9-69iik/view */}
        <iframe
          src="https://drive.google.com/file/d/1OUFtOZnYaO8Nq3IxY7S1YU-6u9-69iik/preview"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </main>
  );
};

export default Panduan;
