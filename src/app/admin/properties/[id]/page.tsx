import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import PropertyForm from "@/components/admin/PropertyForm";
import { db } from "@/db";
import { properties, propertyFeatures, propertyImages } from "@/db/schema";
import { listAgents, listNeighborhoods } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [row] = await db.select().from(properties).where(eq(properties.id, numericId)).limit(1);
  if (!row) notFound();

  const [imgs, feats, hoods, team] = await Promise.all([
    db.select().from(propertyImages).where(eq(propertyImages.propertyId, numericId)).orderBy(asc(propertyImages.sortOrder)),
    db.select().from(propertyFeatures).where(eq(propertyFeatures.propertyId, numericId)),
    listNeighborhoods(false),
    listAgents(false),
  ]);

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Modifier — {row.titleFr}</h1>
      <p className="mt-1 text-[13px] text-[#6b7280]">
        {row.reference} · <a href={`/biens/${row.slug}`} className="text-[#2563eb] hover:underline">voir sur le site</a>
      </p>
      <div className="mt-6">
        <PropertyForm
          neighborhoods={hoods.map((n) => ({ id: n.id, name: n.name }))}
          agents={team.map((a) => ({ id: a.id, name: a.name }))}
          initial={{
            id: row.id,
            reference: row.reference,
            transactionType: row.transactionType,
            propertyType: row.propertyType,
            titleFr: row.titleFr,
            titleEn: row.titleEn ?? "",
            descriptionFr: row.descriptionFr ?? "",
            descriptionEn: row.descriptionEn ?? "",
            price: row.price,
            currency: row.currency,
            priceType: row.priceType,
            rentalFrequency: row.rentalFrequency ?? "month",
            city: row.city,
            neighborhoodId: row.neighborhoodId,
            address: row.address ?? "",
            latitude: row.latitude,
            longitude: row.longitude,
            locationVisibility: row.locationVisibility,
            livingArea: row.livingArea,
            landArea: row.landArea,
            bedrooms: row.bedrooms,
            bathrooms: row.bathrooms,
            livingRooms: row.livingRooms,
            garages: row.garages,
            totalFloors: row.totalFloors,
            yearBuilt: row.yearBuilt,
            videoUrl: row.videoUrl ?? "",
            agentId: row.agentId,
            status: row.status,
            isFeatured: row.isFeatured,
            isExclusive: row.isExclusive,
            isNew: row.isNew,
            isHotOffer: row.isHotOffer,
            features: feats.map((f) => f.feature),
            images: imgs.map((i) => ({ imageUrl: i.imageUrl, isCover: i.isCover })),
          }}
        />
      </div>
    </div>
  );
}
