// Соответствует JSON-ответу бэкенда (CategorySerializer)
export interface Category {
  id:   number;
  name: string;
}

// Соответствует JSON-ответу бэкенда (PropertySerializer)
export interface Product {
  id:             number;
  title:          string;
  description:    string;
  price:          number;        // строка от Django → number после маппинга
  rooms:          number;
  location:       string;
  is_available:   boolean;
  image_url:      string | null;
  category:       Category | null;  // вложенный объект {id, name}
  category_id?:   number;           // только при записи
  owner:          number;
  owner_username: string;
}