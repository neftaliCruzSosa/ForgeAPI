import { updateModels } from "../src/index.js";

async function main() {
  const projectName = "demo-social-api";

  const changes = [
    {
      option: "create",
      entity: {
        name: "Category",
        fields: [
          { name: "name", type: "String", required: true },
          { name: "description", type: "String" },
        ],
        protect: {
          create: "admin",
          update: "admin",
          delete: "admin",
          getAll: "auth",
        },
      },
    },

    {
      option: "update",
      entity: {
        name: "Post",
        fields: [
          { name: "title", type: "String", required: true },
          { name: "content", type: "String" },
          { name: "tags", type: "Array" },
          { name: "category", type: "ref", ref: "Category", required: true },
        ],
        protect: {
          create: "auth",
          update: "self",
          delete: "self",
          restore: "admin",
          hardDelete: "admin",
        },
      },
    },

    {
      option: "delete",
      entity: { name: "Like"},
    },
  ];

  try {
    await updateModels({ projectName, changes });
    console.log("Cambios aplicados y regeneración completada.");
  } catch (err) {
    console.error("❌ Error en test-demo-update:", err);
    process.exit(1);
  }
}

main();
