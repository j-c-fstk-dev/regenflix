import { useTranslation } from 'react-i18next';

function RegenMarketPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('regen_market_page_title', 'RegenMarket (Loja)')}</h1>
      <p>{t('regen_market_page_description', 'Conteúdo da página da loja.')}</p>
      {/* TODO: Adicionar componentes para categorias de produtos, barra de busca, grid de produtos, etc. */}
    </div>
  );
}

export default RegenMarketPage;