import { render, screen } from '@testing-library/react';
import App from './App';

test('debería mostrar Loading... mientras se carga un componente', () => {
  render(
      <App />
  );

  // Verifica si "Loading..." es mostrado mientras se carga el componente
  expect(screen.getByText(/loading.../i)).toBeTruthy();
});
