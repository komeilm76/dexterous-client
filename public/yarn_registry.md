# To unset the registry you previously set in Yarn 1, run:

```bash
yarn config delete registry
```

# For Yarn 1.x, you can create a .yarnrc file in your project root or home directory with the following content to set a registry mirror (e.g., the fast Taobao mirror):

```text
registry "https://registry.npmmirror.com"
```

# To set it via command line:

```bash
yarn config set registry https://registry.npmmirror.com
```

# example of install some package with npm mirror:

```bash
yarn add lodash --registry https://registry.npmmirror.com
```
