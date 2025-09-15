# МДиСУБД ФЕДОТОВ 353501

## Автомобильный маркетплейс

### Функциональные требования:

Базовые:
- Авторизация и аутентификация
- Роли (админ, менеджер, клиента и т.д.)
- Журналирование действий пользователя

Специфичные
- Гибкая настройка информации об автомоблях (функционал каталога):
  - Администрация может добавлять новые конфигурации автомобилей
- Простое размещение объявлений, выбрав конфигурацию автомобиля из каталога
  - Загрузка изображений и файлов (Документов) об автомобиле


## Текстовое описание сущностей

- USER – пользователи системы (администраторы, менеджеры, клиенты). Хранятся основные данные (имя, e-mail, пароль).
- ROLE – роли пользователей (например, admin, manager, client).
- USER_ROLE – таблица связей "многие-ко-многим" между пользователями и ролями.
- LISTING – объявления о продаже автомобиля. Содержат заголовок, описание, пробег, цену, информацию о модификации автомобиля.
- IMAGE – изображения автомобиля, прикрепленные к объявлению. Хранят URL и порядок отображения.
- DOCUMENT – документы, прикрепленные к объявлению (например, ПТС, страховка).
- COUNTRY – страны, в которых расположены производители.
- MANUFACTURER – производители автомобилей (например, BMW, Toyota). Привязаны к стране.
- CAR_MODEL – модель автомобиля (например, Camry, 3 Series). Привязана к производителю.
- GENERATION – поколение модели (например, Camry XV70). Имеет годы выпуска.
- MODIFICATION – конкретная модификация автомобиля (комбинация двигателя, коробки передач и кузова).
- ENGINE – характеристики двигателя (тип, конфигурация, мощность, крутящий момент, объем).
- TRANSMISSION – характеристики трансмиссии (тип, количество передач).
- BODY – тип кузова (седан, хэтчбек и т. д.).
- USER_ACTIVITY – журнал действий пользователей (какое действие, над какой сущностью, когда и с деталями).

```mermaid
---
config:
  theme: redux-color
  layout: dagre
---
erDiagram
    USER ||--o{ LISTING : "создает"
    USER ||--o{ USER_ACTIVITY : "логирует"
    COUNTRY || -- o{ MANUFACTURER : ""
    MANUFACTURER ||--o{ CAR_MODEL : "выпускает"
    CAR_MODEL ||--o{ GENERATION : "имеет"
    GENERATION ||--o{ MODIFICATION : "содержит"
    ENGINE ||--o{ MODIFICATION : "используется в"
    TRANSMISSION ||--o{ MODIFICATION : "используется в"
    BODY ||--o{ MODIFICATION : "используется в"
    MODIFICATION ||--o{ LISTING : "используется в"
    LISTING ||--o{ IMAGE : "содержит"
    LISTING ||--|| DOCUMENT : "имеет"
    USER ||--o{ USER_ROLE : ""
    ROLE ||--o{ USER_ROLE : ""
    
USER {
    int id PK
    string name
    string email "UNIQUE NOT NULL"
    string password_hash "NOT NULL"
    datetime created_at 
}
ROLE {
    int id PK
    string name "UNIQUE NOT NULL"
}
USER_ROLE {
    int user_id PK, FK 
    int role_id PK, FK 
}
LISTING {
    int id PK
    string title "NOT NULL"
    text description
    int mileage "CHECK (mileage >= 0)"
    decimal price "CHECK (price >= 0)"
    int user_id FK 
    int modification_id FK 
    datetime created_at "DEFAULT CURRENT_TIMESTAMP"
}
IMAGE {
    int id PK
    string url "NOT NULL"
    int order "CHECK (order >= 0)"
    int listing_id FK 
}
DOCUMENT {
    int id PK
    string url "NOT NULL"
    int listing_id FK 
}
COUNTRY {
    int id PK
    string name "UNIQUE NOT NULL"
}
MANUFACTURER {
    int id PK
    string name "NOT NULL"
    int country_id FK 
}
CAR_MODEL {
    int id PK
    string name "NOT NULL"
    int manufacturer_id FK
}
GENERATION {
    int id PK
    string name "NOT NULL"
    int start_year
    int car_model_id FK
}
MODIFICATION {
    int id PK
    string name "NOT NULL"
    int generation_id FK 
    int engine_id FK
    int transmission_id FK 
    int body_id FK 
}
ENGINE {
    int id PK
    string type "NOT NULL"
    string configuration
    int power_kw "CHECK (power_kw > 0)"
    int torque_nm "CHECK (torque_nm > 0)"
    decimal displacement "CHECK (displacement > 0)"
}
TRANSMISSION {
    int id PK
    string type "NOT NULL"
    int gears_num "CHECK (gears_num > 0)"
}
BODY {
    int id PK
    string type "NOT NULL"
}
USER_ACTIVITY {
    int id PK
    int user_id FK 
    string action "NOT NULL"
    string entity "NOT NULL"
    int entity_id
    datetime timestamp 
    text details
}

```