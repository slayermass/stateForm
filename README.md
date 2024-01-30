useStateForm

# todo
## типы данных (модули)
- number (Number)
- date (string)
- date (Date)
- rich text (любой wysiwyg)
- phone (string)
- time (string)
- time (Date)
- file (File)
- files (File[])
- image (File)
- boolean (Boolean)

## внутренности
- event bus
  
  отдельная функция/класс с методами event bus у каждой стейт формы. Например:
  ```
  EventBus.emit(<fieldName>, <type>);
  
  EventBus.on(<fieldName>, <type>, <callback>);
  ```
- cloneDeep умеющий все (BigInt issue)

## прочее
- измерить время выполнения формы
- найти узкие места и улучшить их
- previousFormState нужен??
- отказаться от такого вида имен
  `arrayProp[0].name`
  и делать только такие `arrayProp.0.name`
