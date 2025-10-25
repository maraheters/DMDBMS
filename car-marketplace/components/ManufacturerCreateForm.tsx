import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FormInputField } from './FormInputField';

export default function ManufacturerCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const setDefaultStates = () => {
    setName('');
    setCountry('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName || !trimmedCountry) {
      setError('Name and country are required.');
      return;
    }

    const request = {
      name: trimmedName,
      country: trimmedCountry,
    };

    try {
      await create(request);
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
        <form>
          <FormInputField
            id="name"
            type="text"
            placeholder="Model name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
            required
          />
          <FormInputField
            id="country"
            type="text"
            placeholder="Manufacturer country..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            label="Country"
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
