useStateForm

# todo
## типы данных (модули)
- date (string)
- phone (string)
- time (string)
- time (Date)
- file (File)
- files (File[])
- image (File)
- boolean (Boolean)
- color
- checkbox
- dropdown

## внутренности
- event bus
  
  отдельная функция/класс с методами event bus у каждой стейт формы. Например:
  ```
  EventBus.emit(<fieldName>, <type>);
  
  EventBus.on(<fieldName>, <type>, <callback>);
  ```
## прочее
- найти узкие места и улучшить их
- отказаться от такого вида имен
  `arrayProp[0].name`
  и делать только такие `arrayProp.0.name`
