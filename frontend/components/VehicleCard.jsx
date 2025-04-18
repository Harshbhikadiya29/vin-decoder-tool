import React from 'react';
import { Card, Image, Text, Group } from '@mantine/core';

const VehicleCard = ({ vehicleResponse, vehicleImage }) => {
  if (!vehicleResponse || !vehicleImage) {
    return null;
  }
  const { make, model, year, vin } = vehicleResponse;
  const imageUrl = vehicleImage;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mt={20}
      style={{
        backgroundColor: 'var(--mantine-card-bg)',
        color: 'var(--mantine-text-color)',
      }}
    >
      <Card.Section>
        <Image
          src={imageUrl}
          alt={make}
          caption={`${year} ${make} ${model}`}
          fit="contain"
          style={{ borderRadius: 'var(--mantine-radius)' }}
          withPlaceholder
          placeholder={<Text>Loading...</Text>}
          error={<Text>Image not available</Text>}
          height={240}
          width={400}
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={700} size="xl" color="var(--mantine-text-color)">
          {year} {make} {model}
        </Text>
      </Group>

      <Text size="sm" color="dimmed">
        VIN: {vin}
      </Text>
    </Card>
  );
};

export default VehicleCard;