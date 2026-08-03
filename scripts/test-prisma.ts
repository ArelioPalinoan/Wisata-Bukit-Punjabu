import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🔄 Memeriksa koneksi Prisma ORM ke database Supabase PostgreSQL...');
  console.log('🔗 Connection URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));

  try {
    interface QueryResult {
      current_time: string | Date;
      db_name: string;
      version: string;
    }
    const result = await prisma.$queryRaw<QueryResult[]>`SELECT NOW() as current_time, current_database() as db_name, version();`;
    console.log('\n======================================================');
    console.log('🎉 STATUS: KONEKSI PRISMA TERHUBUNG SANGAT RIIL DA REAL!');
    console.log('======================================================');
    console.log('⏰ Server Time PostgreSQL :', result[0]?.current_time);
    console.log('🗄️ Nama Database         :', result[0]?.db_name);
    console.log('🐘 versi PostgreSQL       :', result[0]?.version);

    const newsCount = await prisma.news.count();
    console.log(`📰 Jumlah Berita di Tabel Database: ${newsCount} artikel`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Gagal terhubung ke Database Supabase:');
    if (error instanceof Error) {
      console.error('Detail Error:', error.message);
    } else {
      console.error(error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
