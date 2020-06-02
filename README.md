# Snipy Importer

[![asciicast](https://asciinema.org/a/DWGG308QH4mp8UkU2UuS6YYOv.svg)](https://asciinema.org/a/DWGG308QH4mp8UkU2UuS6YYOv)

This handy CLI tool will help you import your code from various services into Snipy. To use it:

Install dependencies:

    yarn install

Run interactive importer:

    yarn cli

## Snipy API key

To use this tool, you will need Snipy API credentials. Since our API is not yet available to the public (you can access it, but it's not supported ;), you can use your login token, which you can get by following these steps:

- Open the _Keychain Access_ app on your Mac
- Pick _Login_ keychain and find `snipy-auth` authentication credentials
- Double-click it and reveal the token to use during the import process

## Importers

The following importers are supported:

### GitHub Gist

All your public and private Gists will be imported into a Snippet collection, which will be automatically created.
To use this importer, have your [personal GitHub access token](https://github.com/settings/tokens) with a `gist` scope ready.

## References

The source code for this tool is heavily based on the excellent work from the team at [Linear](https://github.com/linearapp/linear-import) 🙌.
