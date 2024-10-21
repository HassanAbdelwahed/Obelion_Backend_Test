# Obelion_Backend_Test

## Deployment 
Application deplyed on AWS

```bash
http://18.209.229.144:8800
```

Application also dockerized using docker compose

## Documentation using Swagger
```bash
http://18.209.229.144:8800/api-docs/
```

### Note for search and filter

examples:

```bash
http://18.209.229.144:8800/api/books?title=string&author=string
```

```bash
http://18.209.229.144:8800/api/books?fields=title,author
```

```bash
http://18.209.229.144:8800/api/books?borrowedCount[gte]=2
```
