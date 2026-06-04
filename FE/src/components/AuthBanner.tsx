const AuthBanner = () => {
  return (
    <div className='bg-black w-1/2 min-h-screen flex items-center justify-center flex-col'>
      <img 
        src='https://cdn.dribbble.com/userupload/37871511/file/original-f4f824959f37e25d9dd2c0823ccfd48d.jpg?resize=752x&vertical=center'
        alt="Logo"
        className="w-64 h-64 mb-20 object-contain"
      />
      <h1 className="text-white font-bold mb-40">Get all your task done with Flow Board

      </h1>
    </div>
  );
};

export default AuthBanner;