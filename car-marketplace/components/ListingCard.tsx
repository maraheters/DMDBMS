import { Listing } from '@/types';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

export default function ListingCard({ listing }: { listing: Listing }) {
  const handleClick = () => {
    redirect(`/listings/${listing.id}`);
  };

  return (
    <Card
      key={listing.id}
      className="flex p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <div className="flex flex-row w-full">
        <div className="w-96 h-72 overflow-hidden rounded-md">
          <img
            src={getImageUrl(listing.images?.sort((a, b) => a.order - b.order)[0]?.url)}
            alt={`${listing.modification?.manufacturer.name} ${listing.modification?.car_model.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex-1 flex flex-col justify-between py-2">
          <div>
            <CardTitle className="text-2xl">
              {listing.modification.manufacturer.name} {listing.modification.car_model.name}
            </CardTitle>
            <CardDescription className="text-xl">{listing.modification.generation.name}</CardDescription>
            <div className="text-base text-muted-foreground mt-2">
              <p>
                {listing.modification.engine.type} • {listing.modification.transmission.type}
              </p>
              <p>Mileage: {listing.mileage} km</p>
            </div>
          </div>
          <div className="text-3xl font-semibold text-primary">${listing.price.toLocaleString()}</div>
        </CardContent>
      </div>
    </Card>
  );
}
