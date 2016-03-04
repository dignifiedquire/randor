# Randor

> *Big Bad Tests* for IPFS

![](https://ipfs.io/ipfs/QmdULkTfwgoqVCGce3Ngdg4jsdC6PHprKmHYGRud22xBSN/)

## Running

You need will node >= 4 and npm >= 3.

```bash
$ npm install
$ IPFS_EXEC=$GOPATH/bin/ipfs bin/randor run
```

### Options

You can pass the following options to `randor run`,

#### `--limit <number> -l <number>`

- **Default:** `100`
- **Description:** Execute this amount of operations and then stop.

#### `--berserk`

- **Default:** `false`
- **Description:** Run forever with no limit, until stopped.

#### `--write -w`

- **Default:** `true`
- **Description:** Write an operations log into `store.json`.

#### `--read -r`

- **Default:** `false`
- **Description:** Read operations from a log in `store.json`.

#### `--size`

- **Default:** `false`
- **Description:** Print the IPFS repo size every second.

#### `--parallel <number> -p <number>`

- **Default:** `1`
- **Description:** Execute operations in parallel. `1` is equivalent to
  serial execution.

### `--operations <list of ops> -o <list of ops`

- **Default:** `undefined`
- **Description:** Execute only these operations. List should be seperated by `,`. Currently available are
  - `add`
  - `files-write`
  - `object-patch-add-link`
  - `object-patch-append-data`
  - `pin-rm`
