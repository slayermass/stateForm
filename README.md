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

## прочее
- измерить время выполнения формы
- найти узкие места и улучшить их
