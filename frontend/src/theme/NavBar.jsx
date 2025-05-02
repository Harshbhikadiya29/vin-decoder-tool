import React, { useState } from 'react';
import { Container, Group, Button, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars, IconCode } from '@tabler/icons-react';

export default function NavBar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000', padding: '10px 0', width: '100%', backgroundColor: colorScheme === 'dark' ? '#1A1B1E' : '#F5F5F5' }}>
      <Container className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 20px', margin: '0', width: '100%', 'maxWidth': '100%' }}>
        <Group style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
          <IconCode size={30} color={colorScheme === 'dark' ? '#F5F5F5' : '#1A1B1E'} style={{ marginTop: '5px' }} />
          <span style={{ fontSize: 20, fontWeight: 'bold', color: colorScheme === 'dark' ? '#F5F5F5' : '#1A1B1E' }}>
            VIN Decoder Tool
          </span>
        </Group>
        <Group>
          <ActionIcon
            variant="outline"
            size={35}
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
          <Button onClick={handleAuth} variant="outline">
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </Group>
      </Container>
    </div>
  );
}