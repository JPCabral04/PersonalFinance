import RegisterForm from '@/components/RegisterForm';
import circlesBackground from '../assets/circles-background.png';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="flex flex-1 items-center justify-center">
        <RegisterForm></RegisterForm>
      </div>
      <div className="bg-background hidden flex-1 items-center justify-center md:flex">
        <img
          src={circlesBackground}
          alt="Círculos decorativos no fundo"
          className="h-full w-full object-cover"
        ></img>
      </div>
    </div>
  );
};

export default RegisterPage;
