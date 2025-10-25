/*
  This single file replaces both ListingsPage.tsx and ListingFilters.tsx.
  You should place this at the correct route, e.g., 'app/listings/page.tsx'.
  
  You will also need to delete the old ListingFilters.tsx file 
  and update imports for ListingCard if needed.
*/

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Queries
import { getWithFilter } from '@/lib/queries/listing.queries';
import { getAll as getAllManufacturers } from '@/lib/queries/manufacturer.queries';
import { getAllByManufacturer as getModelsByManufacturer } from '@/lib/queries/car-model.queries';
import { getAllByCarModel as getGenerationsByModel } from '@/lib/queries/generation.queries';
import { getAllByGeneration as getModificationsByGeneration } from '@/lib/queries/modification.queries';

// Local Components
import ListingCard from '@/components/ListingCard'; // Assumes ListingCard is still separate

// Types
import { Listing, Manufacturer, CarModel, Generation, Modification } from '@/types';

// Schema for the filter form
const schema = z.object({
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minMileage: z.string().optional(),
  maxMileage: z.string().optional(),
  manufacturerId: z.number().nullable().optional(),
  carModelId: z.number().nullable().optional(),
  generationId: z.number().nullable().optional(),
  modificationId: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ListingsPage() {
  // --- State for Listings ---
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Filters ---
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  // --- Hooks ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, handleSubmit, watch, setValue, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      // Set default empty state
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      manufacturerId: null,
      carModelId: null,
      generationId: null,
      modificationId: null,
    },
  });

  const watchedManufacturer = watch('manufacturerId');
  const watchedModel = watch('carModelId');
  const watchedGeneration = watch('generationId');

  // --- Data Fetching Effect (Listings) ---
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true); // Set loading true on each new fetch
      try {
        const queryParams = searchParams ? new URLSearchParams(Object.fromEntries(searchParams.entries())) : undefined;
        const data = await getWithFilter(queryParams);
        setListings(data);
        setError(null); // Clear previous errors
      } catch (err) {
        setError('Failed to fetch listings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]); // This correctly re-runs when URL params change

  // --- Filter Data Fetching Effects ---

  // 1. Sync URL searchParams -> Form state
  // This runs on page load and on back/forward navigation
  useEffect(() => {
    const values: FormValues = {
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      minMileage: searchParams.get('minMileage') ?? '',
      maxMileage: searchParams.get('maxMileage') ?? '',
      manufacturerId: searchParams.get('manufacturerId') ? Number(searchParams.get('manufacturerId')) : null,
      carModelId: searchParams.get('carModelId') ? Number(searchParams.get('carModelId')) : null,
      generationId: searchParams.get('generationId') ? Number(searchParams.get('generationId')) : null,
      modificationId: searchParams.get('modificationId') ? Number(searchParams.get('modificationId')) : null,
    };
    reset(values); // `reset` updates the form state
  }, [searchParams, reset]);

  // 2. Fetch initial manufacturers
  useEffect(() => {
    getAllManufacturers().then(setManufacturers).catch(console.error);
  }, []);

  // 3. Fetch models when manufacturer changes
  //    (This no longer resets child fields)
  useEffect(() => {
    if (!watchedManufacturer) {
      setModels([]);
      return;
    }
    getModelsByManufacturer(watchedManufacturer).then(setModels).catch(console.error);
  }, [watchedManufacturer]);

  // 4. Fetch generations when model changes
  //    (This no longer resets child fields)
  useEffect(() => {
    if (!watchedModel) {
      setGenerations([]);
      return;
    }
    getGenerationsByModel(watchedModel).then(setGenerations).catch(console.error);
  }, [watchedModel]);

  // 5. Fetch modifications when generation changes
  //    (This no longer resets child fields)
  useEffect(() => {
    if (!watchedGeneration) {
      setModifications([]);
      return;
    }
    getModificationsByGeneration(watchedGeneration).then(setModifications).catch(console.error);
  }, [watchedGeneration]);

  // --- Form Handlers ---
  const onFind = (values: FormValues) => {
    const params = new URLSearchParams();
    if (values.minPrice) params.set('minPrice', values.minPrice);
    if (values.maxPrice) params.set('maxPrice', values.maxPrice);
    if (values.minMileage) params.set('minMileage', values.minMileage);
    if (values.maxMileage) params.set('maxMileage', values.maxMileage);
    if (values.manufacturerId) params.set('manufacturerId', String(values.manufacturerId));
    if (values.carModelId) params.set('carModelId', String(values.carModelId));
    if (values.generationId) params.set('generationId', String(values.generationId));
    if (values.modificationId) params.set('modificationId', String(values.modificationId));

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const handleClear = () => {
    reset({
      // Reset form to empty values
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      manufacturerId: null,
      carModelId: null,
      generationId: null,
      modificationId: null,
    });
    router.push(pathname); // Navigate to base page
  };

  // --- Render ---

  // Show loading state for the *listings*
  const renderListings = () => {
    if (loading) {
      return <div className="p-4">Loading listings...</div>;
    }
    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }
    if (listings.length === 0) {
      return <div className="text-center text-muted-foreground">No listings found matching your criteria</div>;
    }
    return (
      <div className="space-y-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* --- Filters Column --- */}
        <div className="lg:col-span-1">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Filter Listings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onFind)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice">Min Price</Label>
                    <Input id="minPrice" type="number" {...register('minPrice')} placeholder="Min price" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price</Label>
                    <Input id="maxPrice" type="number" {...register('maxPrice')} placeholder="Max price" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minMileage">Min Mileage</Label>
                    <Input id="minMileage" type="number" {...register('minMileage')} placeholder="Min mileage" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMileage">Max Mileage</Label>
                    <Input id="maxMileage" type="number" {...register('maxMileage')} placeholder="Max mileage" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Manufacturer</Label>
                  <Select
                    value={watchedManufacturer?.toString() ?? undefined}
                    onValueChange={(val) => {
                      setValue('manufacturerId', val ? Number(val) : null);
                      // **FIX:** Reset child fields on user change
                      setValue('carModelId', null);
                      setValue('generationId', null);
                      setValue('modificationId', null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={watchedModel?.toString() ?? undefined}
                    onValueChange={(val) => {
                      setValue('carModelId', val ? Number(val) : null);
                      // **FIX:** Reset child fields on user change
                      setValue('generationId', null);
                      setValue('modificationId', null);
                    }}
                    disabled={!watchedManufacturer || models.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Generation</Label>
                  <Select
                    value={watchedGeneration?.toString() ?? undefined}
                    onValueChange={(val) => {
                      setValue('generationId', val ? Number(val) : null);
                      // **FIX:** Reset child fields on user change
                      setValue('modificationId', null);
                    }}
                    disabled={!watchedModel || generations.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select generation" />
                    </SelectTrigger>
                    <SelectContent>
                      {generations.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Modification</Label>
                  <Select
                    value={getValues('modificationId')?.toString() ?? undefined}
                    onValueChange={(val) => setValue('modificationId', val ? Number(val) : null)}
                    disabled={!watchedGeneration || modifications.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select modification" />
                    </SelectTrigger>
                    <SelectContent>
                      {modifications.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={handleClear} className="w-full">
                    Clear
                  </Button>
                  <Button type="submit" className="w-full">
                    Find
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- Listings Column --- */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
          {renderListings()}
        </div>
      </div>
    </div>
  );
}
