import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import type { Video, Pdf, LocalizedString } from '../types';

type ContentItem = Video | Pdf;

function ContentList() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Buscar vídeos
        const videosQuery = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'));
        const videosSnapshot = await getDocs(videosQuery);
        const videosData: Video[] = videosSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            youtubeId: data.youtubeId,
            type: data.type, // 'video'
            duration: data.duration,
            coverImageUrl: data.coverImageUrl,
            tags: data.tags || [],
            isVisible: data.isVisible,
            isAvailableForPurchase: data.isAvailableForPurchase,
            createdAt: data.createdAt,
            publishedAt: data.publishedAt || null,
            title: data.title as LocalizedString,
            description: data.description as LocalizedString,
          } as Video;
        });

        // Buscar PDFs
        const pdfsQuery = query(collection(db, 'pdfs'), orderBy('publishedAt', 'desc'));
        const pdfsSnapshot = await getDocs(pdfsQuery);
        const pdfsData: Pdf[] = pdfsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            pdfUrl: data.pdfUrl,
            type: data.type, // 'pdf'
            coverImageUrl: data.coverImageUrl,
            tags: data.tags || [],
            isVisible: data.isVisible,
            isAvailableForPurchase: data.isAvailableForPurchase,
            createdAt: data.createdAt,
            publishedAt: data.publishedAt || null,
            title: data.title as LocalizedString,
            author: data.author as LocalizedString,
            description: data.description as LocalizedString,
          } as Pdf;
        });

        const combinedContent = [...videosData, ...pdfsData];
        combinedContent.sort((a, b) => {
            const dateA = (a.publishedAt as any)?.toDate() || (a.createdAt as any).toDate();
            const dateB = (b.publishedAt as any)?.toDate() || (b.createdAt as any).toDate();
            return dateB - dateA;
        });

        setContent(combinedContent);
        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao buscar conteúdo:", err);
        setError("Não foi possível carregar o conteúdo.");
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getLocalizedText = (localizedString: LocalizedString | undefined): string => {
    if (!localizedString) return '';
    const currentLang = i18n.language as keyof LocalizedString;
    const text = localizedString[currentLang] || localizedString.pt_BR || '';
    return text;
  };

  if (loading) return <div>Carregando conteúdo...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (content.length === 0) return <div>Nenhum conteúdo disponível.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Conteúdo da Biblioteca</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {content.map(item => (
          // Adicionando a classe CSS 'content-card' aqui
          <div key={item.id} className="content-card" style={{
            backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '15px'
          }}>
            {/* Renderização condicional baseada no tipo */}
            {item.type === 'video' && (
              <>
                <img src={item.coverImageUrl} alt={getLocalizedText(item.title)} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3>{getLocalizedText(item.title)}</h3>
                <p>{getLocalizedText(item.description)}</p>
                <p>Duração: {item.duration} segundos</p>
              </>
            )}
            {item.type === 'pdf' && (
              <>
                <img src={item.coverImageUrl} alt={getLocalizedText(item.title)} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3>{getLocalizedText(item.title)}</h3>
                <p>Autor: {getLocalizedText(item.author)}</p>
                <p>{getLocalizedText(item.description)}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default ContentList;
