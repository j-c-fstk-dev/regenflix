import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebaseConfig'; // Importar auth e db
import { doc, updateDoc } from 'firebase/firestore';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    // Salva a preferência no SessionStorage para a sessão atual
    sessionStorage.setItem('userPreferredLanguage', lng);

    // Salva a preferência no Firestore para usuários logados
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          preferredLanguage: lng,
        });
        console.log("Idioma salvo no Firestore.");
      } catch (error) {
        console.error("Erro ao salvar idioma no Firestore:", error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {/* Ícone de bandeira ou texto indicando o idioma atual */}
      {/* Você pode usar um ícone de bandeira ou texto com base em i18n.language */}
      <span>Idioma:</span>
      <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="pt_BR">🇧🇷 Português</option>
        <option value="en_US">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}

export default LanguageSelector;