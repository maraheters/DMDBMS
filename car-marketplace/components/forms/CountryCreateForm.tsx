import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FormInputField } from '../FormInputField';
import { create } from '@/lib/queries/country.queries';

export default function CountryCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');

  const setDefaultStates = () => {
    setName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name is required.');
      return;
    }

    try {
      await create(trimmedName);
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
          <FormInputField
            id="name"
            type="text"
            placeholder="Country name..."
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
