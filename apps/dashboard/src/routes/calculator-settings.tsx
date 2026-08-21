import { createFileRoute } from '@tanstack/react-router';
import CalculatorSettings from '../components/CalculatorSettings';

export const Route = createFileRoute('/calculator-settings')({ component: CalculatorSettings });
