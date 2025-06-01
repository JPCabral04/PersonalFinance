import LoginForm from '@/components/LoginForm';
import bankBackground from '@/assets/bank-background.png';

const LoginPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="bg-background hidden flex-1 items-center justify-center md:flex">
        <img
          src={bankBackground}
          alt="Imagem ilustrativa de um banco"
          className="h-full w-[85%] object-contain opacity-90 transition duration-300 ease-in-out hover:opacity-100"
        ></img>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default LoginPage;
