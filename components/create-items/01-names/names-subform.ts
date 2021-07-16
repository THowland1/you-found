import { v4 } from 'uuid';

function generatePlaceholder() {
  const names = [
    'Rucksack',
    'Bike',
    'Headphones',
    'Jacket',
    'Scooter',
    'Umbrella',
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  return `e.g. ${name}`;
}

export class Item {
  id = v4();
  name = '';
  placeholder = generatePlaceholder();
}

export class NamesSubform {
  items = [new Item()];
}
