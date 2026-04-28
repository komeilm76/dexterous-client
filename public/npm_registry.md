# To unset the registry you previously set in npm, run:

```bash
npm config delete registry https://registry.npmmirror.com
```

# For npm, you can create a .npmrc file in your project root or home directory with the following content to set a registry mirror (e.g., the fast Taobao mirror):

```text
registry=https://registry.npmmirror.com
```

# To set it via command line:

```bash
npm config set registry https://registry.npmmirror.com
```

# example of install some package with npm mirror:

```bash
npm install --registry="https://registry.npmmirror.com" yarn
```
