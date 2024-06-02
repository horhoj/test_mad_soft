# ДЕМО

https://test-mad-soft.vercel.app/

# тестовое для вашей компании

В проекте используется система контрактов обеспечивающая взаимодействие между моковым бекендом и фронтенд частью (контракты описаны в src/contracts/testApi.contracts.ts)

Для расширения видов ответа нужно поправить контракт QuestionDataContract с помощью фабрики типов QuestionDataContractTypeFactory и подключить новую форму обработки ответа в TestingPage.tsx

# Используется: 

vite, react, typescript, redux-tookit, docker(docker-compose), nginx (для раздачи статики билда), eslint + prettier

# запуск

npm i

npm run dev

# тесты

npm run test

# запуск в докере (протестировано только на линукс, нужны make, docker, docker-compose)

запуск в режиме разработки (порт 3000)

make docker-ddev

запуск в режиме раздачи билда через nginx (порт 80)

make docker-init


разумеется порты можно поменять в настройках
