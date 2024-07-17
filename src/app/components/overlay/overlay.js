const Overlay = ({ setShowModal }) => {
  return (
    <div
      className="w-[100vw] h-[100vh] absolute top-0 left-0 bg-gray-500 opacity-[70%]"
      onClick={() => setShowModal(false)}
    ></div>
  );
};

export default Overlay;
