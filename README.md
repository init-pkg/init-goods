# Goods

<p align="center">
 <a href="https://init.kz/en">
  <img src="assets/favicon.svg" width="100" height="100" alt="Logo">
 </a>
</p>

Some useful utils that imroves quality of live when developing in our primary stack

## Installation

```sh
npm install @init-kz/goods
```

## API

### `useDeatiledEffect()`

useEffect with additional options for different cases

```js
useDetailedEffect(
  () => {
    // Your effect here
  },
  [deps],
  { skipFirstRender: true, stringifyDeps: true }
);
```

##### Options

- `skipFirstRender` - skips effect call on first render of component
- `stringifyDeps` - converts all objects deps to strings

### `useClickOutside()`

Applies globalEventListener with cleanup, that triggers event when click occures outside a ref

```js
useClickOutside(ref, (event) => {
  console.log("Clicked outside ref");
});
```

##### Options

- `ref` - ref of element that will be a safe zone
- `event` - click event instance

## INFO

This package in active phase of development, if you encounter an issue visit [github issues](https://github.com/init-pkg/init-goods/issues)

### Contributing

Contributions are welcome! Feel free to submit issues or open pull requests to improve the project.

## License

```
The MIT License

Copyright (c) 2025 INIT.KZ
```
