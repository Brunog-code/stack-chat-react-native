import prisma from "../../src/lib/prisma.js";
import { faker } from "@faker-js/faker"; // npm i @faker-js/faker

async function main() {
  // 1️⃣ Criar usuários
  const usersData = [];
  for (let i = 1; i <= 10; i++) {
    usersData.push({
      name: faker.person.firstName() + " " + faker.person.lastName(),
      email: `user${i}@teste.com`,
      password: "123456",
      image: faker.image.avatar(),
    });
  }

  const users = [];
  for (const user of usersData) {
    const u = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    users.push(u);
  }
  console.log("Usuários criados!");

  // 2️⃣ Criar chatRooms
  const chatRoomsData = [
    {
      name: "JavaScript",
      description:
        "Discussões sobre JavaScript, Node.js, React e o ecossistema JS.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968832/javascript_kxgoia.png",
    },
    {
      name: "Python",
      description: "Python para web, automações, data science e IA.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968834/python_m1pchn.png",
    },
    {
      name: "Java",
      description: "Java, Spring Boot e desenvolvimento backend.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968840/java_lawsjg.png",
    },
    {
      name: "C",
      description: "Programação em C, memória e baixo nível.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968830/c_sqty8t.png",
    },
    {
      name: "C++",
      description: "C++ para alta performance e jogos.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968829/cplus_cp2aoq.png",
    },
    {
      name: "C#",
      description: ".NET, ASP.NET e aplicações Microsoft.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968830/csharp_ismc6d.png",
    },
    {
      name: "Ruby",
      description: "Ruby e Ruby on Rails.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968835/ruby_trgfek.jpg",
    },
    {
      name: "Rust",
      description: "Rust para sistemas seguros e performáticos.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968829/rust_fkfnxn.png",
    },
    {
      name: "PHP",
      description: "PHP, Laravel e desenvolvimento web.",
      image:
        "https://res.cloudinary.com/dcxpgtvqf/image/upload/v1771968833/php_czjdlo.png",
    },
  ];

  const chatRooms = [];
  for (const room of chatRoomsData) {
    const r = await prisma.chatRoom.upsert({
      where: { name: room.name },
      update: {},
      create: { ...room, isPrivate: false },
    });
    chatRooms.push(r);
  }
  console.log("ChatRooms criadas!");

  // 3️⃣ Adicionar usuários como membros de cada chat e setar lastReadAt
  for (const room of chatRooms) {
    for (let i = 0; i < users.length; i++) {
      const isLastUser = i === users.length - 1; // último usuário vai ter lastReadAt null
      await prisma.chatMember.upsert({
        where: {
          userId_chatRoomId: { userId: users[i].id, chatRoomId: room.id },
        },
        update: {},
        create: {
          userId: users[i].id,
          chatRoomId: room.id,
          role: "member",
          lastReadAt: isLastUser ? null : new Date(),
        },
      });
    }
  }
  console.log("Usuários adicionados aos chats com lastReadAt!");

  // 4️⃣ Criar mensagens de teste (15 mensagens por chat)
  const messageContents = [
    "Olá pessoal!",
    "Como estão?",
    "Alguém conhece esse framework?",
    "Preciso de ajuda com um bug.",
    "Isso é incrível!",
    "Vamos fazer pair programming?",
    "Alguém testou essa versão nova?",
    "Boa noite a todos!",
    "Sugestões de livros?",
    "Qual IDE vocês usam?",
    "Gostei desse tutorial.",
    "Alguém quer colaborar?",
    "Achei interessante esse artigo.",
    "Podem revisar meu código?",
    "Que desafio legal!",
  ];

  for (const room of chatRooms) {
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      await prisma.message.create({
        data: {
          chatRoomId: room.id,
          userId: user.id,
          content: messageContents[i],
          messageType: "text",
        },
      });
    }
  }
  console.log("Mensagens criadas em todos os chats!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
