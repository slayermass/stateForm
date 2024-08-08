useStateForm

data types can be easily written by example

data types' tests should only contain testing its validator, not the form itself

## внутренности
- event bus
  
  отдельная функция/класс с методами event bus у каждой стейт формы. Например:
  ```
  EventBus.emit(<fieldName>, <type>);
  
  EventBus.on(<fieldName>, <type>, <callback>);
  ```
## прочее
- тесты required и not required
- отказаться от такого вида имен
  `arrayProp[0].name`
  и делать только такие `arrayProp.0.name`
