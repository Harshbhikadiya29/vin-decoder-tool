import { Card, Text, Group, Image, Stack } from '@mantine/core';

function VehicleListingCard({ key, item }) {
  return (
    <Card
      shadow="sm"
      padding={0} // Remove padding so image can go full width
      withBorder
      radius="md"
      key={`${key}_${item.title}`}
      onClick={() => window.open(item.link, '_blank')}
      style={{
        overflow: 'hidden',
        height: '100%',
        maxHeight: '500px',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <Group
        noWrap
        align="stretch"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 300, padding: '1rem' }}>
          <Stack spacing="xs">
            <Text weight={500} size="lg">{item.title}</Text>
            <Text size="sm" color="dimmed">{item.snippet}</Text>
            <Text
              size="xs"
              color="blue"
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.displayLink}
            </Text>
          </Stack>
        </div>

        {/* Image */}
        {item.image && (
          <div
            className="image-container"
            onClick={() => window.open(item.link, '_blank')}
          >
            <Image
              src={item.image}
              alt={item.title}
              className='listing_image'
              fit="cover"
              withPlaceholder
            />
          </div>
        )}
      </Group>
    </Card>
  );
}

export default VehicleListingCard;
