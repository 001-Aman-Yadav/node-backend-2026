import { prisma } from "../prisma/prisma_client.mjs";

const createMenu = async (req, res) => {
  console.log(req.body);
  const menu = await prisma.menu.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      price_half: req.body.price_half,
      price_full: req.body.price_full,
    },
  });
  res.json(menu);
};

const getMenus = async (req, res) => {
  res.json({ key: "get menus" });
};
const updateMenu = async (req, res) => {
  res.json({ key: "update menu" });
};
const deleteMenu = async (req, res) => {
  res.json({ key: "delete menu" });
};

export { createMenu, getMenus, updateMenu, deleteMenu };
