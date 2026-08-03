'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/data/initialData';
import { Calendar, Eye, Clock, ArrowRight, Tag } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const isUnsplash = article.coverImage?.includes('images.unsplash.com');

  if (featured) {
    return (
      <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 hover:border-emerald-500/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              unoptimized={!isUnsplash}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover group-hover:scale-105 transition duration-700 brightness-95 dark:brightness-90 group-hover:brightness-100"
            />
            <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </div>
          </div>
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views} pembaca
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug mb-3">
                {article.title}
              </h3>

              <p className="text-zinc-700 dark:text-zinc-300 text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                {article.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{article.author}</p>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">{article.authorRole}</p>
                </div>
              </div>

              <Link
                href={`/berita/${article.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Baca Detail
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          unoptimized={!isUnsplash}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 z-10 bg-zinc-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
          {article.category}
        </div>
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
          <Eye className="w-3 h-3 text-emerald-400" />
          {article.views}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-semibold mb-2">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>

          <p className="text-zinc-700 dark:text-zinc-300 text-xs line-clamp-3 leading-relaxed mb-4 font-medium">
            {article.summary}
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[150px] font-medium">
            Oleh: <span className="font-bold text-zinc-900 dark:text-zinc-200">{article.author}</span>
          </div>
          <Link
            href={`/berita/${article.id}`}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition flex items-center gap-1"
          >
            Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
