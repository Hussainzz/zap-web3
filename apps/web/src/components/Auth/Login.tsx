import Link from "next/link";
import LoginForm from "@/components/Auth/LoginForm";

const Login = () => {
  return (
    <>
      <header className="js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors">
        <div className="flex items-center px-6 py-6 xl:px-24 ">
          <Link className="shrink-0" href="/">
            <h1 className="font-bold text-xl">⚡️ ZapWeb3</h1>
          </Link>
        </div>
      </header>
      <section className="relative py-20 lg:pt-48">
        <div className="container">
          <div className="flex h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
