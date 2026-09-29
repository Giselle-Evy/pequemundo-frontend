import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const cards = [
    {
      to: '/admin/subjects',
      icon: '📚',
      title: 'Materias',
      description: 'Crea, edita y administra las materias educativas.',
      color: '#286B33',
      bg: '#ABF4AC',
    },
    {
      to: '/admin/exercises',
      icon: '✏️',
      title: 'Ejercicios',
      description: 'Administra las preguntas y respuestas.',
      color: '#AC3509',
      bg: '#FFDBD0',
    },
    {
      to: '/admin/users',
      icon: '👥',
      title: 'Usuarios',
      description: 'Revisa los tutores y sus perfiles infantiles.',
      color: '#006688',
      bg: '#C2E8FF',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#2C160E]">
          ¡Hola, {user?.name}! 👋
        </h1>
        <p className="text-lg font-bold text-slate-600 mt-1">
          Bienvenido al panel de administración de PequeMundo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ backgroundColor: card.bg }}
            >
              {card.icon}
            </div>
            <h2 className="text-2xl font-black text-[#2C160E] mb-2">
              {card.title}
            </h2>
            <p className="text-sm font-bold text-slate-600">
              {card.description}
            </p>
            <div
              className="mt-4 text-sm font-black flex items-center gap-1"
              style={{ color: card.color }}
            >
              <span>Ir ahora</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
        <h3 className="text-xl font-black text-blue-900 mb-2">
          💡 Consejos de administración
        </h3>
        <ul className="space-y-2 text-sm font-bold text-blue-800">
          <li>• Cada materia debe tener al menos 5 ejercicios para ser útil.</li>
          <li>• Los ejercicios con 4 opciones funcionan mejor que los de 2.</li>
          <li>• Marca solo UNA opción como correcta por ejercicio.</li>
          <li>• Usa emojis en las materias para que los niños las identifiquen rápido.</li>
        </ul>
      </div>
    </div>
  );
}