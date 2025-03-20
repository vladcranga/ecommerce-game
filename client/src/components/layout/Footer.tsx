const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 mt-auto bg-gray-800 text-gray-400">
      <div className="container mx-auto text-center">
        <p className="text-base">
          Made by Vlad Mihai Cranga using the MERN stack. © {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
