import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CarModel, Manufacturer } from '@/types';
import { Button } from '../ui/button';
import { getAll as getAllManufacturers } from '@/lib/queries/manufacturer.queries';
import { getAllByManufacturer } from '@/lib/queries/car-model.queries';
import { FormSelectField } from '../FormSelectField';
import { FormInputField } from '../FormInputField';

export default function GenerationCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [manufacturerId, setManufacturerId] = useState<number | null>(null);
  const [carModelId, setCarModelId] = useState<number | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);

  useEffect(() => {
    // Fetch manufacturers from the API
    const fetchManufacturers = async () => {
      try {
        const response = await getAllManufacturers();
        setManufacturers(response);
      } catch (err) {
        setError('Failed to fetch manufacturers.');
      }
    };

    fetchManufacturers();
  }, []);

  useEffect(() => {
    // Fetch car models when a manufacturer is selected
    const fetchCarModels = async () => {
      if (!manufacturerId) return;
      try {
        const response = await getAllByManufacturer(manufacturerId);
        console.log(response);
        setCarModels(response);
      } catch (err) {
        setError('Failed to fetch car models.');
        console.error(err);
      }
    };

    fetchCarModels();
  }, [manufacturerId]);

  const setDefaultStates = () => {
    setName('');
    setStartYear('');
    setManufacturerId(null);
    setCarModelId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedStartYear = startYear.trim();

    if (!trimmedName || !trimmedStartYear || !carModelId) {
      setError('All fields are required.');
      return;
    }

    if (carModelId === null) {
      setError('Car model must be selected.');
      return;
    }

    const request = {
      name: trimmedName,
      carModelId: carModelId,
      startYear: Number(startYear),
    };

    try {
      await create(request);
      setDefaultStates();
    } catch (err) {
      setError('Failed to create generation.');
      console.error(err);
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Generation Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormSelectField
            htmlFor="manufacturer"
            label="Manufacturer"
            placeholder="Select a manufacturer..."
            options={manufacturers}
            onValueChange={(value) => setManufacturerId(Number(value))}
            required
          />
          <FormSelectField
            htmlFor="carModel"
            label="Car Model"
            placeholder="Select a car model..."
            options={carModels}
            onValueChange={(value) => setCarModelId(Number(value))}
            disabled={!manufacturerId}
            required
          />

          <FormInputField
            id="generationName"
            label="Generation Name"
            type="text"
            placeholder="Enter generation name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInputField
            id="startYear"
            label="Starting year"
            type="number"
            min="1886"
            placeholder="Enter starting year..."
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            required
          />

          <Button type="submit" className="w-full mt-5">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
