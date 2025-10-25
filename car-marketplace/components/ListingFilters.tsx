import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getAll as getAllManufacturers } from '@/lib/queries/manufacturer.queries';
import { getAllByManufacturer as getModelsByManufacturer } from '@/lib/queries/car-model.queries';
import { getAllByCarModel as getGenerationsByModel } from '@/lib/queries/generation.queries';
import { getAllByGeneration as getModificationsByGeneration } from '@/lib/queries/modification.queries';
import { Manufacturer, CarModel, Generation, Modification } from '@/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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

export default function ListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValues: FormValues = {
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    minMileage: searchParams.get('minMileage') ?? '',
    maxMileage: searchParams.get('maxMileage') ?? '',
    manufacturerId: searchParams.get('manufacturerId') ? Number(searchParams.get('manufacturerId')) : null,
    carModelId: searchParams.get('carModelId') ? Number(searchParams.get('carModelId')) : null,
    generationId: searchParams.get('generationId') ? Number(searchParams.get('generationId')) : null,
    modificationId: searchParams.get('modificationId') ? Number(searchParams.get('modificationId')) : null,
  };

  const { register, handleSubmit, watch, setValue, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialValues,
  });

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  const watchedManufacturer = watch('manufacturerId');
  const watchedModel = watch('carModelId');
  const watchedGeneration = watch('generationId');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllManufacturers();
        if (!mounted) return;
        setManufacturers(data);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setModels([]);
    setGenerations([]);
    setModifications([]);
    setValue('carModelId', null);
    setValue('generationId', null);
    setValue('modificationId', null);

    if (!watchedManufacturer) return;
    getModelsByManufacturer(watchedManufacturer).then(setModels).catch(console.error);
  }, [watchedManufacturer, setValue]);

  useEffect(() => {
    setGenerations([]);
    setModifications([]);
    setValue('generationId', null);
    setValue('modificationId', null);

    if (!watchedModel) return;
    getGenerationsByModel(watchedModel).then(setGenerations).catch(console.error);
  }, [watchedModel, setValue]);

  useEffect(() => {
    setModifications([]);
    setValue('modificationId', null);

    if (!watchedGeneration) return;
    getModificationsByGeneration(watchedGeneration).then(setModifications).catch(console.error);
  }, [watchedGeneration, setValue]);

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

    const newQuery = params.toString();
    if (newQuery !== searchParams.toString()) {
      router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
    }
  };

  const handleClear = () => {
    reset({
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      manufacturerId: null,
      carModelId: null,
      generationId: null,
      modificationId: null,
    });
    router.push(pathname);
  };

  return (
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
              onValueChange={(val) => setValue('manufacturerId', val ? Number(val) : null)}
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
              onValueChange={(val) => setValue('carModelId', val ? Number(val) : null)}
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
              onValueChange={(val) => setValue('generationId', val ? Number(val) : null)}
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
  );
}
