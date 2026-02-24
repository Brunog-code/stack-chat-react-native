import prisma from "../../src/lib/prisma.js";

async function main() {
  const chatRooms = [
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

  for (const room of chatRooms) {
    await prisma.chatRoom.upsert({
      where: { name: room.name },
      update: {},
      create: {
        name: room.name,
        description: room.description,
        image: room.image,
        isPrivate: false,
      },
    });
  }

  console.log("ChatRooms criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
