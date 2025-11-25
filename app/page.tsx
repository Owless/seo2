import Link from 'next/link';
import { getAllArticles } from '@/data/articles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Полезные статьи и инструкции | SEO Блог',
  description: 'Подробные инструкции и руководства по различным темам. Узнайте как делать вещи правильно с нашими пошаговыми статьями.',
  keywords: ['инструкции', 'руководства', 'как сделать', 'советы', 'статьи'],
  openGraph: {
    title: 'Полезные статьи и инструкции',
    description: 'Подробные инструкции и руководства по различным темам',
    type: 'website',
  },
};

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 База знаний
          </h1>
          <p className="text-gray-600 mt-2">
            Полезные инструкции и руководства
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Добро пожаловать!
          </h2>
          <p className="text-xl opacity-90">
            Здесь вы найдёте подробные инструкции и руководства по самым разным темам.
            Все статьи написаны простым языком и содержат практические советы.
          </p>
        </section>

        {/* Articles Feed */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Последние статьи
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{article.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/${article.slug}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  >
                    Читать далее
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Не нашли нужную статью?
          </h2>
          <p className="text-gray-600 mb-6">
            Мы постоянно добавляем новые материалы. Добавьте сайт в закладки, чтобы не пропустить!
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Подписаться на обновления
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 База знаний. Все права защищены.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                О проекте
              </Link>
              <Link href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                Контакты
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Конфиденциальность
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
