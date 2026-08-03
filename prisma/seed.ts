import { prisma } from '../src/lib/prisma';
import {
  INITIAL_NEWS,
  TOURISM_SPOTS,
  UMKM_PRODUCTS,
  VISITOR_REVIEWS,
  FAQS,
  TRAVEL_ROUTES,
  INITIAL_GALLERY,
} from '../src/data/initialData';

async function main() {
  console.log('🌱 Starting Prisma seeding for Wisata Bukit Punjabu...');

  // 1. Seed News
  console.log('Seeding News...');
  for (const item of INITIAL_NEWS) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        category: item.category,
        author: item.author,
        authorRole: item.authorRole,
        date: item.date,
        readTime: item.readTime,
        views: item.views,
        featured: item.featured,
        status: item.status,
        summary: item.summary,
        content: item.content,
        coverImage: item.coverImage,
        gallery: item.gallery,
        tags: item.tags,
      },
    });
  }

  // 2. Seed Tourism Spots
  console.log('Seeding Tourism Spots...');
  const existingSpots = await prisma.tourismSpot.count();
  if (existingSpots === 0) {
    for (const spot of TOURISM_SPOTS) {
      await prisma.tourismSpot.create({
        data: {
          title: spot.title,
          category: spot.category,
          description: spot.description,
          image: spot.image,
          badge: spot.badge,
          rating: spot.rating,
        },
      });
    }
  }

  // 3. Seed UMKM Products
  console.log('Seeding UMKM Products...');
  const existingUmkm = await prisma.umkmProduct.count();
  if (existingUmkm === 0) {
    for (const u of UMKM_PRODUCTS) {
      await prisma.umkmProduct.create({
        data: {
          name: u.name,
          price: u.price,
          priceUnit: u.priceUnit,
          category: u.category,
          seller: u.seller,
          description: u.description,
          image: u.image,
          badge: u.badge,
        },
      });
    }
  }

  // 4. Seed Visitor Reviews
  console.log('Seeding Visitor Reviews...');
  const existingReviews = await prisma.visitorReview.count();
  if (existingReviews === 0) {
    for (const r of VISITOR_REVIEWS) {
      await prisma.visitorReview.create({
        data: {
          name: r.name,
          origin: r.origin,
          rating: r.rating,
          date: r.date,
          comment: r.comment,
          avatar: r.avatar,
          spot: r.spot,
        },
      });
    }
  }

  // 5. Seed FAQs
  console.log('Seeding FAQs...');
  const existingFaqs = await prisma.faq.count();
  if (existingFaqs === 0) {
    for (const f of FAQS) {
      await prisma.faq.create({
        data: {
          question: f.question,
          answer: f.answer,
          category: f.category,
        },
      });
    }
  }

  // 6. Seed Travel Routes
  console.log('Seeding Travel Routes...');
  const existingRoutes = await prisma.travelRoute.count();
  if (existingRoutes === 0) {
    for (const tr of TRAVEL_ROUTES) {
      await prisma.travelRoute.create({
        data: {
          fromLocation: tr.from,
          distance: tr.distance,
          duration: tr.duration,
          roadCondition: tr.roadCondition,
          vehicleAdvice: tr.vehicleAdvice,
        },
      });
    }
  }

  // 7. Seed Gallery Images
  console.log('Seeding Gallery Images...');
  const existingGallery = await prisma.galleryImage.count();
  if (existingGallery === 0) {
    for (const g of INITIAL_GALLERY) {
      await prisma.galleryImage.create({
        data: {
          title: g.title,
          category: g.category,
          imageUrl: g.imageUrl,
          description: g.description,
        },
      });
    }
  }

  console.log('✅ Prisma seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during Prisma seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
