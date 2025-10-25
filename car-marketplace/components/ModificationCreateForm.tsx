import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CarModel, Generation, Manufacturer } from '@/types';
import { Button } from './ui/button';
import { getAll as getAllManufacturers } from '@/lib/queries/manufacturer.queries';
import { getAllByManufacturer } from '@/lib/queries/car-model.queries';
import { getAllByCarModel } from '@/lib/queries/generation.queries';
import { FormInputField } from './FormInputField';
import { FormSelectField } from './FormSelectField';

export default function ModificationCreateForm() {
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [manufacturerId, setManufacturerId] = useState<number | null>(null);
  const [carModelId, setCarModelId] = useState<number | null>(null);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [drivetrain, setDrivetrain] = useState<string>('');
  const [engineType, setEngineType] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [horsepower, setHorsepower] = useState<string>('');
  const [torque, setTorque] = useState<string>('');
  const [transmissionType, setTransmissionType] = useState<string>('');
  const [numberOfGears, setNumberOfGears] = useState<string>('');

  useEffect(() => {
    // Fetch manufacturers
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
        setCarModels(response);
      } catch (err) {
        setError('Failed to fetch car models.');
      }
    };

    fetchCarModels();
  }, [manufacturerId]);

  useEffect(() => {
    // Fetch generations when a car model is selected
    const fetchGenerations = async () => {
      if (!carModelId) return;
      try {
        const response = await getAllByCarModel(carModelId);
        setGenerations(response);
      } catch (err) {
        setError('Failed to fetch generations.');
      }
    };

    fetchGenerations();
  }, [carModelId]);

  const setDefaultStates = () => {
    setName('');
    setManufacturerId(null);
    setCarModelId(null);
    setGenerationId(null);
    setDrivetrain('');
    setEngineType('');
    setFuelType('');
    setHorsepower('');
    setTorque('');
    setTransmissionType('');
    setNumberOfGears('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name ||
      !manufacturerId ||
      !carModelId ||
      !generationId ||
      !drivetrain ||
      !engineType ||
      !fuelType ||
      !horsepower ||
      !torque ||
      !transmissionType ||
      !numberOfGears
    ) {
      setError('All fields are required.');
      return;
    }

    const request: ModificationCreateRequest = {
      name: name.trim(),
      generationId,
      drivetrain: { type: drivetrain.trim() },
      engine: {
        type: engineType.trim(),
        fuelType: fuelType.trim(),
        horsepower: Number(horsepower),
        torque: Number(torque),
      },
      transmission: {
        type: transmissionType.trim(),
        numberOfGears: Number(numberOfGears),
      },
    };

    try {
      await create(request);
      setDefaultStates();
    } catch (err) {
      setError('Failed to create modification.');
      console.error(err);
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Modification Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
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
          <FormSelectField
            htmlFor="generation"
            label="Generation"
            placeholder="Select a generation..."
            options={generations}
            onValueChange={(value) => setGenerationId(Number(value))}
            disabled={!carModelId}
            required
          />

          <FormInputField
            id="modificationName"
            label="Modification Name"
            type="text"
            placeholder="Enter modification name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInputField
            id="drivetrain"
            label="Drivetrain"
            type="text"
            placeholder="Enter drivetrain type..."
            value={drivetrain}
            onChange={(e) => setDrivetrain(e.target.value)}
            required
          />
          <FormInputField
            id="engineType"
            label="Engine Type"
            type="text"
            placeholder="Enter engine type..."
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
            required
          />
          <FormInputField
            id="fuelType"
            label="Fuel Type"
            type="text"
            placeholder="Enter fuel type..."
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
          />
          <FormInputField
            id="horsepower"
            label="Horsepower"
            type="number"
            placeholder="Enter horsepower..."
            value={horsepower}
            onChange={(e) => setHorsepower(e.target.value)}
            required
          />
          <FormInputField
            id="torque"
            label="Torque"
            type="number"
            placeholder="Enter torque..."
            value={torque}
            onChange={(e) => setTorque(e.target.value)}
            required
          />
          <FormInputField
            id="transmissionType"
            label="Transmission Type"
            type="text"
            placeholder="Enter transmission type..."
            value={transmissionType}
            onChange={(e) => setTransmissionType(e.target.value)}
            required
          />
          <FormInputField
            id="numberOfGears"
            label="Number of Gears"
            type="number"
            placeholder="Enter number of gears..."
            value={numberOfGears}
            onChange={(e) => setNumberOfGears(e.target.value)}
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
