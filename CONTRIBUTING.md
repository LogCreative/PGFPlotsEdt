# Contributing to PGFPlotsEdt

Welcome to contribute to PGFPlotsEdt! Feel free to file issues for suggestions and create pull requests for improvements.

## Translation

PGFPlotsEdt supports multiple languages. To contribute your translation, there are mainly three parts to finish:

- **Interface**: [lang/en.js](lang/en.js) is the JSON-like translation table for the interface. Create your own file `lang/[lang].js` and add it to the [HTML](https://github.com/LogCreative/PGFPlotsEdt/blob/44a8ef1d27f2969be4dca734b1e53eb1d8f9ae19/index.html#L488-L489).
- **Data**: [lang/dict_en.js](lang/dict_en.js) contains JavaScript variables for parameter translation tables. Create your own file `lang/dict_[lang].js` and now you can add it to the [options](https://github.com/LogCreative/PGFPlotsEdt/blob/44a8ef1d27f2969be4dca734b1e53eb1d8f9ae19/index.html#L18-L19).
- **Docs**: [docs/README.md](docs/README.md) is the documentation in Markdown format. Create your own file `docs/README_[lang].md`, run `cd docs && PPEDT_LANG=[lang] l3build doc` locally, and add it to the [workflow](https://github.com/LogCreative/PGFPlotsEdt/blob/44a8ef1d27f2969be4dca734b1e53eb1d8f9ae19/.github/workflows/doc-gen.yml#L29-L30).

Your translation will make PGFPlotsEdt accessible to more people!
