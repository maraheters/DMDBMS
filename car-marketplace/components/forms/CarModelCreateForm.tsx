import { useEffect, useState } from 'react';
import { Card, CardTitle, CardHeader, CardContent } from '../ui/card';
import { Manufacturer } from '@/types';
import { Button } from '../ui/button';
import { getAll } from '@/lib/queries/manufacturer.queries';
import { FormInputField } from '../FormInputField';
import { FormSelectField } from '../FormSelectField';

export default function CarModelCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [manufacturerId, setManufacturerId] = useState<number>();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await getAll();
        setManufacturers(response);
      } catch (err) {
        setError('Failed to fetch manufacturers.');
      }
    };

    fetchManufacturers();
  }, []);

  const setDefaultStates = () => {
    setName('');
    setManufacturerId(undefined);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedId = manufacturerId;

    if (!trimmedName || !trimmedId) {
      setError('Name and manufacture id are required.');
      return;
    }

    const request = {
      name: trimmedName,
      manufacturerId: trimmedId,
    };

    try {
      await create(request);
      setDefaultStates();
    } catch (err) {
      setError('Failed to create car model.');
      console.error(err);
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Car Model Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormSelectField
            htmlFor="manufacturer"
            label="Manufacturer"
            placeholder="Select a manufacturer..."
            options={manufacturers}
            onValueChange={(value) => setManufacturerId(Number(value))}
          />
          <FormInputField
            id="name"
            type="text"
            placeholder="Car model name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            label="Name"
          />
          <Button type="submit" className="w-full mt-5">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
