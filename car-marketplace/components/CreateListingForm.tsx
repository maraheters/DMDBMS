'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAll as getAllManufacturers } from '@/lib/queries/manufacturer.queries';
import { getAllByManufacturer as getModelsByManufacturer } from '@/lib/queries/car-model.queries';
import { getAllByCarModel as getGenerationsByModel } from '@/lib/queries/generation.queries';
import { getAllByGeneration as getModificationsByGeneration } from '@/lib/queries/modification.queries';
import { redirect } from 'next/navigation';
import { CarModel, Generation, Manufacturer, Modification } from '@/types';
import { submitListing } from '@/app/actions';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  manufacturerId: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v > 0, { message: 'Please select a manufacturer.' }),
  modelId: z.coerce.number().refine((v) => !Number.isNaN(v) && v > 0, { message: 'Please select a model.' }),
  generationId: z.coerce.number().refine((v) => !Number.isNaN(v) && v > 0, { message: 'Please select a generation.' }),
  modificationId: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v) && v > 0, { message: 'Please select a modification.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be a positive number.' }),
  mileage: z.coerce.number().min(0, { message: 'Mileage cannot be negative.' }),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, { message: 'At least one image is required.' }),
  documents: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateListingForm() {
  const [apiError, setApiError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  const form = useForm<Partial<FormValues>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      manufacturerId: undefined,
      modelId: undefined,
      generationId: undefined,
      modificationId: undefined,
      price: undefined,
      mileage: undefined,
      description: '',
      images: [],
      documents: [],
    },
  });

  const manufacturerId = form.watch('manufacturerId');
  const modelId = form.watch('modelId');
  const generationId = form.watch('generationId');

  // Fetch manufacturers on component mount
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await getAllManufacturers();
        setManufacturers(response);
      } catch {
        setApiError('Failed to fetch manufacturers');
      }
    };
    fetchManufacturers();
  }, []);

  // Fetch car models when manufacturer is selected
  useEffect(() => {
    const fetchCarModels = async () => {
      setCarModels([]);
      setGenerations([]);
      setModifications([]);

      form.resetField('modelId');
      form.resetField('generationId');
      form.resetField('modificationId');

      if (!manufacturerId) return;

      try {
        const response = await getModelsByManufacturer(manufacturerId as number);
        setCarModels(response);
      } catch {
        setApiError('Failed to fetch car models');
      }
    };
    fetchCarModels();
  }, [manufacturerId]);

  // Fetch generations when car model is selected
  useEffect(() => {
    const fetchGenerations = async () => {
      setGenerations([]);
      setModifications([]);
      form.resetField('generationId');
      form.resetField('modificationId');

      if (!modelId) return;

      try {
        const response = await getGenerationsByModel(modelId as number);
        setGenerations(response);
      } catch {
        setApiError('Failed to fetch generations');
      }
    };
    fetchGenerations();
  }, [modelId]);

  // Fetch modifications when generation is selected
  useEffect(() => {
    const fetchModifications = async () => {
      setModifications([]);
      form.resetField('modificationId');

      if (!generationId) return;

      try {
        const response = await getModificationsByGeneration(generationId as number);
        setModifications(response);
      } catch {
        setApiError('Failed to fetch modifications');
      }
    };
    fetchModifications();
  }, [generationId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Revoke old previews to prevent memory leaks
    imagePreviews.forEach(URL.revokeObjectURL);

    if (e.target.files) {
      const files = Array.from(e.target.files);
      form.setValue('images', files as any, { shouldValidate: true });
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    } else {
      form.setValue('images', [] as any, { shouldValidate: true });
      setImagePreviews([]);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = (form.getValues('images') || []) as File[];
    const newImages = [...currentImages];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    form.setValue('images', newImages as any, { shouldValidate: true });
    setImagePreviews(newPreviews);
  };

  useEffect(
    () => () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    },
    [imagePreviews],
  );

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      form.setValue('documents', files as any, { shouldValidate: true });
      setDocumentNames(files.map((f) => f.name));
    } else {
      form.setValue('documents', [] as any);
      setDocumentNames([]);
    }
  };

  const onSubmit: SubmitHandler<Partial<FormValues>> = async (values) => {
    setApiError('');

    if (
      !values.title ||
      !values.modificationId ||
      typeof values.price !== 'number' ||
      typeof values.mileage !== 'number' ||
      !values.images ||
      values.images.length === 0
    ) {
      setApiError('Please fill all required fields correctly.');
      return;
    }

    try {
      await submitListing(values as any);
    } catch (err) {
      console.error(err);
      setApiError('Failed to create listing.');
    }

    if (apiError === '') redirect('/listings');
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {apiError && <p className="text-sm font-medium text-red-500">{apiError}</p>}

            {/* Manufacturer */}
            <FormField
              control={form.control as any}
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === '' ? undefined : Number.parseInt(value))}
                    value={field.value?.toString() ?? ''}
                    disabled={manufacturers.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model */}
            <FormField
              control={form.control as any}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === '' ? undefined : Number.parseInt(value))}
                    value={field.value?.toString() ?? ''}
                    disabled={!manufacturerId || carModels.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carModels.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generation */}
            <FormField
              control={form.control as any}
              name="generationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generation</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === '' ? undefined : Number.parseInt(value))}
                    value={field.value?.toString() ?? ''}
                    disabled={!modelId || generations.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select generation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generations.map((generation) => (
                        <SelectItem key={generation.id} value={generation.id.toString()}>
                          {generation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modification */}
            <FormField
              control={form.control as any}
              name="modificationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modification</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === '' ? undefined : Number.parseInt(value))}
                    value={field.value?.toString() ?? ''}
                    disabled={!generationId || modifications.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select modification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modifications.map((modification) => (
                        <SelectItem key={modification.id} value={modification.id.toString()}>
                          {modification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control as any}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value ?? ''}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mileage */}
            <FormField
              control={form.control as any}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter mileage"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value ?? ''}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter description" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control as any}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isSubmitting}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Documents */}
            <FormField
              control={form.control as any}
              name="documents"
              render={() => (
                <FormItem>
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="application/pdf,application/msword"
                      onChange={handleDocumentChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {documentNames.length > 0 && (
              <ul>
                {documentNames.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
