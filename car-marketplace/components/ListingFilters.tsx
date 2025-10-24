import { useState, useEffect } from 'react';
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
import z from 'zod';

const schema = z.object({
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minMileage: z.string().optional(),
  maxMileage: z.string().optional(),
  manufacturerId: z.number().optional(),
  carModelId: z.number().optional(),
  generationId: z.number().optional(),
  modificationId: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Listing-specific filters
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minMileage, setMinMileage] = useState(searchParams.get('minMileage') || '');
  const [maxMileage, setMaxMileage] = useState(searchParams.get('maxMileage') || '');

  // Catalog-specific filters
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  const [selectedManufacturer, setSelectedManufacturer] = useState(searchParams.get('manufacturerId') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('carModelId') || '');
  const [selectedGeneration, setSelectedGeneration] = useState(searchParams.get('generationId') || '');
  const [selectedModification, setSelectedModification] = useState(searchParams.get('modificationId') || '');

  // Load manufacturers on mount
  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        const data = await getAllManufacturers();
        setManufacturers(data);
      } catch (error) {
        console.error('Failed to load manufacturers:', error);
      }
    };
    loadManufacturers();
  }, []);

  // Load models when manufacturer is selected
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedManufacturer) {
        setModels([]);
        setSelectedModel('');
        setSelectedGeneration('');
        setSelectedModification('');
        return;
      }
      try {
        // Only fetch if manufacturerId is a valid number
        const manufacturerId = parseInt(selectedManufacturer);
        if (isNaN(manufacturerId)) return;

        const data = await getModelsByManufacturer(manufacturerId);
        setModels(data);

        // If the current selectedModel is not in the new list, clear it
        if (selectedModel && !data.some((m) => m.id.toString() === selectedModel)) {
          setSelectedModel('');
          setSelectedGeneration('');
          setSelectedModification('');
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedManufacturer]);

  // Load generations when model is selected
  useEffect(() => {
    const loadGenerations = async () => {
      if (!selectedModel) {
        setGenerations([]);
        setSelectedGeneration('');
        setSelectedModification('');
        return;
      }
      try {
        const modelId = parseInt(selectedModel);
        if (isNaN(modelId)) return;

        const data = await getGenerationsByModel(modelId);
        setGenerations(data);

        // If the current selectedGeneration is not in the new list, clear it
        if (selectedGeneration && !data.some((g) => g.id.toString() === selectedGeneration)) {
          setSelectedGeneration('');
          setSelectedModification('');
        }
      } catch (error) {
        console.error('Failed to load generations:', error);
      }
    };
    loadGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel]);

  // Load modifications when generation is selected
  useEffect(() => {
    const loadModifications = async () => {
      if (!selectedGeneration) {
        setModifications([]);
        setSelectedModification('');
        return;
      }
      try {
        // getModificationsByGeneration expects string ID based on original code
        const data = await getModificationsByGeneration(parseInt(selectedGeneration));
        setModifications(data);

        // If the current selectedModification is not in the new list, clear it
        if (selectedModification && !data.some((m) => m.id.toString() === selectedModification)) {
          setSelectedModification('');
        }
      } catch (error) {
        console.error('Failed to load modifications:', error);
      }
    };
    loadModifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGeneration]);

  const handleApplyFilters = () => {
    // Create params object from *current* searchParams to preserve other params
    const params = new URLSearchParams(searchParams.toString());

    // Helper to set or delete param if value is empty
    const setOrDeleteParam = (key: string, value: string) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    // Add/Remove listing-specific filters
    setOrDeleteParam('minPrice', minPrice);
    setOrDeleteParam('maxPrice', maxPrice);
    setOrDeleteParam('minMileage', minMileage);
    setOrDeleteParam('maxMileage', maxMileage);

    // Add/Remove catalog-specific filters
    setOrDeleteParam('manufacturerId', selectedManufacturer);
    setOrDeleteParam('carModelId', selectedModel);
    setOrDeleteParam('generationId', selectedGeneration);
    setOrDeleteParam('modificationId', selectedModification);

    // Update URL with new params using router.push
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    // Clear all local state
    setMinPrice('');
    setMaxPrice('');
    setMinMileage('');
    setMaxMileage('');
    setSelectedManufacturer('');
    setSelectedModel('');
    setSelectedGeneration('');
    setSelectedModification('');

    // Navigate to the base pathname without any search params
    router.push(pathname);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filter Listings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minMileage">Min Mileage</Label>
            <Input
              id="minMileage"
              type="number"
              value={minMileage}
              onChange={(e) => setMinMileage(e.target.value)}
              placeholder="Min mileage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMileage">Max Mileage</Label>
            <Input
              id="maxMileage"
              type="number"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
              placeholder="Max mileage"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Manufacturer</Label>
          <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                  {manufacturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedManufacturer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Generation</Label>
          <Select value={selectedGeneration} onValueChange={setSelectedGeneration} disabled={!selectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select generation" />
            </SelectTrigger>
            <SelectContent>
              {generations.map((generation) => (
                <SelectItem key={generation.id} value={generation.id.toString()}>
                  {generation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modification</Label>
          <Select value={selectedModification} onValueChange={setSelectedModification} disabled={!selectedGeneration}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select modification" />
            </SelectTrigger>
            <SelectContent>
              {modifications.map((modification) => (
                <SelectItem key={modification.id} value={modification.id.toString()}>
                  {modification.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleClearFilters} className="w-full">
              Clear
            </Button>
            <Button onClick={handleApplyFilters} className="w-full">
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
