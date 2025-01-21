useStateForm

data types can be easily written by example

data types' tests should only contain testing its validator, not the form itself

## прочее
- useStateFormFieldArray custom id prop (любой строковый на случай пересечения с id)
- тесты required и not required
- отказаться от такого вида имен
  `arrayProp[0].name`
  и делать только такие `arrayProp.0.name`
