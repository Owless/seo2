import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '@/data/articles';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Страница не найдена',
    };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `/${article.slug}`,
    },
  };
}

// Генерация статических путей для всех статей
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Преобразование Markdown в HTML (простая версия)
function markdownToHtml(markdown: string) {
  let html = markdown;

  // Заголовки
  html = html.replace(/^### (.*)$/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gim, "<h1>$1</h1>");

  // Жирный текст
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Курсив
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Списки: сначала превращаем "- пункт" → "<li>пункт</li>"
  html = html.replace(/^\- (.*)$/gim, "<li>$1</li>");

  // Оборачиваем последовательности li в <ul>...</ul>
  html = html.replace(
    /(?:<li>[\s\S]*?<\/li>)(?:\n?<li>[\s\S]*?<\/li>)*/gim,
    (match) => `<ul>${match}</ul>`
  );

  // Параграфы
  html = html
    .split("\n\n")
    .map((paragraph) => {
      if (
        paragraph.startsWith("<h") ||
        paragraph.startsWith("<ul") ||
        paragraph.startsWith("<li")
      ) {
        return paragraph;
      }
      return `<p>${paragraph}</p>`;
    })
    .join("\n");

  return html;
}


export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const htmlContent = markdownToHtml(article.content);

  // JSON-LD для структурированных данных
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    keywords: article.keywords.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Вернуться к статьям
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{article.author}</span>
                </div>
              </div>

              <p className="text-xl text-gray-700 mb-6">
                {article.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </header>

            {/* Article Content */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
              <div
                className="prose prose-lg max-w-none markdown-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {/* Share Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Была ли статья полезной?
              </h3>
              <p className="text-gray-600 mb-4">
                Поделитесь ею с друзьями!
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  👍 Полезно
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Поделиться
                </button>
              </div>
            </div>

            {/* Related Articles */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Читайте также
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {getAllArticles()
                  .filter(a => a.slug !== article.slug)
                  .slice(0, 2)
                  .map((relatedArticle) => (
                    <Link
                      key={relatedArticle.slug}
                      href={`/${relatedArticle.slug}`}
                      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {relatedArticle.description}
                      </p>
                    </Link>
                  ))}
              </div>
            </section>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-gray-400">
                © 2024 База знаний. Все права защищены.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
