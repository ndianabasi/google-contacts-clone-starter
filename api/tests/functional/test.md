TESTING API

Writing various functional tests for the backend API endpoints.

import Route from '@ioc:Adonis/Core/Route'

- Create a new contact

```js
Route.post('/contacts', 'ContactsController.store')
```

- Edit an existing contact

```js
Route.put('/contacts/:id', 'ContactsController.update').middleware(['findContact'])
```

- Fetch an existing contact

```js
Route.get('/contacts/:id', 'ContactsController.show').middleware(['findContact'])
```

- Delete an existing contact

```js
Route.delete('contacts/:id', 'ContactsController.destroy').middleware(['findContact'])
```

- Fetch users via pagisntion

```js
Route.get('/contacts', 'ContactsController.index')
```

ApiResponse.response.res.text.data.meta

INDEX

```js
"data": {
        "meta": {
            "total": 103,
            "per_page": 5,
            "current_page": 3,
            "last_page": 21,
            "first_page": 1,
            "first_page_url": "/?page=1",
            "last_page_url": "/?page=21",
            "next_page_url": "/?page=4",
            "previous_page_url": "/?page=2"
        },
        "data": [
            {
                "id": "clsripuhp0007b0ep99i25ae6",
                "first_name": "Camille",
                "surname": "Mayert",
                "email1": "Camille39@yahoo.com",
                "phone_number1": "465-477-8698",
                "company": "Connelly - Macejkovic",
                "job_title": null
            },
            {
                "id": "clsripuhs0008b0ep2e09e5mr",
                "first_name": "Jeremy",
                "surname": "Nitzsche",
                "email1": "Jeremy13@gmail.com",
                "phone_number1": "1-912-451-8282 x0280",
                "company": "Brekke - Kuvalis",
                "job_title": null
            },
            {
                "id": "clsripuhv0009b0ep84qhazf3",
                "first_name": "Thomas",
                "surname": "Gorczany",
                "email1": "Thomas_Gorczany@yahoo.com",
                "phone_number1": "722-337-6981 x16671",
                "company": "Emard, Smitham and Grant",
                "job_title": null
            },
            {
                "id": "clsripuhx000ab0epeljrbn4p",
                "first_name": "Lindsey",
                "surname": "Larkin",
                "email1": "Lindsey.Larkin@yahoo.com",
                "phone_number1": "(591) 528-7794",
                "company": "Powlowski LLC",
                "job_title": "Direct Quality Manager"
            },
            {
                "id": "clsripui0000bb0ep3yix02f9",
                "first_name": "Victoria",
                "surname": "Skiles",
                "email1": "Victoria94@gmail.com",
                "phone_number1": "885.602.3024 x57080",
                "company": "Marks, Von and Quitzon",
                "job_title": "Central Tactics Representative"
            }
        ]
    }
}
```
