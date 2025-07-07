import { useTranslation } from 'react-i18next';

function ContentPlayerPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('content_player_page_title', 'Página do Player de Conteúdo')}</h1>
      <p>{t('content_player_page_description', 'Esta página exibirá o vídeo, PDF ou outro conteúdo da aula.')}</p>
      {/* TODO: Adicionar placeholders para player de vídeo, visualizador de PDF, texto, etc. */}
    </div>
  );
}

export default ContentPlayerPage;