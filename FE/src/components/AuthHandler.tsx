const AuthHandler = () => {
  return (
    <div className='bg-white w-1/2 min-h-screen gap-3 flex items-center justify-center flex-col'>
      <div>
        <form className="justify-around flex-col flex gap-4">
          <label className="flex flex-col gap-2">
            Email
            <input type="email" className="border border-gray-300 rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            Password
            <input type="password" className="border border-gray-300 rounded px-3 py-2" />
          </label>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthHandler;

