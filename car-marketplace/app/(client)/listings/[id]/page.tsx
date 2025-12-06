import { notFound } from 'next/navigation';
import { getById } from '@/lib/queries/listing.queries';
import ImageCarousel from '@/components/ImageCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Gauge, Car, Fuel, Settings } from 'lucide-react';

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  
  if (isNaN(listingId)) {
    notFound();
  }

  const listing = await getById(listingId);

  if (!listing) {
    notFound();
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return '—';
    }
  };

  // Safe access to nested properties
  const generationName = listing.modification?.generation?.name ?? '—';
  const bodyType = listing.modification?.body?.type ?? '—';
  const engineType = listing.modification?.engine?.type ?? '—';
  const transmissionType = listing.modification?.transmission?.type ?? '—';
  
  const displacement = listing.modification?.engine?.displacement 
    ? (listing.modification.engine.displacement / 1000).toFixed(1) + 'L' 
    : '';
  const configuration = listing.modification?.engine?.configuration ?? '';
  const engineDisplay = displacement || configuration ? `${displacement} ${configuration}`.trim() : '—';

  const manufacturerName = listing.modification?.manufacturer?.name ?? '—';
  const modelName = listing.modification?.car_model?.name ?? '—';
  const modificationName = listing.modification?.name ?? '—';
  const powerKw = listing.modification?.engine?.power_kw ?? '—';
  const torqueNm = listing.modification?.engine?.torque_nm ?? '—';
  const gearsNum = listing.modification?.transmission?.gears_num ?? '—';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images and Description */}
        <div className="lg:col-span-2 space-y-8">
          <ImageCarousel images={listing.images} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {listing.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Details and Price */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold break-words">
                {listing.title}
              </CardTitle>
              <p className="text-3xl font-bold text-green-600 pt-2">
                ${listing.price.toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Generation
                  </span>
                  <span className="font-medium">{generationName}</span> 
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Gauge className="w-4 h-4" /> Mileage
                  </span>
                  <span className="font-medium">{listing.mileage?.toLocaleString() ?? '—'} km</span>
                </div>
                 <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Car className="w-4 h-4" /> Body
                  </span>
                  <span className="font-medium">{bodyType}</span>
                </div>
                 <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Fuel className="w-4 h-4" /> Fuel
                  </span>
                  <span className="font-medium">{engineType}</span>
                </div>
                 <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Settings className="w-4 h-4" /> Transmission
                  </span>
                  <span className="font-medium">{transmissionType}</span>
                </div>
                 <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                     Engine
                  </span>
                  <span className="font-medium">
                    {engineDisplay}
                  </span>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                 <h3 className="font-semibold mb-3">Technical Details</h3>
                 <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Make:</span>
                    <span className="font-medium text-right">{manufacturerName}</span>
                    
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium text-right">{modelName}</span>
                    
                    <span className="text-muted-foreground">Generation:</span>
                    <span className="font-medium text-right">{generationName}</span>
                    
                    <span className="text-muted-foreground">Modification:</span>
                    <span className="font-medium text-right">{modificationName}</span>
                    
                    <span className="text-muted-foreground">Power:</span>
                    <span className="font-medium text-right">{powerKw} kW</span>
                    
                    <span className="text-muted-foreground">Torque:</span>
                    <span className="font-medium text-right">{torqueNm} Nm</span>
                    
                    <span className="text-muted-foreground">Gears:</span>
                    <span className="font-medium text-right">{gearsNum}</span>
                 </div>
              </div>

            </CardContent>
          </Card>
          
          <Card>
             <CardContent className="p-6">
                <div className="text-sm text-muted-foreground text-center">
                   Listing ID: {listing.id} <br/>
                   Posted: {formatDate(listing.created_at)}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
