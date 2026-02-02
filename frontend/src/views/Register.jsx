import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Register() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { setNotification } = useStateContext();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    axiosClient.post('/register', payload)
      .then(() => {
        setNotification("Registrasi berhasil! Silakan masuk dengan akun barumu. ✨");
        navigate('/login');
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else if (response) {
          // Show specific error from backend if available
          const message = response.data?.message || `Error ${response.status}: Terjadi kesalahan pada server.`;
          setErrors({ general: [message] });
        } else {
          setErrors({ general: ['Koneksi ke server gagal. Periksa koneksi internet Anda.'] });
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-light via-background to-primary-light px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ProbmaxCare</h1>
          <p className="text-gray-600">Mulai perjalanan kesehatan mentalmu</p>
        </div>

        {/* Register Card */}
        <div className="card shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daftar Akun</h2>
          <p className="text-gray-500 mb-6">Bergabunglah dengan kami! 🚀</p>

          {errors && (
            <div className="alert-error mb-6 animate-fade-in-down">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                {Object.keys(errors).map((key) => (
                  <p key={key} className="text-sm">{errors[key][0]}</p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <input
                ref={usernameRef}
                type="text"
                className="input-field"
                placeholder="Pilih username unik"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                ref={emailRef}
                type="email"
                className="input-field"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Minimal 8 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.413 7.728 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.011 1.011 0 010 .644C20.587 16.272 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Konfirmasi Password</label>
              <div className="relative">
                <input
                  ref={passwordConfirmationRef}
                  type={showPasswordConfirmation ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Ketik ulang password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPasswordConfirmation ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showPasswordConfirmation ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.413 7.728 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.011 1.011 0 010 .644C20.587 16.272 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 spinner"></div>
                  Memproses...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Dengan mendaftar, kamu menyetujui untuk menjaga privasi dan keamanan data pribadimu.
          </p>
        </div>
      </div>
    </div>
  );
}
