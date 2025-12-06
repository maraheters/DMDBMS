import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FormInputField } from '../FormInputField';
import { FormSelectField } from '../FormSelectField';
import { Country } from '@/types';
import { getAll as getAllCountries } from '@/lib/queries/country.queries';
import { create } from '@/lib/queries/manufacturer.queries';

export default function ManufacturerCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryId, setCountryId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch countries from the API
    const fetchCountries = async () => {
      try {
        const response = await getAllCountries();
        setCountries(response);
      } catch (err) {
        setError('Failed to fetch manufacturers.');
      }
    };

    fetchCountries();
  }, []);

  const setDefaultStates = () => {
    setName('');
    setCountryId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || !countryId) {
      setError('Name and country are required.');
      return;
    }

    try {
      await create(trimmedName, countryId);
      setDefaultStates();
    } catch (err) {
      setError('Failed to create manufacturer.');
      console.error(err);
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Manufacturer Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormSelectField
            htmlFor="country"
            placeholder="Manufacturer country..."
            options={countries}
            onValueChange={(value) => setCountryId(Number(value))}
            label="Country"
            required
          />
          <FormInputField
            id="name"
            type="text"
            placeholder="Model name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
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
