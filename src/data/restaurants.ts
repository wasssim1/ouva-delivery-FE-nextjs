const GUITARA_RESTAURANT = {
  slug: "guitara",
  name: "Guitara",
  description: "Guitara is a restaurant that serves delicious food",
  address: "Mourouj 3, TN",
  zone: "el-mourouj",
  logo: "https://ouvadelivery.com/wp-content/uploads/2022/06/WhatsApp-Image-2022-06-03-at-15.27.26-300x300.jpeg",
  image:
    "https://ouvadelivery.com/wp-content/uploads/2023/05/guitar-scaled.jpg",
  shippingCost: {
    isFreeShipping: false,
    minOrder: 30,
    cost: 3,
  },
  deliveryTime: {
    min: 30,
    max: 45,
  },
  storeMaxOrderCount: 5,
  categories: ["pizza", "pasta", "salad", "dessert", "drinks"],
  menuSections: [
    {
      sectionSlug: "pizza",
      sectionTitle: "Pizza",
      menuItems: [
        {
          slug: "margherita",
          name: "Margherita",
          description: "Mozzarella, Sauce tomate, Olive",
          basePrice: 7.5,
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/pizza-margher.jpg?zoom=2&resize=600%2C300&ssl=1",
          ingredients: ["tomato", "mozzarella", "basil"],
          options: [
            {
              optionKey: "size",
              optionValues: [
                {
                  slug: "mini",
                  name: "Mini",
                  price: 7.5,
                },
                {
                  name: "Medium",
                  price: 12,
                  slug: "medium",
                },
                {
                  name: "Large",
                  price: 17.5,
                  slug: "large",
                },
              ],
            },
            // {
            //   optionKey: "size-tst",
            //   optionValues: [
            //     {
            //       slug: "mini",
            //       name: "Mini",
            //       price: 75,
            //     },
            //     {
            //       name: "Medium",
            //       price: 120,
            //       slug: "medium",
            //     },
            //   ],
            // },
          ],
          extras: [
            {
              slug: "pepperoni",
              name: "Pepperoni",
              extraPrice: 1.5,
            },
            {
              slug: "mushrooms",
              name: "Mushrooms",
              extraPrice: 1,
            },
          ],
        },
        {
          slug: "neptune",
          name: "Neptune",
          description: "Mozzarella, Sauce tomate, Thon",
          basePrice: 7.5,
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/pizza-margher.jpg?zoom=2&resize=600%2C300&ssl=1",
          ingredients: ["tomato", "mozzarella", "tuna"],
          options: [
            {
              optionKey: "size",
              optionValues: [
                {
                  slug: "mini",
                  name: "Mini",
                  price: 7.5,
                },
                {
                  name: "Medium",
                  price: 12,
                  slug: "medium",
                },
                {
                  name: "Large",
                  price: 17.5,
                  slug: "large",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sectionSlug: "sandwich",
      sectionTitle: "Sandwich",
      menuItems: [
        {
          slug: "tabouna",
          name: "Tabouna",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/tabouna.jpg?fit=1280%2C720&ssl=1",
          basePrice: 7.5,
          ingredients: ["tomato", "harissa", "olive"],
          options: [
            {
              slug: "thon",
              name: "Thon",
              price: 7.5,
            },
            {
              slug: "chawarma",
              name: "Chawarma",
              price: 8,
            },
            {
              slug: "escaloppe",
              name: "Escaloppe",
              price: 9,
            },
          ],
          extras: [
            {
              slug: "frites",
              name: "Frites",
              extraPrice: 1.5,
            },
            {
              slug: "fromage",
              name: "Fromage",
              extraPrice: 1.5,
            },
          ],
        },
        {
          slug: "libanais",
          name: "Libanais",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/libanais-a.jpg?w=600&ssl=1",
          basePrice: 8.5,
          ingredients: ["tomato", "harissa", "olive"],
          options: [
            {
              slug: "thon",
              name: "Thon",
              price: 8.5,
            },
            {
              slug: "merguez",
              name: "Merguez",
              price: 9,
            },
            {
              slug: "escaloppe",
              name: "Escaloppe",
              price: 10,
            },
          ],
          extras: [
            {
              slug: "fromage",
              name: "Fromage",
              extraPrice: 2,
            },
            {
              slug: "double-fromage",
              name: "Double Fromage",
              extraPrice: 3.5,
            },
          ],
        },
      ],
    },
  ],
  rating: 3,
  reviews: [],
};

const SHES_CAKE_RESTAURANT = {
  slug: "shes-cake",
  name: "She's Cake",
  address: "Mourouj 5, TN",
  zone: "el-mourouj",
  logo: "https://ouvadelivery.com/wp-content/uploads/2023/06/344769648_255615043492416_2712909520938809756_n.jpg",
  image: "https://ouvadelivery.com/wp-content/uploads/2022/05/crepe.jpg",
  rating: 4.5,
  shippingCost: {
    isFreeShipping: false,
    minOrder: 0,
    cost: 2.5,
  },
  deliveryTime: {
    min: 30,
    max: 45,
  },
  categories: ["crepe", "cake", "glace", "dessert"],
  tags: [
    {
      slug: "glace",
      name: "Glace",
    },
    {
      slug: "crepe",
      name: "Crepe",
    },
    {
      slug: "cake",
      name: "Cake",
    },
  ],
  menuSections: [
    {
      sectionSlug: "crepe-gauffre",
      sectionTitle: "Crepe & Gauffre",
      menuItems: [
        {
          slug: "crepe-au-chocolat",
          name: "Crepe au chocolat",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2023/06/crepe-rolls-600x300.jpg",
          description: "Chocolat, Banane, Chantilly",
          basePrice: 5,
          ingredients: ["chocolate", "banana", "chantilly"],
          options: [
            {
              slug: "nutella",
              name: "Nutella",
              price: 5,
            },
            {
              slug: "chocolat-fruits-secs",
              name: "Chocolat, Fruits secs",
              price: 8,
            },
          ],
          extras: [
            {
              slug: "fraise",
              name: "Fraise",
              extraPrice: 1,
            },
            {
              slug: "kiwi",
              name: "Kiwi",
              extraPrice: 1.5,
            },
          ],
        },
        {
          slug: "gauffre-chocolat",
          name: "Gauffre au chocolat",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/gauffre-sucree.jpg?w=1152&ssl=1",
          description: "Chocolat, Fraise, Chantilly",
          basePrice: 13.5,
          ingredients: ["chocolate", "fraise", "chantilly"],
          options: [
            {
              slug: "nutella",
              name: "Nutella",
              price: 5,
            },
            {
              slug: "chocolat-fruits-secs",
              name: "Chocolat, Fruits secs",
              price: 8,
            },
          ],
          extras: [
            {
              slug: "fraise",
              name: "Fraise",
              extraPrice: 1,
            },
            {
              slug: "kiwi",
              name: "Kiwi",
              extraPrice: 1.5,
            },
          ],
        },
        {
          slug: "crepe-thon-fromage",
          name: "Crepe Thon Fromage",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/05/crepe-sale.jpg?w=773&ssl=1",
          description: "Thon, Fromage, Olive",
          basePrice: 11.5,
          ingredients: ["thon", "fromage", "olive"],
          extras: [
            {
              slug: "double-fromage",
              name: "Double Fromage",
              extraPrice: 2,
            },
            {
              slug: "harissa",
              name: "Harissa",
              extraPrice: 0,
            },
          ],
        },
      ],
    },
    {
      sectionSlug: "boul-bool",
      sectionTitle: "Boul & Bool",
      menuItems: [
        {
          slug: "boul-bool-7-boules",
          name: "Boul & Bool (7 Boules)",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2023/06/shes-1.jpg?resize=1024%2C1004&ssl=1",
          description: "7 boules de glace",
          basePrice: 9.5,
          ingredients: ["glace", "chocolat"],
          options: [
            {
              slug: "nutella",
              name: "Nutella",
              price: 5,
            },
            {
              slug: "chocolat-fruits-secs",
              name: "Chocolat, Fruits secs",
              price: 8,
            },
          ],
        },
      ],
    },
    {
      sectionSlug: "cake",
      sectionTitle: "Cake",
      menuItems: [
        {
          slug: "tiramisu",
          name: "Tiramisu",
          image:
            "https://ouvadelivery.com/wp-content/uploads/2022/10/tiramisu.jpg?w=660&ssl=1",
          description: "Biscuit, Café, Mascarpone",
          basePrice: 8,
          ingredients: ["biscuit", "cafe", "mascarpone"],
        },
      ],
    },
  ],
};

export const RESTAURANTS_LIST_DATA = [GUITARA_RESTAURANT, SHES_CAKE_RESTAURANT];

const tt = {
  basketItemKey: "margherita_size-mini_pepperoni-mushrooms",
  menuItemInfo: {
    slug: "margherita",
    name: "Margherita",
    description: "Mozzarella, Sauce tomate, Olive",
    basePrice: 7.5,
    image:
      "https://ouvadelivery.com/wp-content/uploads/2022/05/pizza-margher.jpg?zoom=2&resize=600%2C300&ssl=1",
    ingredients: ["tomato", "mozzarella", "basil"],
    options: [
      {
        optionKey: "size",
        optionValues: [
          { slug: "mini", name: "Mini", price: 7.5 },
          { name: "Medium", price: 12, slug: "medium" },
          { name: "Large", price: 17.5, slug: "large" },
        ],
      },
    ],
    extras: [
      { slug: "pepperoni", name: "Pepperoni", extraPrice: 1.5 },
      { slug: "mushrooms", name: "Mushrooms", extraPrice: 1 },
    ],
  },
  quantity: 1,
  finalUnitPrice: 0,
  selectedOptions: [
    {
      optionKey: "size",
      optionValue: { slug: "mini", name: "Mini", price: 7.5 },
    },
  ],
  unitPrice: 17.5,
  selectedExtras: [
    { slug: "pepperoni", name: "Pepperoni", extraPrice: 1.5 },
    { slug: "mushrooms", name: "Mushrooms", extraPrice: 1 },
  ],
};
